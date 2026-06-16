import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {tanstackRouter} from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [tanstackRouter(), tailwindcss(), react()],
})
