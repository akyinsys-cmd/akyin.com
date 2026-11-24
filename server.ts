import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { z } from 'zod';
import { buildMarkdownForRoute } from './src/utils/agentMarkdown';
import {
  OFFICIAL_CONTACT,
  PRICING_PACKAGES,
  RATE_CARD_ITEMS,
  VENTURES_PORTFOLIO,
} from './src/data/akyinData';
import {
  PAYMENT_CATALOG_BY_SKU,
  PAYMENT_CATALOG_LIST,
  PaymentSku,
} from './src/data/paymentCatalog';

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

const ROUTE_SEO_META: Record<
  string,
  { title: string; description: string; ogTitle?: string; ogDescription?: string }
> = {
  '/': {
    title: 'AKYIN Ventures — Multi-Business Group & Marketing Agency',
    description:
      'AKYIN Ventures is a diversified multi-business group and marketing agency spanning publishing, automotive growth, retail, AI tools, B2B trade, and advisory.',
  },
  '/about': {
    title: 'About AKYIN Ventures — One Vision. Multiple Business Ventures.',
    description:
      'Corporate profile of AKYIN Ventures and its seven operating divisions across publishing, performance marketing, retail, AI tools, and B2B commerce.',
  },
  '/ventures': {
    title: 'Our Businesses — AKYIN Ventures Portfolio',
    description:
      'Explore Akyin Publishing, Akyin Marketing Agency, Akyin Store, AICalc.in, Kartigo.online, BizNXT.online, and Budget Bazaar.',
  },
  '/ventures/publishing': {
    title: 'AKYIN Publishing — Ideas That Inspire. Knowledge That Empowers. | akyin.com',
    description:
      'Explore eight books on Amazon and three digital guides & productivity tools published by AKYIN.',
  },
  '/ventures/marketing': {
    title: 'AKYIN MARKETINGS — Full-Service Marketing Agency & Growth Solutions',
    description:
      'Full-service digital marketing agency delivering Meta lead generation, brand campaigns, AI-assisted lead qualification, and commercial sales training.',
  },
  '/marketing/automotive': {
    title: 'Car Dealership Marketing & Test-Drive Leads | AKYIN',
    description:
      'Book qualified showroom test drives, not cold clicks. Targeted Meta & Google auto ads, lead vetting, and floor sales coaching. Get a quote.',
    ogTitle: 'More Showroom Test Drives. Zero Cold Leads. | AKYIN',
    ogDescription:
      'High-intent Meta & Google auto ads, automated lead vetting, and dealer sales coaching built to fill your showroom floor faster.',
  },
  '/pricing': {
    title: 'Pricing & Rate Card — AKYIN Ventures & Marketing Agency',
    description:
      'Transparent INR pricing for AKYIN Marketing Agency packages, lead filtering retainers, dealership sales training, and 1-on-1 business advisory.',
  },
  '/advisory': {
    title: 'Business Advisory & Consultation Booking — AKYIN Ventures',
    description:
      'Schedule a 1-on-1 30-minute IST Business Advisory consultation with AKYIN Ventures.',
  },
  '/terms': {
    title: 'Terms of Service — AKYIN Ventures | akyin.com',
    description:
      'Terms of Service, direct ad platform billing rules, service scope separation, and governance policies for AKYIN Ventures.',
  },
  '/privacy': {
    title: 'Privacy Policy — AKYIN Ventures | akyin.com',
    description:
      'Zero-broker data privacy, enquiry validation, and security standards across AKYIN Ventures.',
  },
  '/contact': {
    title: 'Contact AKYIN Ventures — Let’s Start a Conversation',
    description:
      'Direct enquiry desk for AKYIN Ventures and all seven operating verticals.',
  },
};

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

type GeminiClientResult =
  | { client: GoogleGenAI; reason: null }
  | { client: null; reason: 'API_KEY_MISSING' | 'API_KEY_INVALID_FORMAT' };

function createGeminiClient(): GeminiClientResult {
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
    return { client: null, reason: 'API_KEY_MISSING' };
  }

  // OAuth access tokens (ya29.*) or tokens with whitespace are rejected by x-goog-api-key
  if (/\s/.test(apiKey) || apiKey.startsWith('ya29.')) {
    return { client: null, reason: 'API_KEY_INVALID_FORMAT' };
  }

  return {
    client: new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    }),
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

function getRazorpayCredentials(): { keyId: string; keySecret: string } | null {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (
    !keyId ||
    !keySecret ||
    keyId === 'MY_RAZORPAY_KEY_ID' ||
    keySecret === 'MY_RAZORPAY_KEY_SECRET'
  ) {
    return null;
  }
  return { keyId, keySecret };
}

