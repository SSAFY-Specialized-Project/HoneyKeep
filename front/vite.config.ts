import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import removeConsole from "vite-plugin-remove-console";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    removeConsole(),
    svgr(),
  ],
  resolve: {
    alias: {
      "@": "/src", // 프로젝트 루트 기준 src 폴더를 가리킴
    },
  },
});
