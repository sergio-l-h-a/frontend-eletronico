import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Eleva o limite do aviso de 500kB para 1000kB
    rollupOptions: {
      output: {
        // Separa as dependências de node_modules (como React e React Router) em chunks menores
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})