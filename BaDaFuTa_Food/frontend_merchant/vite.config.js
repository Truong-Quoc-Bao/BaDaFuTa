import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true,
      interval: 2000,
    },
    host: true,
    port: 5174,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "172.20.10.3",
      "192.168.100.124",
      "unnibbed-unthrilled-averi.ngrok-free.dev",
    ],
    proxy: {
      "/api192": {
        target: "http://192.168.100.124:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api192/, "/api"),
      },
      "/apiLocal": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apiLocal/, "/api"),
      },
      "/api172": {
        target: "http://172.20.10.3:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api172/, "/api"),
      },
    },
  },

  // ⚡ Tối ưu build
  build: {
    chunkSizeWarningLimit: 1000, // Tăng limit để không cảnh báo

    rollupOptions: {
      output: {
        // Chia nhỏ để giảm file index.js từ 557KB xuống còn <250KB
        manualChunks: {
          react: ["react", "react-dom"],
          radix: [
            "@radix-ui/react-label",
            "@radix-ui/react-select",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-separator",
          ],
          utils: ["zustand", "axios"],
        },
      },
    },
  },

  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
