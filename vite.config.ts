import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // App instalable: manifiesto + service worker que guarda la app para abrirla sin conexión
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Mewdoro',
        short_name: 'Mewdoro',
        description: 'Notas, código, tareas, rutinas y Pomodoro en un solo sitio.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1e1e2e',
        theme_color: '#1e1e2e',
        categories: ['productivity', 'education'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Los 700 kB del espacio de trabajo superan el límite por defecto de 2 MiB solo por poco; subimos el margen
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // Las rutas de Firebase Auth no deben pasar por la caché de navegación
        navigateFallbackDenylist: [/^\/__\//],
      },
    }),
  ],
  resolve: {
    // "@/" apunta a src/, como espera shadcn/ui
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
