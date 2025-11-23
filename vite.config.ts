import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // We use the provided API key as a fallback if the environment variable isn't set.
  // @ts-ignore
  const env = loadEnv(mode, process.cwd(), '');
  
  const apiKey = env.API_KEY || "AIzaSyALVHnsuR-jiEEPiyHqJ0-CakyqbWpOuG4";

  return {
    plugins: [react()],
    define: {
      // This replaces 'process.env.API_KEY' in your code with the actual string value during the build
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});