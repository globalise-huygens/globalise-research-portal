import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [tailwindcss(), tanstackRouter({ autoCodeSplitting: true }), react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../design/src", import.meta.url)),
    },
    dedupe: ["react", "react-dom"],
  },
});
