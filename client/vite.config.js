import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
  },
  
  
  
  server: {
    proxy: {
      '/api':{
        target: 'http://localhost:5000',changeOrigin: true,
      }
    }
  }
})