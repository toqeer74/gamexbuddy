import { useEffect, useState } from 'react';
import {
  rawgAPI,
  igdbAPI,
  cheapSharkAPI,
  twitchAPI,
  youtubeAPI,
  newsAPI,
  checkAPIs
} from '@/lib/api';

interface ApiStatus {
  [key: string]: {
    available: boolean;
    tested: boolean;
    working: boolean;
    error?: string;
  };
}

export const useApiStatus = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    rawg: { available: false, tested: false, working: false },
    igdb: { available: false, tested: false, working: false },
    cheapshark: { available: false, tested: false, working: false },
    twitch: { available: false, tested: false, working: false },
    youtube: { available: false, tested: false, working: false },
    news: { available: false, tested: false, working: false },
  });

  const testAPI = async (apiName: string) => {
    let working = false;
    let error = '';

    try {
      switch (apiName) {
        case 'rawg':
          await rawgAPI.getGames({ page_size: 1 });
          working = true;
          break;
        case 'igdb':
          await igdbAPI.getGames('fields name; limit 1;');
          working = true;
          break;
        case 'cheapshark':
          await cheapSharkAPI.getDeals({ pageSize: 1 });
          working = true;
          break;
        case 'twitch':
          await twitchAPI.getStreams({ first: 1 });
          working = true;
          break;
        case 'youtube':
          await youtubeAPI.searchVideos({ q: 'gaming', maxResults: 1 });
          working = true;
          break;
        case 'news':
          await newsAPI.getGamingNews({ q: 'gaming', pageSize: 1 });
          working = true;
          break;
      }
    } catch (err: any) {
      error = err.message || 'Unknown error';
      console.error(`${apiName} API test failed:`, err);
    }

    setApiStatus(prev => ({
      ...prev,
      [apiName]: {
        ...prev[apiName],
        tested: true,
        working,
        error: working ? undefined : error
      }
    }));

    return working;
  };

  const testAllAPIs = async () => {
    for (const apiName of Object.keys(apiStatus)) {
      if (apiStatus[apiName].available) {
        await testAPI(apiName);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  };

  useEffect(() => {
    const configuredAPIs = checkAPIs();
    setApiStatus(prev =>
      Object.keys(prev).reduce((acc, apiName) => ({
        ...acc,
        [apiName]: {
          ...prev[apiName],
          available: configuredAPIs[apiName as keyof typeof configuredAPIs] || false
        }
      }), {} as ApiStatus)
    );
  }, []);

  return {
    apiStatus,
    testAPI,
    testAllAPIs,
    totalConfigured: Object.values(apiStatus).filter(api => api.available).length,
    totalWorking: Object.values(apiStatus).filter(api => api.tested && api.working).length,
  };
};