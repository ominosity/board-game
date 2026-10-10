import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',

  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    allowedHosts: ['https://burgener-chalet-board-games.onrender.com/'],
  },

  build: {
    target: 'esnext',
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        account: resolve(__dirname, 'src/account/index.html'),
        register: resolve(__dirname, 'src/account/register.html'),
        edit: resolve(__dirname, 'src/account/edit.html'),
        browse: resolve(__dirname, 'src/browse/index.html'),
        details: resolve(__dirname, 'src/details/index.html'),
        favorites: resolve(__dirname, 'src/favorites/index.html'),
        schedule: resolve(__dirname, 'src/schedule/index.html'),
        search: resolve(__dirname, 'src/search/index.html'),
      },
    },
  },
});
