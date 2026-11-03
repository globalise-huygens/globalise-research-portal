import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    tanstackStart({
      router: {
        routesDirectory: "../../router/src/routes",
        generatedRouteTree: "../../router/src/routeTree.gen.ts",
        entry: "../../router/src/router.ts",
      },
    }),
    react(),
    svgr(),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
});
