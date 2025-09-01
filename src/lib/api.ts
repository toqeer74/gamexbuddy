import axios from "axios";

// Fetch Rockstar Newswire (via RSS2JSON API)
export const fetchRockstarNews = async () => {
  try {
    const RSS_FEED_URL = "https://www.rockstargames.com/newswire/rss";
    // Using a public RSS2JSON converter. Note: This might have rate limits or require an API key for production use.
    const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEED_URL)}`);
    return response.data.items.map((item: any) => ({
      id: item.guid || item.link,
      title: item.title,
      description: item.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...', // Strip HTML and truncate
      imageUrl: item.enclosure?.link || item.thumbnail, // Try to get an image
      link: item.link,
      isOfficial: true, // All news from Rockstar Newswire is official
    }));
  } catch (error) {
    console.error("Error fetching Rockstar news:", error);
    return [];
  }
};

// Fetch Reddit Memes (from r/gaming or r/memes)
export const fetchRedditMemes = async () => {
  try {
    const REDDIT_SUBREDDIT = "gaming"; // Or 'memes', 'dankmemes', etc.
    const response = await axios.get(`https://www.reddit.com/r/${REDDIT_SUBREDDIT}/top.json?limit=3&t=week`);
    return response.data.data.children.map((post: any) => {
      const data = post.data;
      // Filter out non-image posts or posts without a suitable thumbnail
      const imageUrl = data.thumbnail && data.thumbnail.startsWith('http') ? data.thumbnail : data.url_overridden_by_dest && data.url_overridden_by_dest.match(/\.(jpeg|jpg|gif|png)$/) != null ? data.url_overridden_by_dest : undefined;

      return {
        id: data.id,
        title: data.title,
        description: data.selftext || data.title, // Use selftext if available, otherwise title
        imageUrl: imageUrl,
        link: `https://www.reddit.com${data.permalink}`,
        type: "meme", // Assuming these are memes
        xp: data.score, // Using upvotes as XP
        isTrending: data.score > 1000, // Simple logic for trending
        authorName: data.author,
        authorAvatarUrl: undefined, // Reddit API doesn't easily provide avatars directly
      };
    }).filter((item: any) => item.imageUrl); // Only include posts with images
  } catch (error) {
    console.error("Error fetching Reddit memes:", error);
    return [];
  }
};