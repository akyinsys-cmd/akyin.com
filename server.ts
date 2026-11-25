import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { GoogleGenAI } from '@google/genai';
import { buildMarkdownForRoute } from './src/utils/agentMarkdown';
import {
  OFFICIAL_CONTACT,
  VENTURES_PORTFOLIO,
} from './src/data/akyinData';
import { handleRazorpayWebhook, registerSuiteRoutes } from './server/routes';
import { readDb } from './server/storage';
import { buildDynamicSitemapXml, renderSeoHtml } from './server/seoRenderer';
import { startSubscriptionReminderScheduler } from './server/scheduler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

interface NewsArticle {
  headline: string;
  summary: string;
  category: string;
  publisher: string;
  publishedHint: string;
  url: string;
}

interface GroundingSource {
  title: string;
  url: string;
}

const TOPIC_PROMPTS: Record<string, string> = {
  all: 'latest automotive dealership sales trends, digital marketing strategies, meta and search lead generation, and showroom conversion benchmarks in 2025 and 2026',
  leadgen:
    'latest automotive dealership digital lead generation trends, Meta and Google vehicle ads, cost per lead optimization, and automotive marketing campaigns in 2025 and 2026',
  ev:
    'latest electric vehicle EV dealership marketing trends, online car buying journeys, digital showroom tools, and customer acquisition strategies in 2025 and 2026',
  crm:
    'latest automotive dealership CRM automation, AI lead qualification, WhatsApp showroom follow-up, and automotive sales training trends in 2025 and 2026',
};

type GeminiClientResult =
  | { client: GoogleGenAI; ThinkingLevel: typeof import('@google/genai').ThinkingLevel; reason: null }
  | { client: null; ThinkingLevel: null; reason: 'API_KEY_MISSING' | 'API_KEY_INVALID_FORMAT' };

