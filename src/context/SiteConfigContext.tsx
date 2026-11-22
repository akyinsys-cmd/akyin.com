import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  DEFAULT_AVAILABILITY_RULES,
  DEFAULT_WEBSITE_SETTINGS,
  AvailabilityRule,
  VentureConfigRecord,
  WebsiteSettingsMap,
} from '../types/advisory';
import {
  fetchPublicBootstrap,
  isLiveAppsScriptConnected,
} from '../services/appsScriptClient';

interface SiteConfigContextValue {
  settings: WebsiteSettingsMap;
  ventures: VentureConfigRecord[];
  availability: AvailabilityRule[];
  blockedDates: string[];
  isLiveBackend: boolean;
  loaded: boolean;
  refreshSiteConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextValue>({
  settings: DEFAULT_WEBSITE_SETTINGS,
  ventures: [],
  availability: DEFAULT_AVAILABILITY_RULES,
  blockedDates: [],
  isLiveBackend: false,
  loaded: false,
  refreshSiteConfig: async () => {},
});

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettingsMap>(DEFAULT_WEBSITE_SETTINGS);
  const [ventures, setVentures] = useState<VentureConfigRecord[]>([]);
  const [availability, setAvailability] = useState<AvailabilityRule[]>(
    DEFAULT_AVAILABILITY_RULES
  );
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(isLiveAppsScriptConnected());
  const [loaded, setLoaded] = useState(false);

  const refreshSiteConfig = useCallback(async () => {
    try {
      const data = await fetchPublicBootstrap();
      setSettings(data.settings);
      setVentures(data.ventures);
      setAvailability(data.availability);
      setBlockedDates(data.blockedDates);
      setIsLiveBackend(data.isLiveBackend);
    } catch {
      setIsLiveBackend(isLiveAppsScriptConnected());
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refreshSiteConfig();
  }, [refreshSiteConfig]);

  return (
    <SiteConfigContext.Provider
      value={{
        settings,
        ventures,
        availability,
        blockedDates,
        isLiveBackend,
        loaded,
        refreshSiteConfig,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
