import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Clock,
  ExternalLink,
  Globe,
  Newspaper,
  RefreshCw,
} from 'lucide-react';
import { sanitizeHref } from '../utils/security';
import { GlassButton, GlassCard, GlassPanel } from './liquid-glass';

type NewsTopic = 'all' | 'leadgen' | 'ev' | 'crm';

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

interface NewsResponsePayload {
  topic: string;
  fetchedAt: string;
  articles: NewsArticle[];
  sources: GroundingSource[];
}

const TOPIC_TABS: Array<{ id: NewsTopic; label: string }> = [
  { id: 'all', label: 'All Dealership Trends' },
  { id: 'leadgen', label: 'Meta & Search Lead Gen' },
  { id: 'ev', label: 'EV & Digital Retail' },
  { id: 'crm', label: 'Showroom AI & CRM' },
];

export function AutomotiveIndustryNews() {
  const [activeTopic, setActiveTopic] = useState<NewsTopic>('all');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loadHeadlines = useCallback(async (topic: NewsTopic) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`/api/automotive-news?topic=${encodeURIComponent(topic)}`);
      const data = (await response.json().catch(() => null)) as
        | (Partial<NewsResponsePayload> & { error?: string })
        | null;

      if (!response.ok) {
        throw new Error(data?.error || `Unable to load headlines (HTTP ${response.status}).`);
      }

      if (data?.error || !Array.isArray(data?.articles) || data.articles.length === 0) {
        throw new Error(data?.error || 'No live articles returned from Google Search.');
      }

      setArticles(data.articles);
      setSources(Array.isArray(data.sources) ? data.sources : []);
      setFetchedAt(data.fetchedAt || new Date().toISOString());
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Unable to fetch live automotive headlines right now. Please try again shortly.';
      setArticles([]);
      setSources([]);
      setFetchedAt(null);
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHeadlines(activeTopic);
  }, [activeTopic, loadHeadlines]);

  const formattedSyncTime = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <section
      id="automotive-industry-news"
      className="py-20 lg:py-24 bg-[#F5F5F7] border-t border-[#E8E8ED]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <GlassPanel className="p-6 sm:p-8 lg:p-10 space-y-8 bg-gradient-to-br from-white/95 via-purple-50/30 to-white/95">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E8E8ED] pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-purple-700">
                <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Google Search Grounding</span>
                <span aria-hidden="true">·</span>
                <span>Live Dealership Market Intelligence</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#1D1D1F] text-balance">
                Automotive Industry News
              </h2>
              <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                Real-time headline trends across dealership sales conversion, EV buyer acquisition, and automotive digital marketing retrieved via Google Search.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {formattedSyncTime && !errorMsg && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono-num tabular-nums text-[#6E6E73]">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Synced {formattedSyncTime}</span>
                </span>
              )}
              <GlassButton
                variant="glass"
                size="sm"
                onClick={() => void loadHeadlines(activeTopic)}
                disabled={loading}
                ariaLabel="Refresh Automotive Industry News from Google Search"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-purple-700 ${loading ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>{loading ? 'Searching...' : 'Refresh Headlines'}</span>
              </GlassButton>
            </div>
          </div>

          {/* Topic Filter Tabs */}
          <div
            role="group"
            aria-label="Filter automotive industry news by topic"
            className="flex flex-wrap gap-2"
          >
            {TOPIC_TABS.map((tab) => {
              const isSelected = activeTopic === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActiveTopic(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'liquid-glass-pill-dark text-white border-[#1D1D1F] shadow-xs'
                      : 'bg-white/80 text-[#6E6E73] border-[#E8E8ED] hover:text-[#1D1D1F] hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Loading State */}
          {loading && (
            <div
              aria-busy="true"
              aria-label="Loading latest automotive dealership news"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {[1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  className="frosted-glass rounded-2xl p-6 border border-[#E8E8ED] space-y-4 animate-pulse"
                >
                  <div className="h-3 w-32 bg-[#E8E8ED] rounded" />
                  <div className="h-5 w-full bg-[#E8E8ED] rounded" />
                  <div className="h-5 w-4/5 bg-[#E8E8ED] rounded" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3 w-full bg-[#F1F1F4] rounded" />
                    <div className="h-3 w-11/12 bg-[#F1F1F4] rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && errorMsg && (
            <div
              role="alert"
              className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#1D1D1F]">
                    Live Google Search Headlines Unavailable
                  </p>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">{errorMsg}</p>
                </div>
              </div>
              <GlassButton
                variant="primary"
                size="sm"
                className="shrink-0"
                onClick={() => void loadHeadlines(activeTopic)}
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Retry Search</span>
              </GlassButton>
            </div>
          )}

          {/* News Articles Grid */}
          {!loading && !errorMsg && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article, idx) => {
                const safeArticleUrl = article.url
                  ? sanitizeHref(article.url, '#', true)
                  : '#';
                const hasLink = safeArticleUrl !== '#';

                return (
                  <GlassCard
                    key={`${article.headline}-${idx}`}
                    interactive={true}
                    tilt={true}
                    className="p-6 flex flex-col justify-between space-y-5 bg-white/90"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                        <span className="font-semibold text-purple-700">{article.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-num tabular-nums">{article.publishedHint}</span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-[#1D1D1F] leading-snug">
                        {article.headline}
                      </h3>

                      <p className="text-sm text-[#6E6E73] leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E8E8ED] flex items-center justify-between gap-3 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#1D1D1F] truncate">
                        <Newspaper className="w-3.5 h-3.5 text-[#6E6E73] shrink-0" aria-hidden="true" />
                        <span className="truncate">{article.publisher}</span>
                      </span>

                      {hasLink && (
                        <a
                          href={safeArticleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-purple-700 hover:text-purple-900 whitespace-nowrap shrink-0"
                        >
                          <span>Read Source</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {/* Grounded Google Search Citations Footer */}
          {!loading && !errorMsg && sources.length > 0 && (
            <div className="pt-5 border-t border-[#E8E8ED] space-y-2.5">
              <p className="text-xs font-semibold text-[#1D1D1F]">
                Google Search Grounded Sources ({sources.length})
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#6E6E73]">
                {sources.map((src, idx) => {
                  const safeSrcUrl = sanitizeHref(src.url, '#', true);
                  if (safeSrcUrl === '#') return null;
                  return (
                    <a
                      key={`${src.url}-${idx}`}
                      href={safeSrcUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-[#1D1D1F] underline decoration-[#E8E8ED] underline-offset-4 transition-colors"
                    >
                      <span className="max-w-[240px] truncate">{src.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </GlassPanel>
      </div>
    </section>
  );
}
