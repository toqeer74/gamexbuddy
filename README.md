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