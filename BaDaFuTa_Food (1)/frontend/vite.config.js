import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    watch: {
      usePolling: true,
      interval: 2000, // giảm tần suất check
    },
    host: true,
    port: 5173,
    // ✅ Cho phép ngrok host truy cập
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "192.168.100.124",
      "unnibbed-unthrilled-averi.ngrok-free.dev", // thêm host ngrok
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
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import fs from "fs";
// import path from "path";

// // HTTPS tự ký (dev)
// const httpsOptions = {
//   key: fs.readFileSync(path.resolve(__dirname, "certs/key.pem")),
//   cert: fs.readFileSync(path.resolve(__dirname, "certs/cert.pem")),
// };

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": "/src",
//     },
//   },
//   // vite.config.js
//   server: {
//     host: true,
//     port: 5173,
//     https: httpsOptions,
//     proxy: {
//       "/api": {
//         target: "https://192.168.100.124:3000", // BE HTTPS
//         changeOrigin: true,
//         secure: false, // self-signed cert
//         rewrite: (path) => path.replace(/^\/api/, ""),
//       },
//     },
//   },
// });
