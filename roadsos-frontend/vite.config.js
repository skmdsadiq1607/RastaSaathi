import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  test: {
    environment: 'jsdom'
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      workbox: {
        runtimeCaching: [
          { urlPattern: /^https:\/\/maps\.googleapis\.com\//, handler: 'CacheFirst', options: { cacheName: 'google-maps-api', expiration: { maxEntries: 80, maxAgeSeconds: 7 * 24 * 60 * 60 } } },
          { urlPattern: /\/api\/(firstaid|hospital|resources)/, handler: 'NetworkFirst', options: { cacheName: 'roadsos-api-cache', networkTimeoutSeconds: 5, expiration: { maxEntries: 80, maxAgeSeconds: 24 * 60 * 60 } } }
        ]
      }
    })
  ]
});