const createOrderBodySchema = z
  .object({
    sku: z.enum([
      'advisory-session',
      'package-a-setup',
      'package-b-setup',
      'sales-training',
    ]),
    customerName: z.string().trim().max(120).optional().default(''),
    customerEmail: z
      .union([z.string().trim().email().max(160), z.literal('')])
      .optional()
      .default(''),
    customerPhone: z
      .string()
      .trim()
      .max(30)
      .refine((val) => val === '' || /^[+\d\s\-()]{6,30}$/.test(val), 'Invalid phone format.')
      .optional()
      .default(''),
    referenceId: z.string().trim().max(80).optional().default(''),
  })
  .strict();

const verifyPaymentBodySchema = z
  .object({
    razorpay_order_id: z.string().trim().min(4).max(100),
    razorpay_payment_id: z.string().trim().min(4).max(100),
    razorpay_signature: z
      .string()
      .trim()
      .regex(/^[a-f0-9]{64}$/i, 'Invalid Razorpay signature format.'),
    sku: z
      .enum([
        'advisory-session',
        'package-a-setup',
        'package-b-setup',
        'sales-training',
      ])
      .optional(),
  })
  .strict();

function stripDangerousControls(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

const leadSubmissionBodySchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is required.').max(100),
    businessName: z.string().trim().min(2, 'Business name is required.').max(120),
    mobileNumber: z
      .string()
      .trim()
      .min(7, 'Please provide a valid mobile number.')
      .max(28)
      .refine((val) => /^[+\d\s\-()]{7,28}$/.test(val), 'Enter a valid mobile number with country or area code.'),
    email: z.string().trim().email('Enter a valid email address.').max(160),
    city: z.string().trim().min(2, 'City is required.').max(80),
    country: z.string().trim().min(2, 'Country is required.').max(80),
    requiredService: z.string().trim().min(2, 'Please select a required service.').max(140),
    monthlyMarketingBudget: z
      .string()
      .trim()
      .min(2, 'Please select a monthly marketing budget range.')
      .max(80),
    message: z.string().trim().min(8, 'Please enter a brief requirement summary (at least 8 characters).').max(1500),
    consentAccepted: z
      .boolean()
      .refine((val) => val === true, 'Please accept the privacy consent before submitting.'),
    honeypot: z.string().max(60).optional().default(''),
    source: z.string().trim().max(80).optional().default('Interactive Lead Enquiry Widget'),
  })
  .strict();

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

  // Baseline security & agent Content-Signal headers (preserve AI Studio iframe compatibility)
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), geolocation=(), microphone=(self), payment=(self "https://checkout.razorpay.com")'
    );
    res.setHeader('Content-Signal', 'search=yes, ai-input=yes, ai-train=no');
    if (
      process.env.NODE_ENV === 'production' &&
      (req.secure || req.headers['x-forwarded-proto'] === 'https')
    ) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  app.use(express.json({ limit: '64kb' }));
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

  const paymentOrderRateLimiter = createRateLimiter({
    windowMs: 60_000,
    max: 20,
    code: 'PAYMENT_RATE_LIMITED',
    message: 'Too many checkout requests from this network. Please wait a minute and retry.',
  });

  const paymentVerifyRateLimiter = createRateLimiter({
    windowMs: 60_000,
    max: 30,
    code: 'PAYMENT_VERIFY_RATE_LIMITED',
    message: 'Too many verification attempts. Please wait a minute and retry.',
  });

  const newsRateLimiter = createRateLimiter({
    windowMs: 60_000,
    max: 20,
    code: 'NEWS_RATE_LIMITED',
    message: 'Too many headline sync requests. Please wait a minute before refreshing.',
  });

  const leadRateLimiter = createRateLimiter({
    windowMs: 60_000,
    max: 12,
    code: 'LEAD_RATE_LIMITED',
    message: 'Too many enquiry submissions. Please wait a minute before trying again.',
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
      .send('User-agent: *\nAllow: /\nDisallow: /admin\nContent-Signal: search=yes, ai-input=yes, ai-train=no\nSitemap: https://akyin.com/sitemap.xml\n');
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
    const file = resolvePublicOrDistFile('sitemap.xml');
    if (file) {
      res.type('application/xml; charset=utf-8').sendFile(file);
      return;
    }
    res.status(404).send('Sitemap not found.');
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
                'Retrieve transparent INR pricing for AKYIN MARKETINGS retainers (Package A & B), sales training, and the 21-item rate card.',
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
                'Get official corporate email, telephone, WhatsApp, legal links, and social handles for AKYIN Ventures.',
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
        const cat = typeof args.category === 'string' ? args.category.trim().toLowerCase() : '';
        const items = cat
          ? RATE_CARD_ITEMS.filter((i) => i.category.toLowerCase().includes(cat))
          : RATE_CARD_ITEMS;

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
                    packages: PRICING_PACKAGES,
                    rateCard: items,
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
                    telephone: OFFICIAL_CONTACT.phoneDisplay,
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

  // Razorpay Payment Gateway Endpoints (Server-Side Secret & Pricing Authority)
  app.get('/api/razorpay/config', (_req: Request, res: Response) => {
    const creds = getRazorpayCredentials();
    res.json({
      configured: Boolean(creds),
      keyId: creds ? creds.keyId : null,
      currency: 'INR',
      catalog: PAYMENT_CATALOG_LIST,
    });
  });

  app.post('/api/razorpay/create-order', paymentOrderRateLimiter, async (req: Request, res: Response) => {
    const creds = getRazorpayCredentials();
    if (!creds) {
      res.status(503).json({
        error:
          'Online Razorpay checkout requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to be configured in Settings > Secrets.',
        code: 'RAZORPAY_NOT_CONFIGURED',
      });
      return;
    }

    const parsed = createOrderBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Invalid payment order request parameters.',
        code: 'INVALID_REQUEST',
        issues: parsed.error.issues.map((i) => i.message),
      });
      return;
    }

    const sku: PaymentSku = parsed.data.sku;
    const item = PAYMENT_CATALOG_BY_SKU[sku];
    if (!item) {
      res.status(404).json({
        error: 'Selected payment item was not found in catalog.',
        code: 'SKU_NOT_FOUND',
      });
      return;
    }

    const receiptSuffix = parsed.data.referenceId
      ? parsed.data.referenceId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 16)
      : Date.now().toString(36);
    const receipt = `akyin_${sku.replace(/[^a-z0-9]/g, '').slice(0, 10)}_${receiptSuffix}`.slice(
      0,
      40
    );

    try {
      const authHeader = Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64');
      const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: item.amountPaise,
          currency: 'INR',
          receipt,
          notes: {
            sku: item.sku,
            title: item.shortLabel,
            referenceId: parsed.data.referenceId || 'direct-web',
            customerName: parsed.data.customerName || 'Guest',
            customerEmail: parsed.data.customerEmail || '',
          },
        }),
      });

      const rzpBody = (await rzpResponse.json().catch(() => ({}))) as {
        id?: string;
        amount?: number;
        currency?: string;
        receipt?: string;
        error?: { description?: string };
      };

      if (!rzpResponse.ok || !rzpBody.id) {
        const msg =
          rzpBody?.error?.description || 'Razorpay refused order creation. Verify API credentials.';
        res.status(502).json({
          error: msg,
          code: 'RAZORPAY_UPSTREAM_ERROR',
        });
        return;
      }

      res.json({
        orderId: rzpBody.id,
        amount: item.amountPaise,
        currency: 'INR',
        keyId: creds.keyId,
        sku: item.sku,
        title: item.title,
        displayPrice: item.displayPrice,
        description: item.description,
        receipt: rzpBody.receipt || receipt,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to reach Razorpay Orders API.';
      console.error('[/api/razorpay/create-order] Error:', msg);
      res.status(502).json({
        error: 'Unable to reach Razorpay gateway right now. Please try again shortly.',
        code: 'RAZORPAY_NETWORK_ERROR',
      });
    }
  });

  app.post('/api/razorpay/verify-payment', paymentVerifyRateLimiter, (req: Request, res: Response) => {
    const creds = getRazorpayCredentials();
    if (!creds) {
      res.status(503).json({
        verified: false,
        error:
          'Razorpay verification requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Settings > Secrets.',
        code: 'RAZORPAY_NOT_CONFIGURED',
      });
      return;
    }

    const parsed = verifyPaymentBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        verified: false,
        error: 'Invalid payment verification payload.',
        code: 'INVALID_VERIFICATION_PAYLOAD',
      });
      return;
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, sku } = parsed.data;
    const expectedHex = crypto
      .createHmac('sha256', creds.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedHex, 'hex');
    const actualBuf = Buffer.from(razorpay_signature.toLowerCase(), 'hex');

    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      res.status(400).json({
        verified: false,
        error: 'Payment signature mismatch. Please contact connect@akyin.com if your account was debited.',
        code: 'SIGNATURE_MISMATCH',
      });
      return;
    }

    const item = sku ? PAYMENT_CATALOG_BY_SKU[sku] : undefined;
    res.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      sku: sku || null,
      title: item?.title || 'AKYIN Commercial Payment',
      displayPrice: item?.displayPrice || null,
      verifiedAt: new Date().toISOString(),
    });
  });

  // Server-Validated Lead Enquiry Submission (stored outside public/ and dist/; never exposed via GET)
  app.post('/api/leads', leadRateLimiter, (req: Request, res: Response) => {
    const parsed = leadSubmissionBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: parsed.error.issues[0]?.message || 'Invalid lead enquiry submission.',
        code: 'INVALID_LEAD_PAYLOAD',
        issues: parsed.error.issues.map((issue) => issue.message),
      });
      return;
    }

    const data = parsed.data;
    if (data.honeypot && data.honeypot.trim().length > 0) {
      res.status(400).json({
        ok: false,
        error: 'Submission rejected.',
        code: 'INVALID_LEAD_PAYLOAD',
      });
      return;
    }

    const leadId = `AKY-LEAD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const receivedAt = new Date().toISOString();

    const record = {
      leadId,
      receivedAt,
      fullName: stripDangerousControls(data.fullName),
      businessName: stripDangerousControls(data.businessName),
      mobileNumber: stripDangerousControls(data.mobileNumber),
      email: stripDangerousControls(data.email),
      city: stripDangerousControls(data.city),
      country: stripDangerousControls(data.country),
      requiredService: stripDangerousControls(data.requiredService),
      monthlyMarketingBudget: stripDangerousControls(data.monthlyMarketingBudget),
      message: stripDangerousControls(data.message),
      consentAccepted: true,
      source: stripDangerousControls(data.source || 'Interactive Lead Enquiry Widget'),
    };

    try {
      const dataDir = path.resolve(__dirname, '.akyin-data');
      const leadsFile = path.join(dataDir, 'leads.json');
      fs.mkdirSync(dataDir, { recursive: true });

      let existing: unknown[] = [];
      if (fs.existsSync(leadsFile)) {
        try {
          const raw = fs.readFileSync(leadsFile, 'utf8');
          const parsedFile = JSON.parse(raw) as unknown;
          if (Array.isArray(parsedFile)) {
            existing = parsedFile;
          }
        } catch {
          existing = [];
        }
      }

      existing.unshift(record);
      const tempFile = path.join(dataDir, `leads.${process.pid}.${Date.now()}.tmp`);
      fs.writeFileSync(tempFile, JSON.stringify(existing.slice(0, 1000), null, 2), 'utf8');
      fs.renameSync(tempFile, leadsFile);

      res.status(201).json({
        ok: true,
        leadId,
        receivedAt,
      });
    } catch (err: unknown) {
      console.error('[/api/leads] Failed to persist submission:', err instanceof Error ? err.message : err);
      res.status(500).json({
        ok: false,
        error: 'Unable to record enquiry right now. Please contact connect@akyin.com directly.',
        code: 'LEAD_STORAGE_ERROR',
      });
    }
  });

  app.get('/api/leads', (_req: Request, res: Response) => {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      ok: false,
      error: 'Method not allowed. Lead enquiries must be submitted via POST.',
      code: 'METHOD_NOT_ALLOWED',
    });
  });

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

    const { client: ai, reason } = createGeminiClient();
    if (!ai) {
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
      const cleaned = req.path.replace(/\/+$/, '') || '/';
      const routeMeta = ROUTE_SEO_META[cleaned];
      if (!routeMeta) {
        res.type('text/html; charset=utf-8').send(cachedIndexHtml);
        return;
      }

      const canonicalUrl = `https://akyin.com${cleaned === '/' ? '/' : cleaned}`;
      const ogTitleValue = routeMeta.ogTitle || routeMeta.title;
      const ogDescValue = routeMeta.ogDescription || routeMeta.description;
      let html = cachedIndexHtml;
      html = html
        .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(routeMeta.title)}</title>`)
        .replace(
          /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
          `<meta name="description" content="${escapeHtmlAttr(routeMeta.description)}" />`
        )
        .replace(
          /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
          `<link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}" />`
        )
        .replace(
          /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
          `<meta property="og:title" content="${escapeHtmlAttr(ogTitleValue)}" />`
        )
        .replace(
          /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
          `<meta property="og:description" content="${escapeHtmlAttr(ogDescValue)}" />`
        )
        .replace(
          /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
          `<meta property="og:url" content="${escapeHtmlAttr(canonicalUrl)}" />`
        )
        .replace(
          /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
          `<meta name="twitter:title" content="${escapeHtmlAttr(ogTitleValue)}" />`
        )
        .replace(
          /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
          `<meta name="twitter:description" content="${escapeHtmlAttr(ogDescValue)}" />`
        );
      res.setHeader('Vary', 'Accept');
      res.type('text/html; charset=utf-8').send(html);
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
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
