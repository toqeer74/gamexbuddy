# 🎮 GameXBuddy API Setup Guide
Complete guide to get all API keys and integrate with your gaming platform

## 📋 **API Checklist**
- ✅ RAWG (Video Games Database)
- ✅ IGDB (Game Details & Reviews)
- ✅ CheapShark (Game Prices)
- ✅ Twitch (Live Streams)
- ✅ YouTube (Gaming Videos)
- ✅ News API (Gaming News)
- ✅ Stripe (Payments)
- ✅ Supabase (Backend)

---

## 🚀 **Step 1: RAWG API (Video Games Database)**

**FREE** - No credit card required

### Getting Your Key:
1. Go to [https://rawg.io/apidocs](https://rawg.io/apidocs)
2. Click "Get API Key" button
3. Sign up with email/GitHub
4. Get your API key from dashboard

### Environment Variable:
```bash
VITE_RAWG_API_KEY=your_key_here
```

---

## 🎮 **Step 2: IGDB API (Game Details & Reviews)**

**FREE** - Uses Twitch credentials

### Getting Your Keys:
1. Go to [https://dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps)
2. Click "Create Application"
3. Fill out:
   - **Name:** `GameXBuddy IGDB`
   - **OAuth Redirect URLs:** `http://localhost:3000` (can add production later)
   - **Category:** `Game Integration`
4. Get your **Client ID** and **Client Secret**

### Environment Variables:
```bash
VITE_IGDB_CLIENT_ID=your_client_id_here
VITE_IGDB_CLIENT_SECRET=your_client_secret_here
```

---

## 💰 **Step 3: CheapShark API (Game Prices)**

**FREE** - Optional key for higher limits

### Getting Your Key (Optional):
1. Go to [https://www.cheapshark.com/api](https://www.cheapshark.com/api)
2. Get their free API key (increases rate limits)
3. **OR** Skip this - their free tier works without a key

### Environment Variable:
```bash
VITE_CHEAPSHARK_API_KEY=your_key_here_or_leave_empty
```

---

## 📺 **Step 4: Twitch API (Live Streams)**

**FREE** - Same app as IGDB if you did that

### Getting Your Keys:
1. Go to [https://dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps)
2. Create new application or use existing IGDB app
3. Fill out:
   - **Name:** `GameXBuddy Streams`
   - **OAuth Redirect URLs:** `http://localhost:3000`
   - **Category:** `Game Integration`

### Environment Variables:
```bash
VITE_TWITCH_CLIENT_ID=your_client_id_here
VITE_TWITCH_CLIENT_SECRET=your_client_secret_here
```

---

## 🎥 **Step 5: YouTube API (Gaming Videos)**

**FREE** - $0/month tier with 10,000 requests/day

### Getting Your Key:
1. Go to [https://console.developers.google.com/](https://console.developers.google.com/)
2. Create a new project (or use existing)
3. Go to "Library" → Search "YouTube Data API v3"
4. Click "Enable"
5. Go to "Credentials" → Create API Key
6. Copy your API key

### Environment Variables:
```bash
VITE_YOUTUBE_API_KEY=your_api_key_here
```

---

## 📰 **Step 6: News API (Gaming News)**

**FREE** - 500 requests/day

### Getting Your Key:
1. Go to [https://newsapi.org/register](https://newsapi.org/register)
2. Fill out registration:
   - **Name:** Your full name
   - **Email:** Your email address
   - **Website URL:** `http://localhost:3000` (for development)
3. Verify email and get your API key

### Environment Variables:
```bash
VITE_NEWS_API_KEY=your_api_key_here
```

---

## 💳 **Step 7: Stripe (Payments)**

**FREE** - Test mode available

### Getting Your Keys:
1. Go to [https://dashboard.stripe.com/](https://dashboard.stripe.com/)
2. Create an account (email verification)
3. Go to "Developers" → "API Keys" tab
4. Copy your "Publishable key" and "Secret key"
5. Create a product and price in the Stripe dashboard
6. Add webhook endpoints for Supabase functions

### Environment Variables:
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PRICE_ID=price_1234567890abcdef
STRIPE_SUCCESS_URL=https://yourdomain.com/plus/success
STRIPE_CANCEL_URL=https://yourdomain.com/plus
```

---

## 🗄️ **Step 8: Supabase (Backend Database)**

**FREE** - 500MB database, 50MB files

### Getting Your Keys:
1. Go to [https://supabase.com/](https://supabase.com/)
2. Create an account
3. Create new project:
   - **Project name:** `GameXBuddy`
   - **Region:** Choose closest to you
   - **Password:** Create a strong password
4. Wait for project creation (~2 minutes)
5. Go to "Settings" → "API" tab
6. Copy your project URL and API keys

### Environment Variables:
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## 🔧 **Step 9: Final Setup**

### 1. Create `.env` file:
```bash
cp .env.example .env
```

### 2. Fill in all environment variables
### 3. Test the APIs:
```bash
npm run dev
```

### 4. Check browser console for API status
### 5. Visit each page to test integrations

## 🧪 **Testing Your APIs**

Once you have all keys, test these features:

- **Search games** (RAWG) - `/search`
- **Game details** (IGDB) - `/games/[id]`
- **Price comparison** (CheapShark) - Marketplace
- **Live streams** (Twitch) - `/streams`
- **YouTube videos** (YouTube) - StreamWall
- **Gaming news** (NewsAPI) - NewsFeed
- **Premium payments** (Stripe) - PremiumFeatures
- **User data** (Supabase) - All features

## 🚀 **Next Steps**

1. **Database Setup**: Create Supabase tables using the provided SQL schema
2. **Webhook Setup**: Configure Stripe webhooks for payment processing
3. **Production Deployment**: Set up hosting and domains
4. **Content Seeding**: Add more games, quizzes, and content

## 💡 **Tips**

- Start with development/test environment
- Use test API keys first
- Monitor API usage to stay within free limits
- Set up monitoring for API rate limit alerts

---

## 🎯 **Need Help?**

If you encounter issues:
1. Check browser console for error messages
2. Verify environment variables are loaded
3. Test API keys individually
4. Check API documentation for rate limits

All APIs are now ready to power your GameXBuddy platform! 🚀