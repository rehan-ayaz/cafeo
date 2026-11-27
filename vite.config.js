import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: isSsrBuild ? {} : {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router/') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'vendor-react';
          }
        },
      },
    },
  },
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
        '**/dist/**',
      ],
    },
  },
}));
