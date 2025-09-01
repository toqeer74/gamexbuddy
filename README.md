# GamexBuddy

Welcome to GamexBuddy, your ultimate hub for all things gaming! This application is designed to be a central point for gamers to find the latest news, explore game-specific content, connect with a vibrant community, and access useful tools.

## Project Goals

*   **Centralized Gaming Hub**: Provide a single platform for news, game information, and community interaction.
*   **Engaging User Experience**: Implement modern UI/UX with responsive design, animated elements, and intuitive navigation.
*   **Community Focus**: Foster a strong community through forums, discussions, and social integration.
*   **Scalable Architecture**: Build with a modular and maintainable codebase using React, TypeScript, and Tailwind CSS.

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

## GitHub Workflow

*   **Commit often**: Make small, atomic commits with clear messages.
*   **Push to your branch**: Regularly push your changes to your feature branch.
*   **Create Pull Requests**: When a feature is complete, open a pull request to merge into `main`.

## Supabase Setup

GamexBuddy uses Supabase for backend services, including authentication and database management.

1.  **Create a Supabase Project**: If you haven't already, create a new project on the [Supabase website](https://supabase.com/).
2.  **Retrieve Credentials**: Find your `Project URL` and `Anon Key` in your Supabase project settings under `API`.
3.  **Environment Variables**: Add these credentials to your `.env` file as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4.  **Database Schema**: Any database tables or RLS policies will be managed through SQL commands provided by Dyad.

## Tech Stack & Design Approach

*   **Frontend**: React, TypeScript
*   **Routing**: React Router
*   **Styling**: Tailwind CSS, Shadcn/ui components
*   **Icons**: Lucide React
*   **Backend**: Supabase (Auth, Database, Edge Functions)
*   **Design Principles**: Responsive, modern, gaming-themed UI with neon accents and glassmorphism effects.

## Key Files

*   `src/App.tsx`: Main application component, handles routing.
*   `src/pages/Index.tsx`: The landing page, featuring news, game hubs, and community highlights.
*   `src/components/layout/Navbar.tsx`: Top navigation bar with main links and platform dropdown.
*   `src/components/layout/Footer.tsx`: Bottom navigation, community links, and social media.
*   `src/integrations/supabase/client.ts`: Supabase client initialization.
*   `src/lib/api.ts`: Utility for fetching external data (e.g., Rockstar news, Reddit memes).