async function createGeminiClient(): Promise<GeminiClientResult> {
  let apiKey = (process.env.GEMINI_API_KEY ?? '')
    .trim()
    .replace(/^(['"])(.*)\1$/, '$2')
    .trim()
    .replace(/^Bearer\s+/i, '')
    .trim();

  if (
    !apiKey ||
    apiKey === 'MY_GEMINI_API_KEY' ||
    /^(your_|replace_|test_|changeme|<.*>)/i.test(apiKey)
  ) {
    return { client: null, ThinkingLevel: null, reason: 'API_KEY_MISSING' };
  }

  // OAuth access tokens (ya29.*) or tokens with whitespace are rejected by x-goog-api-key
  if (/\s/.test(apiKey) || apiKey.startsWith('ya29.')) {
    return { client: null, ThinkingLevel: null, reason: 'API_KEY_INVALID_FORMAT' };
  }

  const { GoogleGenAI: GenAIClient, ThinkingLevel } = await import('@google/genai');
  return {
    client: new GenAIClient({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    }),
    ThinkingLevel,
    reason: null,
  };
}

interface ClassifiedGeminiError {
  httpStatus: number;
  code: string;
  clientMessage: string;
  retryable: boolean;
  isAuthError: boolean;
}

function classifyGeminiError(err: unknown): ClassifiedGeminiError {
  const rawMessage = err instanceof Error ? err.message : String(err ?? '');
  const statusProp =
    typeof err === 'object' && err !== null && 'status' in err
      ? Number((err as { status?: unknown }).status)
      : NaN;

  const isAuthError =
    statusProp === 401 ||
    statusProp === 403 ||
    /"code"\s*:\s*(401|403)/.test(rawMessage) ||
    /API_KEY_INVALID|ACCESS_TOKEN_TYPE_UNSUPPORTED|API key not valid|UNAUTHENTICATED|PERMISSION_DENIED/i.test(
      rawMessage
    );

  if (isAuthError) {
    return {
      httpStatus: 401,
      code: 'API_KEY_INVALID',
      clientMessage:
        'Live Google Search headlines require a valid Gemini API key in Settings > Secrets.',
      retryable: false,
      isAuthError: true,
    };
  }

  const isQuotaError =
    statusProp === 429 ||
    /"code"\s*:\s*429/.test(rawMessage) ||
    /RESOURCE_EXHAUSTED/i.test(rawMessage);

  if (isQuotaError) {
    return {
      httpStatus: 429,
      code: 'QUOTA_EXCEEDED',
      clientMessage:
        'Live Google Search headline quota is temporarily exhausted. Please check your Gemini API plan or retry shortly.',
      retryable: true,
      isAuthError: false,
    };
  }

  const isModelNotFound =
    statusProp === 404 ||
    /"code"\s*:\s*404/.test(rawMessage) ||
    /NOT_FOUND/i.test(rawMessage);

  if (isModelNotFound) {
    return {
      httpStatus: 502,
      code: 'MODEL_NOT_FOUND',
      clientMessage: 'The configured headline search model is currently unavailable.',
      retryable: false,
      isAuthError: false,
    };
  }

  const isClientBadRequest = statusProp === 400 || /"code"\s*:\s*400/.test(rawMessage);
  if (isClientBadRequest) {
    return {
      httpStatus: 502,
      code: 'INVALID_UPSTREAM_REQUEST',
      clientMessage: 'Unable to complete live Google Search headline lookup right now.',
      retryable: false,
      isAuthError: false,
    };
  }

  return {
    httpStatus: 502,
    code: 'UPSTREAM_ERROR',
    clientMessage: 'Live Google Search headlines are temporarily unavailable. Please try again shortly.',
    retryable: true,
    isAuthError: false,
  };
}



function extractJsonArray(rawText: string): NewsArticle[] {
  const cleaned = rawText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  const startIdx = cleaned.indexOf('[');
  const endIdx = cleaned.lastIndexOf(']');
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    return [];
  }

  try {
    const parsed = JSON.parse(cleaned.slice(startIdx, endIdx + 1)) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
      .map((item) => ({
        headline: typeof item.headline === 'string' ? item.headline.trim() : '',
        summary: typeof item.summary === 'string' ? item.summary.trim() : '',
        category: typeof item.category === 'string' ? item.category.trim() : 'Dealership Growth',
        publisher: typeof item.publisher === 'string' ? item.publisher.trim() : 'Automotive Press',
        publishedHint:
          typeof item.publishedHint === 'string' ? item.publishedHint.trim() : 'Recent',
        url: typeof item.url === 'string' ? item.url.trim() : '',
      }))
      .filter((item) => item.headline.length > 0 && item.summary.length > 0)
      .slice(0, 6);
  } catch {
    return [];
  }
}

function resolvePublicOrDistFile(relPath: string): string | null {
  const distCandidate = path.resolve(__dirname, 'dist', relPath);
  if (fs.existsSync(distCandidate)) return distCandidate;
  const publicCandidate = path.resolve(__dirname, 'public', relPath);
  if (fs.existsSync(publicCandidate)) return publicCandidate;
  return null;
}

function wantsMarkdown(req: Request): boolean {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  const accept = (req.headers.accept || '').toLowerCase();
  if (!accept.includes('text/markdown')) return false;
  if (
    req.path.startsWith('/api/') ||
    req.path.startsWith('/assets/') ||
    req.path.startsWith('/downloads/') ||
    req.path.startsWith('/.well-known/')
  ) {
    return false;
  }
  if (/\.[a-z0-9]{2,6}$/i.test(req.path)) return false;
  return true;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

function createRateLimiter(options: {
  windowMs: number;
  max: number;
  code: string;
  message: string;
}) {
  const buckets = new Map<string, RateLimitBucket>();
  let lastPrune = Date.now();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    if (now - lastPrune > options.windowMs || buckets.size > 2000) {
      for (const [k, entry] of buckets.entries()) {
        if (entry.resetAt <= now) {
          buckets.delete(k);
        }
      }
      lastPrune = now;
    }

    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const existing = buckets.get(clientIp);
    if (!existing || existing.resetAt <= now) {
      buckets.set(clientIp, { count: 1, resetAt: now + options.windowMs });
      next();
      return;
    }

    if (existing.count >= options.max) {
      const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfterSec));
      res.status(429).json({
        error: options.message,
        code: options.code,
      });
      return;
    }

    existing.count += 1;
    next();
  };
}

interface CachedNewsEntry {
  expiresAt: number;
  payload: {
    topic: string;
    fetchedAt: string;
    articles: NewsArticle[];
    sources: GroundingSource[];
  };
}

