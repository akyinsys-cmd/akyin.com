import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  RotateCcw,
  Save,
  Search,
} from 'lucide-react';
import type { RouteMetadata } from '../App';
import { useRouteMeta } from '../context/RouteMetaContext';
import { AppRoute } from '../data/akyinData';
import { GlassButton } from './liquid-glass';

interface AdminConfigDashboardProps {
  onPreviewRoute?: (route: AppRoute) => void;
}

export function AdminConfigDashboard({
  onPreviewRoute,
}: AdminConfigDashboardProps) {
  const {
    routeMetaMap,
    defaultRouteMeta,
    updateRouteMeta,
    updateAllRouteMeta,
    resetRouteMeta,
  } = useRouteMeta();

  const allRoutes = useMemo(
    () => Object.keys(defaultRouteMeta) as AppRoute[],
    [defaultRouteMeta]
  );

  const [drafts, setDrafts] = useState<
    Record<AppRoute, { title: string; description: string }>
  >(() => {
    const initial = {} as Record<AppRoute, { title: string; description: string }>;
    (Object.keys(routeMetaMap) as AppRoute[]).forEach((route) => {
      initial[route] = {
        title: routeMetaMap[route]?.title || '',
        description: routeMetaMap[route]?.description || '',
      };
    });
    return initial;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Keep form drafts synchronized when context state updates or resets
  useEffect(() => {
    const synced = {} as Record<AppRoute, { title: string; description: string }>;
    allRoutes.forEach((route) => {
      const current = routeMetaMap[route] ?? defaultRouteMeta[route];
      synced[route] = {
        title: current?.title || '',
        description: current?.description || '',
      };
    });
    setDrafts(synced);
  }, [allRoutes, routeMetaMap, defaultRouteMeta]);

  const filteredRoutes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allRoutes;
    return allRoutes.filter((route) => {
      const draft = drafts[route];
      return (
        route.toLowerCase().includes(q) ||
        (draft?.title || '').toLowerCase().includes(q) ||
        (draft?.description || '').toLowerCase().includes(q)
      );
    });
  }, [allRoutes, drafts, searchQuery]);

  const hasUnsavedRouteChange = (route: AppRoute) => {
    const live = routeMetaMap[route];
    const draft = drafts[route];
    if (!live || !draft) return false;
    return (
      draft.title.trim() !== live.title ||
      draft.description.trim() !== live.description
    );
  };

  const isCustomizedFromDefault = (route: AppRoute) => {
    const live = routeMetaMap[route];
    const def = defaultRouteMeta[route];
    if (!live || !def) return false;
    return live.title !== def.title || live.description !== def.description;
  };

  const unsavedCount = useMemo(
    () => allRoutes.filter((r) => hasUnsavedRouteChange(r)).length,
    [allRoutes, drafts, routeMetaMap]
  );

  const customizedCount = useMemo(
    () => allRoutes.filter((r) => isCustomizedFromDefault(r)).length,
    [allRoutes, routeMetaMap, defaultRouteMeta]
  );

  const handleFieldChange = (
    route: AppRoute,
    field: 'title' | 'description',
    value: string
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [route]: {
        ...prev[route],
        [field]: value,
      },
    }));
  };

  const handleSaveSingleRoute = (route: AppRoute) => {
    setStatusMessage('');
    setErrorMessage('');
    const draft = drafts[route];
    const title = draft?.title.trim() || '';
    const description = draft?.description.trim() || '';

    if (!title || !description) {
      setErrorMessage(`Both title and description are required for route ${route}.`);
      return;
    }

    const base = routeMetaMap[route] ?? defaultRouteMeta[route];
    const updated: RouteMetadata = {
      ...base,
      title,
      description,
    };
    updateRouteMeta(route, updated);
    setStatusMessage(`Saved title and description for ${route} in application state.`);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    setErrorMessage('');

    const nextMap = { ...routeMetaMap };
    for (const route of allRoutes) {
      const draft = drafts[route];
      const title = draft?.title.trim() || '';
      const description = draft?.description.trim() || '';
      if (!title || !description) {
        setErrorMessage(`Title and description cannot be empty (check route ${route}).`);
        return;
      }
      const base = routeMetaMap[route] ?? defaultRouteMeta[route];
      nextMap[route] = {
        ...base,
        title,
        description,
      };
    }

    updateAllRouteMeta(nextMap);
    setStatusMessage(
      `Saved all ${allRoutes.length} route metadata configurations to RouteMetaContext.`
    );
  };

  const handleResetRoute = (route: AppRoute) => {
    setStatusMessage('');
    setErrorMessage('');
    resetRouteMeta(route);
    setStatusMessage(`Restored ${route} to default App.tsx metadata.`);
  };

  const handleResetAll = () => {
    setStatusMessage('');
    setErrorMessage('');
    resetRouteMeta();
    setStatusMessage('Restored all routes to default App.tsx ROUTE_META values.');
  };

  const inputCls =
    'w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.015em] text-[#1D1D1F]">
            ROUTE_META Configuration Dashboard
          </h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">
            Edit page titles and meta descriptions across all application routes and commit live updates via RouteMetaContext.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono-num tabular-nums text-xs text-[#6E6E73]">
            {allRoutes.length} routes · {customizedCount} customized · {unsavedCount} unsaved
          </span>
          {customizedCount > 0 && (
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E8ED] hover:border-[#1D1D1F] text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className="rounded-2xl liquid-glass-panel px-4 py-3 text-xs font-semibold text-[#1D1D1F] flex items-center gap-2 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" aria-hidden="true" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3 text-xs font-semibold text-[#D92D20]"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-5">
        {/* Search + Bulk Save Toolbar */}
        <div className="liquid-glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-[#6E6E73] absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search routes, titles, or descriptions..."
              aria-label="Filter route configurations"
              className="w-full rounded-xl border border-[#E8E8ED] bg-[#FFFFFF] pl-9 pr-3.5 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#1D1D1F]"
            />
          </div>

          <GlassButton type="submit" variant="primary" size="md">
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>Save All Changes</span>
          </GlassButton>
        </div>

        {/* All Routes Editable Cards */}
        <div className="space-y-4">
          {filteredRoutes.length === 0 ? (
            <div className="liquid-glass-card rounded-3xl p-8 text-center text-xs text-[#6E6E73]">
              No matching routes found for &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredRoutes.map((route) => {
              const draft = drafts[route] ?? { title: '', description: '' };
              const dirty = hasUnsavedRouteChange(route);
              const customized = isCustomizedFromDefault(route);

              return (
                <div
                  key={route}
                  className="liquid-glass-card rounded-3xl p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E8ED]">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 font-mono-num text-xs font-bold text-[#1D1D1F] bg-[#FFFFFF] border border-[#E8E8ED] px-3 py-1 rounded-lg">
                        <Globe className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
                        {route}
                      </span>
                      {customized && (
                        <span className="text-[11px] font-semibold text-[#0071E3]">
                          Customized
                        </span>
                      )}
                      {dirty && (
                        <span className="text-[11px] font-semibold text-[#B45309]">
                          Unsaved edits
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {onPreviewRoute && route !== '/admin' && (
                        <button
                          type="button"
                          onClick={() => onPreviewRoute(route)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E8ED] hover:border-[#1D1D1F] text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>View Page</span>
                        </button>
                      )}
                      {customized && (
                        <button
                          type="button"
                          onClick={() => handleResetRoute(route)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E8ED] hover:border-[#1D1D1F] text-xs font-semibold text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Reset</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSaveSingleRoute(route)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          dirty
                            ? 'bg-[#1D1D1F] text-white hover:bg-[#1D1D1F]/90'
                            : 'bg-white border border-[#E8E8ED] text-[#1D1D1F] hover:border-[#1D1D1F]'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Save Route</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor={`route-title-${route}`}
                          className="font-semibold text-[#1D1D1F]"
                        >
                          Page Title
                        </label>
                        <span className="font-mono-num tabular-nums text-[11px] text-[#6E6E73]">
                          {draft.title.length} / 60 chars
                        </span>
                      </div>
                      <input
                        id={`route-title-${route}`}
                        value={draft.title}
                        onChange={(e) =>
                          handleFieldChange(route, 'title', e.target.value)
                        }
                        required
                        className={inputCls}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor={`route-desc-${route}`}
                          className="font-semibold text-[#1D1D1F]"
                        >
                          Meta Description
                        </label>
                        <span className="font-mono-num tabular-nums text-[11px] text-[#6E6E73]">
                          {draft.description.length} / 160 chars
                        </span>
                      </div>
                      <textarea
                        id={`route-desc-${route}`}
                        rows={2}
                        value={draft.description}
                        onChange={(e) =>
                          handleFieldChange(route, 'description', e.target.value)
                        }
                        required
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </form>
    </div>
  );
}
