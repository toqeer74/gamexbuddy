// API Configuration and Clients

// Environment Variables Setup
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const IGDB_CLIENT_ID = import.meta.env.VITE_IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = import.meta.env.VITE_IGDB_CLIENT_SECRET;
const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = import.meta.env.VITE_TWITCH_CLIENT_SECRET;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHEAPSHARK_API_KEY = import.meta.env.VITE_CHEAPSHARK_API_KEY;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

// RAWG API - Video Games Database
export class RAWGAPI {
  private baseURL = 'https://api.rawg.io/api';

  async getGames(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    genres?: string;
    platforms?: string;
  }): Promise<any> {
    const query = new URLSearchParams();
    query.set('key', RAWG_API_KEY);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }

    const response = await fetch(`${this.baseURL}/games?${query}`);
    if (!response.ok) throw new Error('RAWG API error');
    return response.json();
  }

  async getGameDetails(id: number): Promise<any> {
    const response = await fetch(`${this.baseURL}/games/${id}?key=${RAWG_API_KEY}`);
    if (!response.ok) throw new Error('RAWG API error');
    return response.json();
  }

  async getScreenshots(id: number): Promise<any> {
    const response = await fetch(`${this.baseURL}/games/${id}/screenshots?key=${RAWG_API_KEY}`);
    if (!response.ok) throw new Error('RAWG API error');
    return response.json();
  }

  async getGenres(): Promise<any> {
    const response = await fetch(`${this.baseURL}/genres?key=${RAWG_API_KEY}`);
    if (!response.ok) throw new Error('RAWG API error');
    return response.json();
  }

  async getPlatforms(): Promise<any> {
    const response = await fetch(`${this.baseURL}/platforms?key=${RAWG_API_KEY}`);
    if (!response.ok) throw new Error('RAWG API error');
    return response.json();
  }
}

// IGDB API - Game Details & Reviews
export class IGDBAPI {
  private baseURL = 'https://api.igdb.com/v4';
  private accessToken: string | null = null;

