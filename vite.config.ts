import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/public': path.resolve(__dirname, './public'),
    },
  },
  server: {
    proxy: {
      '/goalserve': {
        target: 'http://data2.goalserve.com:8084',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/goalserve/, ''),
      },
    },
  },
  // Note: Vite dev server automatically handles History API fallback
  // For production, configure your server to serve index.html for all routes
  // See vercel.json (for Vercel) and public/_redirects (for Netlify)
})
