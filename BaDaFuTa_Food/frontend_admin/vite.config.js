import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vite.dev/config/
export default defineConfig({
  // Sử dụng plugin react, loại bỏ plugin tailwindcss() v4 ở đây vì v3 chạy qua PostCSS bên dưới
  plugins: [react()],

  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },

  server: {
    watch: {
      usePolling: true,
      interval: 2000, // giảm tần suất check
    },
    host: true,
    port: 5175,
    strictPort: false,
    // ✅ Cho phép ngrok host truy cập
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '172.20.10.3',
      '192.168.100.124',
      'unnibbed-unthrilled-averi.ngrok-free.dev', // thêm host ngrok
    ],
    proxy: {
      '/api192': {
        target: 'http://192.168.100.124:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api192/, '/api'),
      },
      '/apiLocal': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apiLocal/, '/api'),
      },
      '/api172': {
        target: 'http://172.20.10.3:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api172/, '/api'),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      external: ['socket.io-client'], // 🔹 Thêm dòng này
    },
  },
  optimizeDeps: {
    include: ['socket.io-client'],
  },
});
