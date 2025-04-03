import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

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
    svgr(),
    VitePWA({
      registerType: "autoUpdate", // 앱 열릴 때 자동 업데이트
      includeAssets: ["public-favicon/favicon.svg"],
      manifest: {
        name: "꿀킵",
        short_name: "꿀킵",
        description: "계획적인 자산관리 꿀팁, 꿀킵에 다 있다",
        theme_color: "#FFAA00",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "public-favicon/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "public-favicon/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src", // 프로젝트 루트 기준 src 폴더를 가리킴
    },
  },
});
