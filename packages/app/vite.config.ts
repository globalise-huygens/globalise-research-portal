import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [tanstackRouter({ autoCodeSplitting: true }), react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