  async authenticate(): Promise<void> {
    if (this.accessToken) return;

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: IGDB_CLIENT_ID,
        client_secret: IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials'
      })
    });

    const data = await response.json();
    this.accessToken = data.access_token;
  }

  private async authenticatedFetch(endpoint: string, body: string): Promise<any> {
    await this.authenticate();

    const response = await fetch(`${this.baseURL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'text/plain'
      },
      body
    });

    if (!response.ok) throw new Error('IGDB API error');
    return response.json();
  }

  async getGames(query: string = 'fields *; limit 10;'): Promise<any> {
    return this.authenticatedFetch('games', query);
  }

  async getGame(id: number): Promise<any> {
    const query = `fields *; where id = ${id};`;
    const games = await this.authenticatedFetch('games', query);
    return games[0];
  }

  async getReviews(gameId: number): Promise<any> {
    const query = `fields *; where game = ${gameId};`;
    return this.authenticatedFetch('reviews', query);
  }

  async searchGames(searchTerm: string, limit: number = 20): Promise<any> {
    const query = `fields name, id, cover.url, first_release_date, rating, rating_count;
                   search "${searchTerm}";
                   limit ${limit};`;
    return this.authenticatedFetch('games', query);
  }
}

// CheapShark API - Game Prices
export class CheapSharkAPI {
  private baseURL = 'https://www.cheapshark.com/api/1.0';

  async getDeals(params?: {
    storeID?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    desc?: boolean;
    lowerPrice?: number;
    upperPrice?: number;
    metacritic?: number;
    steamRating?: number;
    steamAppID?: string;
    title?: string;
    exact?: boolean;
  }): Promise<any> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }

    const response = await fetch(`${this.baseURL}/deals?${query}`);
    if (!response.ok) throw new Error('CheapShark API error');
    return response.json();
  }

  async getStores(): Promise<any> {
    const response = await fetch(`${this.baseURL}/stores`);
    if (!response.ok) throw new Error('CheapShark API error');
    return response.json();
  }

  async getGameDeals(gameID: number): Promise<any> {
    const response = await fetch(`${this.baseURL}/games?id=${gameID}`);
    if (!response.ok) throw new Error('CheapShark API error');
    return response.json();
  }
}

// Twitch API - Live Streams
export class TwitchAPI {
  private accessToken: string | null = null;

  async authenticate(): Promise<void> {
    if (this.accessToken) return;

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      })
    });

    const data = await response.json();
    this.accessToken = data.access_token;
  }

  private async authenticatedFetch(endpoint: string, params?: URLSearchParams): Promise<any> {
    await this.authenticate();

    const url = new URL(`https://api.twitch.tv/helix/${endpoint}`);
    if (params) {
      params.forEach((value, key) => url.searchParams.set(key, value));
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${this.accessToken}`,
      }
    });

    if (!response.ok) throw new Error('Twitch API error');
    return response.json();
  }

  async getStreams(params: {
    game_id?: string;
    language?: string;
    first?: number;
  } = {}): Promise<any> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.set(key, String(value));
    });

    return this.authenticatedFetch('streams', query);
  }

  async getGames(names: string[]): Promise<any> {
    const query = new URLSearchParams();
    names.forEach(name => query.append('name', name));

    return this.authenticatedFetch('games', query);
  }

  async searchChannels(query: string): Promise<any> {
    const params = new URLSearchParams();
    params.set('query', query);
    params.set('first', '20');

    return this.authenticatedFetch('search/channels', params);
  }
}

// YouTube API - Gaming Videos
export class YouTubeAPI {
  private baseURL = 'https://www.googleapis.com/youtube/v3';

  async searchVideos(params: {
    q: string;
    maxResults?: number;
    order?: string;
    type?: string;
  }): Promise<any> {
    const query = new URLSearchParams({
      key: YOUTUBE_API_KEY,
      part: 'snippet',
      ...params
    });

    const response = await fetch(`${this.baseURL}/search?${query}`);
    if (!response.ok) throw new Error('YouTube API error');
    return response.json();
  }

  async getChannelVideos(channelId: string, params?: {
    maxResults?: number;
    order?: string;
  }): Promise<any> {
    const query = new URLSearchParams({
      key: YOUTUBE_API_KEY,
      part: 'snippet',
      channelId,
      ...params
    });

    const response = await fetch(`${this.baseURL}/search?${query}`);
    if (!response.ok) throw new Error('YouTube API error');
    return response.json();
  }

  async getVideoDetails(videoIds: string[]): Promise<any> {
    const query = new URLSearchParams({
      key: YOUTUBE_API_KEY,
      part: 'snippet,statistics',
      id: videoIds.join(',')
    });

    const response = await fetch(`${this.baseURL}/videos?${query}`);
    if (!response.ok) throw new Error('YouTube API error');
    return response.json();
  }
}

// News API - Gaming News
export class NewsAPI {
  private baseURL = 'https://newsapi.org/v2';

  async getGamingNews(params: {
    q?: string;
    sources?: string;
    pageSize?: number;
    page?: number;
  } = {}): Promise<any> {
    const query = new URLSearchParams({
      apiKey: NEWS_API_KEY,
      ...params
    });

    const response = await fetch(`${this.baseURL}/everything?${query}`);
    if (!response.ok) throw new Error('NewsAPI error');
    return response.json();
  }

  async getTopHeadlines(params: {
    country?: string;
    category?: string;
    sources?: string;
    q?: string;
    pageSize?: number;
    page?: number;
  } = {}): Promise<any> {
    const query = new URLSearchParams({
      apiKey: NEWS_API_KEY,
      ...params
    });

    const response = await fetch(`${this.baseURL}/top-headlines?${query}`);
    if (!response.ok) throw new Error('NewsAPI error');
    return response.json();
  }
}

// API Instances
export const rawgAPI = new RAWGAPI();
export const igdbAPI = new IGDBAPI();
export const cheapSharkAPI = new CheapSharkAPI();
export const twitchAPI = new TwitchAPI();
export const youtubeAPI = new YouTubeAPI();
export const newsAPI = new NewsAPI();

// Utility function to check if APIs are configured
export const checkAPIs = () => {
  return {
    rawg: !!RAWG_API_KEY,
    igdb: !!IGDB_CLIENT_ID && !!IGDB_CLIENT_SECRET,
    cheapshark: !!CHEAPSHARK_API_KEY,
    twitch: !!TWITCH_CLIENT_ID && !!TWITCH_CLIENT_SECRET,
    youtube: !!YOUTUBE_API_KEY,
    news: !!NEWS_API_KEY
  };
};

// Rockstar News Fetcher (For GTA6 hub)
export async function fetchRockstarNews(limit: number = 10): Promise<any[]> {
  try {
    // Using NewsAPI with GTA6 query as Rockstar doesn't have public API
    const response = await fetch(`https://newsapi.org/v2/everything?q=GTA+VI+OR+Grand+Theft+Auto+VI&apiKey=${NEWS_API_KEY}&pageSize=${limit}&sortBy=publishedAt`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch Rockstar news');
    }

    return data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source.name
    }));
  } catch (error) {
    console.error('Error fetching Rockstar news:', error);
    // Fallback to mock data if API fails
    return [
      {
        title: "GTA VI Release Date Update",
        description: "Rockstar Games provides latest updates on Grand Theft Auto VI development",
        url: "#",
        image: "/gta6-hero.jpg",
        publishedAt: new Date().toISOString(),
        source: "Rockstar Games"
      }
    ];
  }
}