import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    open: false,
    // /api requests go to the local Express server that runs the same /api files Vercel will use
    proxy: { '/api': { target: 'http://127.0.0.1:3180', changeOrigin: false } },
  },
  build: {
    rollupOptions: {
      output: {
        // split large libraries into their own long-cached files
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          i18n: ['i18next', 'react-i18next'],
          icons: ['lucide-react'],
        },
      },
    },
  },
})
