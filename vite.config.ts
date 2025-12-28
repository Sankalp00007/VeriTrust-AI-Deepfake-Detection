
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This makes process.env.API_KEY available inside your application code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
    allowedHosts: true // Ensures Render's health checks can reach the service
  },
  build: {
    outDir: 'dist'
  }
});
