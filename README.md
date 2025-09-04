# GamexBuddy

Welcome to GamexBuddy, your ultimate hub for all things gaming! This application is designed to be a central point for gamers to find the latest news, explore game-specific content, connect with a vibrant community, and access useful tools.

## Project Overview

GamexBuddy aims to be the go-to platform for gamers, offering a rich, interactive experience. From the latest news on highly anticipated titles like GTA6 to dedicated hubs for various gaming platforms (PC, PlayStation, Xbox, Android, iOS), a vibrant community section, and handy utility tools, GamexBuddy has you covered.

## Features

*   **GTA6 Hub**: Dedicated section for Grand Theft Auto VI news, trailers, countdowns, and updates.
*   **Platform Hubs**: Explore content specific to PC, PlayStation, Xbox, Android, and iOS gaming.
*   **Community**: Engage with fellow gamers through forums, memes, quizzes, and discussions.
*   **Utility Tools**: Access helpful tools like a "Can My PC Run GTA6?" checker (placeholder), fun quizzes, and a meme generator (coming soon).
*   **Latest News**: Stay updated with gaming news highlights from official sources and popular communities.
*   **Responsive Design**: A modern, engaging UI/UX with responsive design, animated elements, and intuitive navigation across all devices.

## Tech Stack

*   **Frontend**: React, TypeScript
*   **Routing**: React Router
*   **Styling**: Tailwind CSS, Shadcn/ui components
*   **Icons**: Lucide React
*   **Backend**: Supabase (Auth, Database, Edge Functions)
*   **Build Tool**: Vite
*   **Deployment**: Vercel

## Local Development

To get GamexBuddy up and running on your local machine:

1.  **Clone the repository**:
    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd gamexbuddy
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```
3.  **Set up environment variables**:
    Create a `.env` file in the root of your project based on `.env.example` and fill in your Supabase credentials.
    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```
4.  **Start the development server**:
    ```bash
    npm run dev
    # or yarn dev
    # or pnpm dev
    ```
    The application will typically be available at `http://localhost:8080`.

## Deployment Notes

This project is configured for deployment on platforms like Vercel. Ensure your environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are correctly set in your deployment environment.

---
*Built by toqeer*

### Admin Picks (curated recommendations)

An internal page exists at `/admin/picks` to manage the curated list in `public.recommended_games`.

- Drag-and-drop to reorder (ranks saved as 1..N)
- Edit badges inline (e.g., "Top Pick", "Editor’s Choice", "🔥 Hot Deal", "💸 Great Price")
- Add by slug, or remove an entry

Data model joins `recommended_games` to `games` for titles/covers and writes back via `upsert`.

Important: This page is not protected in this repo by default. Ensure you add auth/role protection before exposing it publicly.

## Environment Variables

Never commit `.env*` files. Keep secrets out of version control. Frontend uses Vite env vars (VITE_*) provided by your host; Edge Functions use Supabase secrets.

### Frontend (.env.local — not committed)
Set these in your hosting provider or a local `.env.local` file:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Edge Functions (Supabase secrets)
Set these in your Supabase project (Dashboard → Edge Functions → Secrets):

- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- RAWG_API_KEY
- CHEAPSHARK_BASE (optional, default: https://www.cheapshark.com/api/1.0)

#### One-time setup commands
```
supabase storage create-bucket media --public=false
supabase functions deploy sync-games
supabase secrets set SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... RAWG_API_KEY=...
```

## Auth Setup (Supabase)

Add these Redirect URLs in Supabase Auth settings:

```
http://localhost:5173/auth/callback
https://gamexbuddy.com/auth/callback
```

Grant editor rights (example):

```
update public.profiles set is_editor = true where id = '<USER_UUID>';
```

Notes:
- `/admin/picks` requires login and an editor or moderator role.
- Never expose the service_role key in the client; only Edge Functions should use it.

## Deploy to Netlify (GitHub)

Build settings
- Build command: `pnpm build`
- Publish directory: `dist`

Environment variables (add in Netlify Site settings → Build & deploy → Environment)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Optional: `VITE_ADMIN_TOKEN` (only if using token guard)

SPA fallback redirect (already included in `netlify.toml`)
```
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Functions proxy (replace YOUR-PROJECT with your Supabase project ref)
```
[[redirects]]
  from = "/functions/*"
  to = "https://YOUR-PROJECT.functions.supabase.co/:splat"
  status = 200
  force = true
```

Deploy Previews
- Netlify will build every pull request automatically and provide a unique preview URL for review.
