import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [tanstackRouter({ autoCodeSplitting: true }), react(), svgr()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
});
