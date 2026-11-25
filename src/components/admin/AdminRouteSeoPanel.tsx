import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Code2,
  ExternalLink,
  Globe,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
} from 'lucide-react';
import type { RouteMetadata } from '../../App';
import { AppRoute } from '../../data/akyinData';
import { GlassButton } from '../liquid-glass';

interface AdminRouteSeoPanelProps {
  routeMetaMap: Record<AppRoute, RouteMetadata>;
  defaultRouteMeta: Record<AppRoute, RouteMetadata>;
  onUpdateRouteMeta: (route: AppRoute, updated: RouteMetadata) => void;
  onResetRouteMeta: (route?: AppRoute) => void;
  onPreviewRoute?: (route: AppRoute) => void;
}

const ALL_ROUTES: AppRoute[] = [
  '/',
  '/about',
  '/ventures',
  '/ventures/publishing',
  '/ventures/marketing',
  '/marketing/automotive',
  '/ventures/store',
  '/ventures/aicalc',
  '/ventures/kartigo',
  '/ventures/biznxt',
  '/ventures/budget-bazaar',
  '/pricing',
  '/tools',
  '/quote',
  '/advisory',
  '/insights',
  '/terms',
  '/privacy',
  '/contact',
  '/sitemap',
  '/admin',
];

export function AdminRouteSeoPanel({
  routeMetaMap,
  defaultRouteMeta,
  onUpdateRouteMeta,
  onResetRouteMeta,
  onPreviewRoute,
}: AdminRouteSeoPanelProps) {
  const [selectedRoute, setSelectedRoute] = useState<AppRoute>('/');
  const [routeSearch, setRouteSearch] = useState('');

  const currentMeta = routeMetaMap[selectedRoute] ?? defaultRouteMeta[selectedRoute];

  const [titleDraft, setTitleDraft] = useState(currentMeta?.title || '');
  const [descDraft, setDescDraft] = useState(currentMeta?.description || '');
  const [ogTitleDraft, setOgTitleDraft] = useState(currentMeta?.ogTitle || '');
  const [ogDescDraft, setOgDescDraft] = useState(currentMeta?.ogDescription || '');
  const [jsonDraft, setJsonDraft] = useState(
    JSON.stringify(currentMeta?.structuredData ?? {}, null, 2)
  );

  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const meta = routeMetaMap[selectedRoute] ?? defaultRouteMeta[selectedRoute];
    if (!meta) return;
    setTitleDraft(meta.title);
    setDescDraft(meta.description);
    setOgTitleDraft(meta.ogTitle || '');
    setOgDescDraft(meta.ogDescription || '');
    setJsonDraft(JSON.stringify(meta.structuredData ?? {}, null, 2));
  }, [selectedRoute, routeMetaMap, defaultRouteMeta]);

  const filteredRoutes = useMemo(() => {
    const q = routeSearch.trim().toLowerCase();
    if (!q) return ALL_ROUTES;
    return ALL_ROUTES.filter((route) => {
      const meta = routeMetaMap[route];
      return (
        route.toLowerCase().includes(q) ||
        (meta?.title || '').toLowerCase().includes(q)
      );
    });
  }, [routeSearch, routeMetaMap]);

  const isRouteModified = (route: AppRoute) => {
    const cur = routeMetaMap[route];
    const def = defaultRouteMeta[route];
    if (!cur || !def) return false;
    return (
      cur.title !== def.title ||
      cur.description !== def.description ||
      (cur.ogTitle || '') !== (def.ogTitle || '') ||
      (cur.ogDescription || '') !== (def.ogDescription || '') ||
      JSON.stringify(cur.structuredData) !== JSON.stringify(def.structuredData)
    );
  };

  const modifiedCount = useMemo(
    () => ALL_ROUTES.filter((r) => isRouteModified(r)).length,
    [routeMetaMap, defaultRouteMeta]
  );

  const handleSelectRoute = (route: AppRoute) => {
    setSelectedRoute(route);
    setStatusMsg('');
    setErrorMsg('');
  };

  const handleFetchCurrent = () => {
    const meta = routeMetaMap[selectedRoute] ?? defaultRouteMeta[selectedRoute];
    if (!meta) return;
    setTitleDraft(meta.title);
    setDescDraft(meta.description);
    setOgTitleDraft(meta.ogTitle || '');
    setOgDescDraft(meta.ogDescription || '');
    setJsonDraft(JSON.stringify(meta.structuredData ?? {}, null, 2));
    setErrorMsg('');
    setStatusMsg(`Synced latest ROUTE_META state for ${selectedRoute}.`);
  };

  const handleFormatJson = () => {
    setErrorMsg('');
    try {
      const parsed = JSON.parse(jsonDraft) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setErrorMsg('Structured data must be a valid JSON object (e.g. { "@context": "https://schema.org", ... }).');
        return;
      }
      setJsonDraft(JSON.stringify(parsed, null, 2));
      setStatusMsg('Formatted JSON-LD structured data.');
    } catch (err) {
      setErrorMsg(
        `Invalid JSON-LD syntax: ${err instanceof Error ? err.message : 'Unable to parse JSON'}`
      );
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('');
    setErrorMsg('');

    const cleanTitle = titleDraft.trim();
    const cleanDesc = descDraft.trim();
    if (!cleanTitle || !cleanDesc) {
      setErrorMsg('Page title and meta description are required.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonDraft) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setErrorMsg('Structured data must be a JSON object.');
        return;
      }

      const updated: RouteMetadata = {
        title: cleanTitle,
        description: cleanDesc,
        ...(ogTitleDraft.trim() ? { ogTitle: ogTitleDraft.trim() } : {}),
        ...(ogDescDraft.trim() ? { ogDescription: ogDescDraft.trim() } : {}),
        structuredData: parsed as Record<string, unknown>,
      };

      onUpdateRouteMeta(selectedRoute, updated);
      setJsonDraft(JSON.stringify(parsed, null, 2));
      setStatusMsg(
        `Updated ROUTE_META state for ${selectedRoute}. Document head tags and JSON-LD schema are now live.`
      );
    } catch (err) {
      setErrorMsg(
        `Invalid JSON-LD format: ${err instanceof Error ? err.message : 'Syntax error in JSON string'}`
      );
    }
  };

  const handleResetCurrentRoute = () => {
    onResetRouteMeta(selectedRoute);
    setErrorMsg('');
    setStatusMsg(`Restored ${selectedRoute} to default App.tsx ROUTE_META.`);
  };

  const handleResetAllRoutes = () => {
    onResetRouteMeta();
    setErrorMsg('');
    setStatusMsg('Restored all routes to default App.tsx ROUTE_META.');
  };

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15';

  const canonicalPreviewUrl = `https://akyin.com${selectedRoute === '/' ? '/' : selectedRoute}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            SEO &amp; Structured Data (ROUTE_META)
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Inspect and edit live page titles, meta descriptions, OpenGraph tags, and Schema.org JSON-LD from App.tsx state.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono-num tabular-nums text-xs text-[#6E6E73]">
            {ALL_ROUTES.length} routes · {modifiedCount} customized
          </span>
          {modifiedCount > 0 && (
            <button
              type="button"
              onClick={handleResetAllRoutes}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E8ED] hover:border-[#1D1D1F] text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset All Defaults</span>
            </button>
          )}
        </div>
      </div>

      {statusMsg && (
        <div
          role="status"
          className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" aria-hidden="true" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#D92D20]"
        >
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Route Selector Sidebar */}
        <div className="lg:col-span-4 liquid-glass-card rounded-3xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[#1D1D1F]">
              Application Routes
            </span>
            <span className="font-mono-num tabular-nums text-xs text-[#6E6E73]">
              {filteredRoutes.length} / {ALL_ROUTES.length}
            </span>
          </div>

          <div className="relative">
            <Search
              className="w-3.5 h-3.5 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={routeSearch}
              onChange={(e) => setRouteSearch(e.target.value)}
              placeholder="Filter route or title..."
              aria-label="Filter application routes"
              className="w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] pl-8 pr-3 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
            />
          </div>

          <div className="space-y-1 max-h-[540px] overflow-y-auto pr-1">
            {filteredRoutes.length === 0 ? (
              <p className="text-xs text-[#6E6E73] py-6 text-center">
                No matching routes found.
              </p>
            ) : (
              filteredRoutes.map((route) => {
                const active = selectedRoute === route;
                const modified = isRouteModified(route);
                return (
                  <button
                    key={route}
                    type="button"
                    onClick={() => handleSelectRoute(route)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono-num font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      active
                        ? 'bg-[#1D1D1F] text-white shadow-xs'
                        : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white/80 border border-[#E8E8ED]'
                    }`}
                  >
                    <span className="truncate">{route}</span>
                    <span className="inline-flex items-center gap-2 shrink-0">
                      {modified && (
                        <span
                          className={`text-[10px] font-sans font-semibold ${
                            active ? 'text-white/80' : 'text-[#0071E3]'
                          }`}
                        >
                          Edited
                        </span>
                      )}
                      <Globe
                        className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#86868B]'}`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Editor Form */}
        <div className="lg:col-span-8 space-y-6">
          <form
            onSubmit={handleSave}
            className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-5 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E8ED]">
              <div>
                <p className="text-xs text-[#6E6E73]">
                  Active Route · {isRouteModified(selectedRoute) ? 'Customized in State' : 'Default App.tsx Config'}
                </p>
                <p className="font-mono-num text-base font-bold text-[#1D1D1F] mt-0.5">
                  {selectedRoute}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleFetchCurrent}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E8ED] hover:border-[#1D1D1F] text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reload State</span>
                </button>
                {isRouteModified(selectedRoute) && (
                  <button
                    type="button"
                    onClick={handleResetCurrentRoute}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E8ED] hover:border-[#1D1D1F] text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Reset Route</span>
                  </button>
                )}
                {onPreviewRoute && selectedRoute !== '/admin' && (
                  <button
                    type="button"
                    onClick={() => onPreviewRoute(selectedRoute)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E8ED] hover:border-[#1D1D1F] text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Open Page</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Search Snippet Preview */}
            <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8E8ED] p-4 space-y-1">
              <p className="text-[11px] font-medium text-[#6E6E73]">
                Search Engine Preview · {canonicalPreviewUrl}
              </p>
              <p className="text-sm font-semibold text-[#1A0DAB] truncate">
                {titleDraft || 'Untitled Page'}
              </p>
              <p className="text-xs text-[#4D5156] line-clamp-2 leading-relaxed">
                {descDraft || 'No meta description configured.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="seo-title-input" className="font-semibold text-[#1D1D1F]">
                  HTML Page Title *
                </label>
                <span className="font-mono-num tabular-nums text-[11px] text-[#6E6E73]">
                  {titleDraft.length} / 60 chars
                </span>
              </div>
              <input
                id="seo-title-input"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                required
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="seo-desc-input" className="font-semibold text-[#1D1D1F]">
                  Meta Description *
                </label>
                <span className="font-mono-num tabular-nums text-[11px] text-[#6E6E73]">
                  {descDraft.length} / 160 chars
                </span>
              </div>
              <textarea
                id="seo-desc-input"
                rows={3}
                value={descDraft}
                onChange={(e) => setDescDraft(e.target.value)}
                required
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="seo-og-title" className="block font-semibold text-[#1D1D1F]">
                  OpenGraph Title (Optional)
                </label>
                <input
                  id="seo-og-title"
                  value={ogTitleDraft}
                  onChange={(e) => setOgTitleDraft(e.target.value)}
                  placeholder="Defaults to HTML Page Title"
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="seo-og-desc" className="block font-semibold text-[#1D1D1F]">
                  OpenGraph Description (Optional)
                </label>
                <input
                  id="seo-og-desc"
                  value={ogDescDraft}
                  onChange={(e) => setOgDescDraft(e.target.value)}
                  placeholder="Defaults to Meta Description"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="seo-jsonld-input" className="font-semibold text-[#1D1D1F]">
                  Structured Data (Schema.org JSON-LD)
                </label>
                <button
                  type="button"
                  onClick={handleFormatJson}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#E8E8ED] hover:border-[#1D1D1F] text-[11px] font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Format JSON</span>
                </button>
              </div>
              <textarea
                id="seo-jsonld-input"
                rows={13}
                value={jsonDraft}
                onChange={(e) => setJsonDraft(e.target.value)}
                spellCheck={false}
                className="w-full rounded-xl border border-[#E8E8ED] bg-[#1D1D1F] text-[#F5F5F7] font-mono tabular-nums p-4 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0071E3]/35"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <GlassButton type="submit" variant="primary" size="lg">
                <Save className="w-4 h-4" aria-hidden="true" />
                <span>Apply &amp; Update ROUTE_META</span>
              </GlassButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
