import { useState } from 'react';
import { CheckCircle2, Globe, Save, Shield } from 'lucide-react';
import { AppRoute } from '../../data/akyinData';
import { GlassButton } from '../liquid-glass';

interface AdminRouteSeoPanelProps {
  routeMetaMap: Record<AppRoute, { title: string; description: string; structuredData: Record<string, unknown> }>;
  onUpdateRouteMeta: (route: AppRoute, title: string, description: string, jsonSchemaStr: string) => void;
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
  onUpdateRouteMeta,
}: AdminRouteSeoPanelProps) {
  const [selectedRoute, setSelectedRoute] = useState<AppRoute>('/');
  const currentMeta = routeMetaMap[selectedRoute] ?? {
    title: '',
    description: '',
    structuredData: {},
  };

  const [titleDraft, setTitleDraft] = useState(currentMeta.title);
  const [descDraft, setDescDraft] = useState(currentMeta.description);
  const [jsonDraft, setJsonDraft] = useState(
    JSON.stringify(currentMeta.structuredData, null, 2)
  );

  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectRoute = (r: AppRoute) => {
    setSelectedRoute(r);
    const m = routeMetaMap[r] ?? { title: '', description: '', structuredData: {} };
    setTitleDraft(m.title);
    setDescDraft(m.description);
    setJsonDraft(JSON.stringify(m.structuredData, null, 2));
    setStatusMsg('');
    setErrorMsg('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('');
    setErrorMsg('');

    try {
      const parsedSchema = JSON.parse(jsonDraft);
      onUpdateRouteMeta(selectedRoute, titleDraft, descDraft, jsonDraft);
      setStatusMsg(`Successfully updated SEO metadata and JSON-LD schema for ${selectedRoute}.`);
    } catch (err) {
      setErrorMsg(
        `Invalid JSON-LD format: ${err instanceof Error ? err.message : 'Syntax error in JSON string'}`
      );
    }
  };

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
          SEO &amp; Structured Data Manager
        </h2>
        <p className="text-xs text-[#6E6E73] mt-0.5">
          Dynamic management for route titles, meta descriptions, and Schema.org JSON-LD structured data without editing source code.
        </p>
      </div>

      {statusMsg && (
        <div className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#D92D20]">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Route Selector Sidebar */}
        <div className="lg:col-span-4 liquid-glass-card rounded-3xl p-4 sm:p-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] px-2 mb-2">
            Select Page Route ({ALL_ROUTES.length})
          </p>
          <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
            {ALL_ROUTES.map((route) => {
              const active = selectedRoute === route;
              return (
                <button
                  key={route}
                  type="button"
                  onClick={() => handleSelectRoute(route)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono-num font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    active
                      ? 'bg-[#1D1D1F] text-white shadow-xs'
                      : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white/80 border border-[#E8E8ED]'
                  }`}
                >
                  <span>{route}</span>
                  <Globe className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#86868B]'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor Form */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSave}
            className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-6 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8ED]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                  Active Editing Route
                </p>
                <p className="font-mono-num text-base font-bold text-[#1D1D1F] mt-0.5">
                  {selectedRoute}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold text-xs border border-purple-200">
                <Shield className="w-3 h-3" />
                Schema.org JSON-LD
              </span>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-[#1D1D1F]">
                HTML Page Title (`&lt;title&gt;`) *
              </label>
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                required
                className={inputCls}
              />
              <p className="text-[11px] text-[#6E6E73]">
                Recommended length: 50–60 characters for optimal search engine display.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-[#1D1D1F]">
                Meta Description (`&lt;meta name=&quot;description&quot;&gt;`) *
              </label>
              <textarea
                rows={3}
                value={descDraft}
                onChange={(e) => setDescDraft(e.target.value)}
                required
                className={inputCls}
              />
              <p className="text-[11px] text-[#6E6E73]">
                Recommended length: 150–160 characters.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-[#1D1D1F]">
                  Structured Data (JSON-LD)
                </label>
                <span className="font-mono-num text-[10px] text-[#86868B]">
                  Valid JSON Object required
                </span>
              </div>
              <textarea
                rows={12}
                value={jsonDraft}
                onChange={(e) => setJsonDraft(e.target.value)}
                className="w-full rounded-xl border border-[#E8E8ED] bg-[#1D1D1F] text-[#F5F5F7] font-mono p-4 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <GlassButton type="submit" variant="primary" size="lg">
                <Save className="w-4 h-4" aria-hidden="true" />
                <span>Save Route Metadata &amp; Schema</span>
              </GlassButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