const automotiveNewsCache = new Map<string, CachedNewsEntry>();
const AUTOMOTIVE_NEWS_CACHE_TTL_MS = 5 * 60 * 1000;

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Baseline security, robots & agent Content-Signal headers (preserve AI Studio iframe compatibility)
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), geolocation=(), microphone=(self), payment=(self "https://checkout.razorpay.com")'
    );
    res.setHeader('Content-Signal', 'search=yes, ai-input=yes, ai-train=no');
    if (
      req.path.startsWith('/api/') ||
      req.path === '/admin' ||
      req.path.startsWith('/admin/') ||
      req.path === '/quote' ||
      req.path.startsWith('/quote/')
    ) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    }
    if (
      process.env.NODE_ENV === 'production' &&
      (req.secure || req.headers['x-forwarded-proto'] === 'https')
    ) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // Raw body route for Razorpay Webhooks MUST execute before express.json()
  app.post(
    '/api/razorpay/webhook',
    express.raw({ type: 'application/json', limit: '256kb' }),
    (req: Request, res: Response) => {
      void handleRazorpayWebhook(req, res);
    }
  );

  app.use(express.json({ limit: '128kb' }));
  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'status' in err && (err as { status?: number }).status === 400) {
      res.status(400).json({ error: 'Invalid JSON request payload.', code: 'INVALID_JSON' });
      return;
    }
    next(err);
  });

  const mcpRateLimiter = createRateLimiter({
    windowMs: 60_000,
    max: 60,
    code: 'MCP_RATE_LIMITED',
    message: 'Too many MCP requests. Please wait a minute before retrying.',
  });

  const newsRateLimiter = createRateLimiter({
    windowMs: 60_000,
    max: 20,
    code: 'NEWS_RATE_LIMITED',
    message: 'Too many headline sync requests. Please wait a minute before refreshing.',
  });

  // Explicit agent discovery endpoints (works identically in dev and prod)
  app.get('/robots.txt', (_req: Request, res: Response) => {
    const file = resolvePublicOrDistFile('robots.txt');
    if (file) {
      res.type('text/plain; charset=utf-8').sendFile(file);
      return;
    }
    res
      .type('text/plain; charset=utf-8')
      .send('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /quote\nDisallow: /api/\nContent-Signal: search=yes, ai-input=yes, ai-train=no\nSitemap: https://akyin.com/sitemap.xml\n');
  });

  app.get('/llms.txt', (_req: Request, res: Response) => {
    const file = resolvePublicOrDistFile('llms.txt');
    if (file) {
      res.type('text/markdown; charset=utf-8').sendFile(file);
      return;
    }
    res.type('text/markdown; charset=utf-8').send(buildMarkdownForRoute('/'));
  });

  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    try {
      const db = readDb();
      const xml = buildDynamicSitemapXml(db);
      res.type('application/xml; charset=utf-8').send(xml);
    } catch {
      const file = resolvePublicOrDistFile('sitemap.xml');
      if (file) {
        res.type('application/xml; charset=utf-8').sendFile(file);
        return;
      }
      res.status(404).send('Sitemap not found.');
    }
  });

  app.get('/.well-known/mcp/server-card.json', (_req: Request, res: Response) => {
    const file = resolvePublicOrDistFile(path.join('.well-known', 'mcp', 'server-card.json'));
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (file) {
      res.type('application/json; charset=utf-8').sendFile(file);
      return;
    }
    res.status(404).json({ error: 'MCP server card not found.' });
  });

  // Explicit route for downloadable business presentations & pricing documents (PDFs)
  app.get('/downloads/:filename', (req: Request, res: Response, next: NextFunction) => {
    const rawFilename = req.params.filename;
    const sanitizedFilename = path.basename(rawFilename);
    const resolvedPath = resolvePublicOrDistFile(path.join('downloads', sanitizedFilename));
    if (resolvedPath && fs.existsSync(resolvedPath)) {
      if (sanitizedFilename.toLowerCase().endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${sanitizedFilename}"`);
      }
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(resolvedPath);
    }
    next();
  });

  // Markdown content negotiation for AI agents requesting Accept: text/markdown
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (wantsMarkdown(req)) {
      const markdown = buildMarkdownForRoute(req.path);
      res.setHeader('Vary', 'Accept');
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.status(200).send(markdown);
      return;
    }
    next();
  });

  // Lightweight MCP Streamable HTTP endpoint (SEP-1649 target)
  app.get('/api/mcp', (_req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      name: 'akyin-ventures',
      version: '1.0.0',
      protocol: 'mcp-streamable-http',
      protocolVersion: '2024-11-05',
      endpoint: `${OFFICIAL_CONTACT.domain}/api/mcp`,
      capabilities: {
        tools: { listChanged: false },
        resources: { listChanged: false },
      },
    });
  });

  app.post('/api/mcp', mcpRateLimiter, (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const body = req.body as {
      jsonrpc?: string;
      id?: string | number | null;
      method?: string;
      params?: Record<string, unknown>;
    };

    const id = body?.id ?? null;
    const method = body?.method || '';

    if (method === 'initialize') {
      res.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: { listChanged: false },
            resources: { listChanged: false },
          },
          serverInfo: {
            name: 'akyin-ventures',
            version: '1.0.0',
          },
        },
      });
      return;
    }

    if (method === 'tools/list') {
      res.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: [
            {
              name: 'get_ventures',
              description:
                'List all seven operating ventures under AKYIN Ventures with descriptions, domains, and internal routes.',
              inputSchema: {
                type: 'object',
                properties: {
                  sector: { type: 'string', description: 'Optional sector filter.' },
                },
              },
            },
            {
              name: 'get_marketing_pricing',
              description:
                'Retrieve transparent INR standalone service catalogue and pricing across all 10 AKYIN MARKETINGS categories.',
              inputSchema: {
                type: 'object',
                properties: {
                  category: { type: 'string', description: 'Optional service category.' },
                },
              },
            },
            {
              name: 'get_contact_channels',
              description:
                'Get official corporate email, WhatsApp Connect, legal links, and social handles for AKYIN Ventures.',
              inputSchema: {
                type: 'object',
                properties: {},
              },
            },
          ],
        },
      });
      return;
    }

    if (method === 'tools/call') {
      const toolName = String(body?.params?.name || '');
      const args = (body?.params?.arguments || {}) as Record<string, unknown>;

      if (toolName === 'get_ventures') {
        const sector = typeof args.sector === 'string' ? args.sector.trim().toLowerCase() : '';
        const list = sector
          ? VENTURES_PORTFOLIO.filter(
              (v) =>
                v.sector.toLowerCase().includes(sector) ||
                v.name.toLowerCase().includes(sector)
            )
          : VENTURES_PORTFOLIO;

        res.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  list.map((v) => ({
                    code: v.code,
                    name: v.name,
                    sector: v.sector,
                    positioning: v.positioning,
                    url: `${OFFICIAL_CONTACT.domain}${v.route}`,
                    externalUrl: v.externalUrl || null,
                  })),
                  null,
                  2
                ),
              },
            ],
          },
        });
        return;
      }

      if (toolName === 'get_marketing_pricing') {
        const db = readDb();
        const cat = typeof args.category === 'string' ? args.category.trim().toLowerCase() : '';
        const activeServices = db.services
          .filter((s) => s.active)
          .filter((s) => !cat || s.category.toLowerCase().includes(cat))
          .sort((a, b) => (a.menuOrder ?? a.sortOrder) - (b.menuOrder ?? b.sortOrder))
          .map((s) => ({
            id: s.id,
            slug: s.slug,
            name: s.name,
            category: s.category,
            pricingModel: s.pricingModel,
            oneTimePrice: s.oneTimePrice,
            monthlyPrice: s.monthlyPrice,
            billingCycle: s.billingCycle,
            url: `${OFFICIAL_CONTACT.domain}/services/${s.slug}`,
          }));

        res.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    currency: 'INR',
                    pricingUrl: `${OFFICIAL_CONTACT.domain}/pricing`,
                    categories: (db.serviceCategories || []).filter((c) => c.active).map((c) => c.name),
                    services: activeServices,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
        return;
      }

      if (toolName === 'get_contact_channels') {
        res.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    organization: OFFICIAL_CONTACT.parentBrand,
                    email: OFFICIAL_CONTACT.email,
                    whatsappConnect: OFFICIAL_CONTACT.whatsappUrl,
                    whatsappUrl: OFFICIAL_CONTACT.whatsappUrl,
                    socials: OFFICIAL_CONTACT.marketingSocials,
                    termsUrl: `${OFFICIAL_CONTACT.domain}/terms`,
                    privacyUrl: `${OFFICIAL_CONTACT.domain}/privacy`,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
        return;
      }

      res.status(404).json({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Unknown tool: ${toolName}` },
      });
      return;
    }

    if (method === 'resources/list') {
      res.json({
        jsonrpc: '2.0',
        id,
        result: {
          resources: [
            {
              uri: 'https://akyin.com/llms.txt',
              name: 'AKYIN Ventures LLMs Summary',
              mimeType: 'text/markdown',
            },
            {
              uri: 'https://akyin.com/pricing',
              name: 'AKYIN Ventures INR Pricing & Rate Card',
              mimeType: 'text/markdown',
            },
          ],
        },
      });
      return;
    }

    res.status(400).json({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Unsupported MCP method: ${method}` },
    });
  });

  // Mount AKYIN Business Management Suite routes (CRM, Clients, Services, Quotations, Invoices, Razorpay, Reports, Appointments, Auth & Audit)
  registerSuiteRoutes(app);
  // Start background cron-like scheduler for upcoming monthly subscription renewal SMTP reminders
  startSubscriptionReminderScheduler();

  app.get('/api/automotive-news', newsRateLimiter, async (req: Request, res: Response) => {
    const topicKey =
      typeof req.query.topic === 'string' && req.query.topic in TOPIC_PROMPTS
        ? req.query.topic
        : 'all';

    const cached = automotiveNewsCache.get(topicKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.json(cached.payload);
      return;
    }

    const { client: ai, ThinkingLevel, reason } = await createGeminiClient();
    if (!ai || !ThinkingLevel) {
      res.status(503).json({
        error:
          reason === 'API_KEY_INVALID_FORMAT'
            ? 'Configured GEMINI_API_KEY is not a valid API key format. Please update GEMINI_API_KEY in Settings > Secrets.'
            : 'Live Google Search headlines require GEMINI_API_KEY to be configured in Settings > Secrets.',
        code: reason,
      });
      return;
    }

    const topicFocus = TOPIC_PROMPTS[topicKey];

    try {
      const requestParams = {
        model: 'gemini-4-hydrogen',
        contents: `Use Google Search to find 4 to 6 current, real-world industry news headlines and trends about ${topicFocus}.

Return ONLY a valid JSON array (no extra commentary) where each object contains:
- "headline": concise, factual headline (max 110 characters)
- "summary": 1-2 sentence practical takeaway for automotive dealership marketing & sales leaders (max 240 characters)
- "category": short category label such as "Lead Generation", "EV Retail", "CRM & AI", or "Showroom Sales"
- "publisher": publication or organization name
- "publishedHint": month/year or timeframe (e.g. "2026" or "Nov 2026")
- "url": source URL if found in search results, otherwise empty string ""`,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      };

      let response;
      const maxAttempts = 3;
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          response = await ai.models.generateContent(requestParams);
          break;
        } catch (attemptErr: unknown) {
          const classified = classifyGeminiError(attemptErr);
          if (!classified.retryable || attempt === maxAttempts) {
            throw attemptErr;
          }
          const delayMs = 300 * 2 ** (attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }

      if (!response) {
        throw new Error('Empty response from Gemini API.');
      }

      const rawText = response.text ?? '';
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

      const groundingSources: GroundingSource[] = [];
      const seenUrls = new Set<string>();
      for (const chunk of chunks) {
        const uri = chunk.web?.uri?.trim();
        const title = chunk.web?.title?.trim();
        if (uri && !seenUrls.has(uri)) {
          seenUrls.add(uri);
          groundingSources.push({
            title: title || uri,
            url: uri,
          });
        }
      }

      let articles = extractJsonArray(rawText);

      articles = articles.map((article, idx) => ({
        ...article,
        url: article.url || groundingSources[idx]?.url || groundingSources[0]?.url || '',
      }));

      if (articles.length === 0 && groundingSources.length > 0) {
        articles = groundingSources.slice(0, 6).map((src) => ({
          headline: src.title,
          summary:
            rawText.slice(0, 220).trim() ||
            'Recent industry coverage surfaced via Google Search grounding for automotive dealership marketing.',
          category: 'Industry Coverage',
          publisher: new URL(src.url).hostname.replace(/^www\./, ''),
          publishedHint: 'Google Search',
          url: src.url,
        }));
      }

      if (articles.length === 0) {
        res.status(502).json({
          error: 'Search completed but returned no structured automotive headlines. Please try syncing again.',
          code: 'EMPTY_RESULTS',
        });
        return;
      }

      const payload = {
        topic: topicKey,
        fetchedAt: new Date().toISOString(),
        articles,
        sources: groundingSources.slice(0, 8),
      };
      automotiveNewsCache.set(topicKey, {
        expiresAt: Date.now() + AUTOMOTIVE_NEWS_CACHE_TTL_MS,
        payload,
      });
      res.json(payload);
    } catch (err: unknown) {
      const classified = classifyGeminiError(err);
      if (classified.isAuthError) {
        console.warn(
          '[/api/automotive-news] Gemini API key rejected by upstream (401/403). Check GEMINI_API_KEY in Settings > Secrets.'
        );
      } else {
        const message =
          err instanceof Error ? err.message : 'Unable to fetch grounded automotive headlines.';
        console.warn(`[/api/automotive-news] ${classified.code}:`, message);
      }
      res.status(classified.httpStatus).json({
        error: classified.clientMessage,
        code: classified.code,
      });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(__dirname, 'dist');
    const indexFile = path.join(distDir, 'index.html');
    const cachedIndexHtml = fs.existsSync(indexFile) ? fs.readFileSync(indexFile, 'utf8') : null;

    app.use(express.static(distDir, { dotfiles: 'ignore' }));
    app.get('*', (req: Request, res: Response) => {
      if (!cachedIndexHtml) {
        res.status(404).send('Build output not found.');
        return;
      }
      const renderedHtml = renderSeoHtml(cachedIndexHtml, req.path, readDb());
      res.setHeader('Vary', 'Accept');
      res.type('text/html; charset=utf-8').send(renderedHtml);
    });
  } else {
    const vitePromise = import('vite')
      .then(({ createServer: createViteServer }) =>
        createViteServer({
          server: {
            middlewareMode: true,
            hmr: false,
            watch: null,
          },
          appType: 'spa',
        })
      );
    vitePromise.catch((err) => {
      console.error('[Vite initialization error]', err);
    });
    const devIndexPath = path.resolve(__dirname, 'index.html');

    app.use(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const vite = await vitePromise;
        const reqPath = req.path || '/';
        const isPageNavigation =
          (req.method === 'GET' || req.method === 'HEAD') &&
          !reqPath.startsWith('/api/') &&
          !reqPath.startsWith('/assets/') &&
          !reqPath.startsWith('/downloads/') &&
          !reqPath.startsWith('/@') &&
          !reqPath.startsWith('/src/') &&
          !reqPath.startsWith('/node_modules/') &&
          !reqPath.startsWith('/.well-known/') &&
          !/\.[a-z0-9]{1,8}$/i.test(reqPath);

        if (isPageNavigation && fs.existsSync(devIndexPath)) {
          const baseTemplate = fs.readFileSync(devIndexPath, 'utf8');
          const ssrHtml = renderSeoHtml(baseTemplate, req.originalUrl, readDb());
          const transformedHtml = await vite.transformIndexHtml(req.originalUrl, ssrHtml);
          res.setHeader('Vary', 'Accept');
          res.status(200).type('text/html; charset=utf-8').end(transformedHtml);
          return;
        }

        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  }

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Server Error]', err instanceof Error ? err.message : err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error.', code: 'INTERNAL_ERROR' });
    }
  });

  const isNumericPort = typeof PORT === 'number' || (typeof PORT === 'string' && /^\d+$/.test(PORT));
  if (isNumericPort) {
    const portNumber = Number(PORT);
    app.listen(portNumber, '0.0.0.0', () => {
      console.log(`AKYIN server listening on port ${portNumber}`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`AKYIN server listening on socket ${PORT}`);
    });
  }
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
