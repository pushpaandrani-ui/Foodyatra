import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This ensures process.env.API_KEY in the code is replaced by the actual environment variable during build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});