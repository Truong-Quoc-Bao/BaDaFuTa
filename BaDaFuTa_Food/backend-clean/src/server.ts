// // src/server.ts
// import 'module-alias/register';
// import "dotenv/config";
// import { createApp } from "./app";

// const PORT = Number(process.env.PORT) || 3000;
// const HOST = process.env.HOST || "0.0.0.0";

// const app = createApp();

// const server = app.listen(PORT, HOST, () => {
//   const shownHost = HOST === "0.0.0.0" ? "localhost" : HOST;
//   console.log(`\n🚀 API listening on http://${shownHost}:${PORT}\n`);
// });

// server.on("error", (err: any) => {
//   console.error("❌ Server failed to start:", err?.message || err);
//   process.exit(1);
// });
// // const PORT = Number(process.env.PORT) || 8080;

// // const app = createApp();

// // const server = app.listen(PORT, () => {
// //   console.log(`🚀 API listening on port ${PORT}`);
// // });

// // server.on('error', (err: any) => {
// //   console.error('❌ Server failed to start:', err?.message || err);
// //   process.exit(1);
// // });

import 'module-alias/register';
import 'dotenv/config';
import { createApp } from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = createApp();

// Tạo HTTP server từ Express app
const httpServer = createServer(app);

// Mount Socket.IO với CORS riêng cho WebSocket
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173', // React dev
      'http://localhost:5174', // Merchant dev
      'https://ba-da-fu-ta-partner.vercel.app', // Prod
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO: khi client connect
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Join merchant room
  socket.on('joinMerchant', (merchantId) => {
    console.log(`Merchant ${merchantId} joined room`);
    socket.join(merchantId);
  });

  // Test emit đơn mới sau 5s
  setTimeout(() => {
    io.to('rest-1').emit('newOrder', { id: 'order123', status: 'pending' });
  }, 5000);
});

// Start server
httpServer.listen(PORT, HOST, () => {
  const shownHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`\n🚀 API + Socket.IO listening on http://${shownHost}:${PORT}\n`);
});

// Handle server error
httpServer.on('error', (err: any) => {
  console.error('❌ Server failed to start:', err?.message || err);
  process.exit(1);
});
