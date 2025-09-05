// GameXBuddy Progressive Web App Service Worker
const CACHE_NAME = 'gamexbuddy-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Resources to cache
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html',
  '/Gamexbuddy-logo-v2-transparent.png',
  '/Gamexbuddy-logo-icon-transparent.png',
  '/favicon-color.js'
];

// Dynamic content cache
const DYNAMIC_CACHE_NAME = 'gamexbuddy-dynamic-v1.0.0';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🏗️ GameXBuddy Service Worker installing...');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(STATIC_CACHE_URLS);
      console.log('✅ Static assets cached');
    })()
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 GameXBuddy Service Worker activating...');
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );

      // Take control of all clients
      await clients.claim();
      console.log('✅ GameXBuddy Service Worker activated and ready!');
    })()
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        try {
          // Try network first for API calls
          const response = await fetch(request);
          return response;
        } catch (error) {
          console.log('🌐 API request failed, attempting cache:', error);
          // Return cached response if available
          return caches.match(request);
        }
      })()
    );
    return;
  }

  // Handle static assets and pages
  event.respondWith(
    (async () => {
      // Try cache first for static assets
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        // Fetch from network
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse.ok) {
          const cache = await caches.open(DYNAMIC_CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        console.log('🔌 Network request failed:', error);

        // Return offline page for navigation requests
        if (request.destination === 'document') {
          const offlineResponse = await caches.match(OFFLINE_URL);
          return offlineResponse || new Response(
            `
            <!DOCTYPE html>
            <html>
              <head>
                <title>GameXBuddy - Offline</title>
                <style>
                  body {
                    background: linear-gradient(135deg, #0b0b12 0%, #1a1a2e 100%);
                    color: #00f5ff;
                    font-family: 'Inter', sans-serif;
                    text-align: center;
                    padding: 50px;
                    min-height: 100vh;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .container {
                    max-width: 600px;
                  }
                  h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    text-shadow: 0 0 20px rgba(255,43,214,0.5);
                  }
                  p {
                    font-size: 1.2rem;
                    color: #8b5cf6;
                    margin-bottom: 2rem;
                  }
                  .retry-btn {
                    background: linear-gradient(90deg, #ff2bd6, #00f5ff);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                  }
                  .retry-btn:hover {
                    transform: scale(1.05);
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>🎮 GameXBuddy</h1>
                  <p>You're currently offline. Please check your connection and try again.</p>
                  <button class="retry-btn" onclick="window.location.reload()">🔄 Retry</button>
                </div>
              </body>
            </html>
            `,
            {
              headers: { 'Content-Type': 'text/html' }
            }
          );
        }

        // Return error response for other requests
        return new Response('Network error: Content not available', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});

// Background sync for newsletter subscriptions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);

  if (event.tag === 'newsletter-sync') {
    event.waitUntil(
      (async () => {
        try {
          const cache = await caches.open('newsletter-queue');
          const requests = await cache.keys();

          for (const request of requests) {
            try {
              const response = await fetch(request);
              if (response.ok) {
                await cache.delete(request);
                console.log('✅ Newsletter sync successful');
              }
            } catch (error) {
              console.log('❌ Newsletter sync failed:', error);
            }
          }
        } catch (error) {
          console.log('❌ Background sync error:', error);
        }
      })()
    );
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('🔔 Push message received:', event);

  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: '/Gamexbuddy-logo-icon-transparent.png',
      badge: '/Gamexbuddy-logo-icon-transparent.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: '🔍 View Details',
          icon: '/Gamexbuddy-logo-icon-transparent.png'
        },
        {
          action: 'close',
          title: '❌ Close',
          icon: '/Gamexbuddy-logo-icon-transparent.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'GameXBuddy Notification', options)
    );
  }
});

// Push notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification click received:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Periodic background sync for content updates
self.addEventListener('periodicsync', (event) => {
  console.log('🔄 Periodic sync:', event.tag);

  if (event.tag === 'content-sync') {
    event.waitUntil(
      (async () => {
        try {
          // Check for new content
          const response = await fetch('/api/content/updates');
          const data = await response.json();

          if (data.hasUpdates) {
            // Notify user of updates
            self.registration.showNotification('GameXBuddy Updates!', {
              body: 'New gaming content available!',
              icon: '/Gamexbuddy-logo-icon-transparent.png',
              tag: 'content-updates'
            });
          }
        } catch (error) {
          console.log('❌ Periodic sync error:', error);
        }
      })()
    );
  }
});

// Cache size management
const CACHE_SIZE_LIMIT = 100; // Maximum number of cached items

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('🚨 Service Worker Error:', event.error);
  // Send error to monitoring service
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
  // Send error to monitoring service
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_DATA') {
    console.log('📊 Performance Data:', event.data.payload);
    // Send performance data to analytics
  }
});
