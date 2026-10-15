import { defineConfig } from 'vitest/config';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgr()],
  test: {
    include: ['packages/*/src/**/*.spec.ts'],
  },
});
