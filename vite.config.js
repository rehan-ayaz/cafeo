import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    host: '0.0.0.0',
    watch: {
      ignored: [
        '**/.cafeo*/**',
        '**/*backup*/**',
        '**/.*/**',
        '**/*.zip',
        '**/image_backups/**',
        '**/gallery-chrome/**',
        '**/browser-audit/**',
        '**/browser-menu-audit/**',
        '**/.git/**',
        '**/dist/**'
      ]
    }
  }
});
