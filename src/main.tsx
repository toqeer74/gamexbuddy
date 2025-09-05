import { createRoot } from "react-dom/client";
import "@/lib/i18n";
import App from "./App.tsx";
import "./globals.css";
import "./styles/theme.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { HelmetProvider } from 'react-helmet-async';

// Wrap with error boundary
createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </HelmetProvider>
);

// Register PWA service worker in production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('🎮 GameXBuddy PWA Service Worker registered:', registration.scope);
        })
        .catch(error => {
          console.log('❌ Service Worker registration failed:', error);
        });
    } catch {}
  });
}
