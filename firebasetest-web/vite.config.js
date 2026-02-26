import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://helloworld-ftfo4ql2pa-el.a.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ola-api': {
        target: 'https://api.olamaps.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ola-api/, ''),
      },
      '/osm': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/osm/, ''),
        headers: {
            'User-Agent': 'MasjidTimingsApp/1.0' // Nominatim requires a User-Agent
        }
      }
    }
  }
})
