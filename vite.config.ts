import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/xlsx')) return 'xlsx';
          if (id.includes('node_modules/jspdf')) return 'pdf';
          if (id.includes('node_modules/jszip') || id.includes('node_modules/file-saver')) return 'zip';
          if (id.includes('node_modules/qr-code-styling')) return 'qrcode';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor';
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
})
