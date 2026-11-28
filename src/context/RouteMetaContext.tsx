import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { RouteMetadata } from '../App';
import { AppRoute } from '../data/akyinData';
import { getSuiteBearerToken, suiteApi } from '../services/suiteApi';

const ROUTE_META_STORAGE_KEY = 'akyin_route_meta_overrides_v1';

interface RouteMetaContextValue {
  routeMetaMap: Record<AppRoute, RouteMetadata>;
  defaultRouteMeta: Record<AppRoute, RouteMetadata>;
  updateRouteMeta: (route: AppRoute, updated: RouteMetadata) => void;
  updateAllRouteMeta: (nextMap: Record<AppRoute, RouteMetadata>) => void;
  resetRouteMeta: (route?: AppRoute) => void;
}

const RouteMetaContext = createContext<RouteMetaContextValue | null>(null);

function loadPersistedRouteMeta(
  defaultRouteMeta: Record<AppRoute, RouteMetadata>
): Record<AppRoute, RouteMetadata> {
  if (typeof window === 'undefined') return defaultRouteMeta;
  try {
    const raw = window.localStorage.getItem(ROUTE_META_STORAGE_KEY);
    if (!raw) return defaultRouteMeta;
    const overrides = JSON.parse(raw) as Partial<
      Record<AppRoute, Partial<RouteMetadata>>
    >;
    if (!overrides || typeof overrides !== 'object') return defaultRouteMeta;

    const merged = { ...defaultRouteMeta };
    (Object.keys(defaultRouteMeta) as AppRoute[]).forEach((route) => {
      const patch = overrides[route];
      const base = defaultRouteMeta[route];
      if (patch && typeof patch === 'object' && base) {
        merged[route] = {
          title:
            typeof patch.title === 'string' && patch.title.trim()
              ? patch.title
              : base.title,
          description:
            typeof patch.description === 'string' && patch.description.trim()
              ? patch.description
              : base.description,
          ogTitle:
            typeof patch.ogTitle === 'string' ? patch.ogTitle : base.ogTitle,
          ogDescription:
            typeof patch.ogDescription === 'string'
              ? patch.ogDescription
              : base.ogDescription,
          structuredData:
            patch.structuredData && typeof patch.structuredData === 'object'
              ? patch.structuredData
              : base.structuredData,
        };
      }
    });
    return merged;
  } catch {
    return defaultRouteMeta;
  }
}

export function RouteMetaProvider({
  defaultRouteMeta,
  children,
}: {
  defaultRouteMeta: Record<AppRoute, RouteMetadata>;
  children: ReactNode;
}) {
  const [routeMetaMap, setRouteMetaMap] = useState<
    Record<AppRoute, RouteMetadata>
  >(() => loadPersistedRouteMeta(defaultRouteMeta));

  useEffect(() => {
    let active = true;
    suiteApi.getPublicRouteMeta().then(({ routeMetaOverrides }) => {
      if (!active || !routeMetaOverrides || typeof routeMetaOverrides !== 'object') return;
      setRouteMetaMap((prev) => {
        const merged = { ...prev };
        (Object.keys(defaultRouteMeta) as AppRoute[]).forEach((route) => {
          const patch = routeMetaOverrides[route];
          const base = defaultRouteMeta[route];
          if (!patch || !base) return;
          merged[route] = {
            ...merged[route],
            title: typeof patch.title === 'string' && patch.title.trim() ? patch.title : merged[route].title,
            description: typeof patch.description === 'string' && patch.description.trim() ? patch.description : merged[route].description,
            ogTitle: typeof patch.ogTitle === 'string' ? patch.ogTitle : merged[route].ogTitle,
            ogDescription: typeof patch.ogDescription === 'string' ? patch.ogDescription : merged[route].ogDescription,
            structuredData: patch.structuredData && typeof patch.structuredData === 'object'
              ? patch.structuredData : merged[route].structuredData,
          };
        });
        return merged;
      });
    }).catch(() => undefined);
    return () => { active = false; };
  }, [defaultRouteMeta]);

  const persistOverrides = useCallback(
    (nextMap: Record<AppRoute, RouteMetadata>) => {
      if (typeof window === 'undefined') return;
      try {
        const overrides: Partial<Record<AppRoute, RouteMetadata>> = {};
        (Object.keys(defaultRouteMeta) as AppRoute[]).forEach((route) => {
          const cur = nextMap[route];
          const def = defaultRouteMeta[route];
          if (!cur || !def) return;
          const changed =
            cur.title !== def.title ||
            cur.description !== def.description ||
            (cur.ogTitle || '') !== (def.ogTitle || '') ||
            (cur.ogDescription || '') !== (def.ogDescription || '') ||
            JSON.stringify(cur.structuredData) !==
              JSON.stringify(def.structuredData);
          if (changed) {
            overrides[route] = cur;
          }
        });
        if (Object.keys(overrides).length === 0) {
          window.localStorage.removeItem(ROUTE_META_STORAGE_KEY);
        } else {
          window.localStorage.setItem(ROUTE_META_STORAGE_KEY, JSON.stringify(overrides));
        }
        // Publish metadata to the authenticated server database so SSR, crawlers and other devices see it.
        if (getSuiteBearerToken()) {
          void suiteApi.updateSettings({ routeMetaOverrides: JSON.stringify(overrides) }).catch((err) => {
            console.error('[route-meta] Server publish failed:', err);
          });
        }
      } catch {
        // Ignore storage errors in restricted browsing contexts
      }
    },
    [defaultRouteMeta]
  );

  const updateRouteMeta = useCallback(
    (route: AppRoute, updated: RouteMetadata) => {
      setRouteMetaMap((prev) => {
        const next = {
          ...prev,
          [route]: updated,
        };
        persistOverrides(next);
        return next;
      });
    },
    [persistOverrides]
  );

  const updateAllRouteMeta = useCallback(
    (nextMap: Record<AppRoute, RouteMetadata>) => {
      setRouteMetaMap(nextMap);
      persistOverrides(nextMap);
    },
    [persistOverrides]
  );

  const resetRouteMeta = useCallback(
    (route?: AppRoute) => {
      if (!route) {
        setRouteMetaMap(defaultRouteMeta);
        persistOverrides(defaultRouteMeta);
        return;
      }
      setRouteMetaMap((prev) => {
        const next = {
          ...prev,
          [route]: defaultRouteMeta[route],
        };
        persistOverrides(next);
        return next;
      });
    },
    [defaultRouteMeta, persistOverrides]
  );

  return (
    <RouteMetaContext.Provider
      value={{
        routeMetaMap,
        defaultRouteMeta,
        updateRouteMeta,
        updateAllRouteMeta,
        resetRouteMeta,
      }}
    >
      {children}
    </RouteMetaContext.Provider>
  );
}

export function useRouteMeta(): RouteMetaContextValue {
  const ctx = useContext(RouteMetaContext);
  if (!ctx) {
    throw new Error('useRouteMeta must be used within a RouteMetaProvider');
  }
  return ctx;
}
