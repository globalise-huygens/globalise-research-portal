import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import svgr from "vite-plugin-svgr";

const { version } = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf-8"),
);

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
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
});
