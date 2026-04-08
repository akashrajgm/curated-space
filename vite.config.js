import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
  server: {
    proxy: {
      // ─── The Proxy Bridge ─────────────────────────────────────────────
      // All requests to /api/* are forwarded to Render's backend.
      // The browser sees them as same-origin → zero CORS pre-flights.
      '/api': {
        target: 'https://interior-marketplace-api.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`⚡ PROXY → ${req.method} ${req.url} → ${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(`✅ PROXY ← ${proxyRes.statusCode} ${req.url}`);
          });
          proxy.on('error', (err, req) => {
            console.error(`🔴 PROXY ERROR: ${req.url}`, err.message);
          });
        },
      },
    },
  },
})
