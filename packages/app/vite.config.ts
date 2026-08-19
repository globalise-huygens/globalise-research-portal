import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [tanstackStart(), react(), svgr()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
