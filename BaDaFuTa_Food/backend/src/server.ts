// // src/server.ts
// import 'module-alias/register';
// import 'dotenv/config';
// import { createApp } from './app';
// import { createServer } from 'http';
// import { initSocket } from './socket'; // import socket init

// const PORT = Number(process.env.PORT) || 3000;
// const HOST = process.env.HOST || '0.0.0.0';

// const app = createApp();
// const httpServer = createServer(app);

// // Init Socket.IO
// const io = initSocket(httpServer);

// const server = app.listen(PORT, HOST, () => {
//   const shownHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
//   console.log(`\n🚀 API listening on http://${shownHost}:${PORT}\n`);
// });

// server.on('error', (err: any) => {
//   console.error('❌ Server failed to start:', err?.message || err);
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
import { Server as IOServer } from 'socket.io';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = createApp();
const httpServer = createServer(app);

// Socket.IO
const io = new IOServer(httpServer, {
  path: '/socket.io', // phải trùng FE
  cors: {
    origin: [
      'http://localhost:5173', // React dev
      'http://localhost:5174', // Merchant dev
      'http://localhost:5175', // Admin
      'https://ba-da-fu-ta-partner.vercel.app', // Prod
      'https://badafuta-production.up.railway.app',
      'https://badafuta.onrender.com',
      'https://ba-da-fu-ta-food.vercel.app',
      'https://ba-da-fu-ta-partner.vercel.app',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Khi khách gửi đơn
app.post('/api/order', (req, res) => {
  const orderData = req.body;
  console.log('🔹 Backend nhận order:', orderData);

  // Hardcode gửi trực tiếp đến merchant_id từ order
  if (orderData.merchant_id) {
    io.to(orderData.merchant_id).emit('newOrder', orderData);
    console.log(`📢 Emit order đến merchant ${orderData.merchant_id}`);
  }

  res.status(201).json({ success: true, order: orderData });
});

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('joinMerchant', (merchantId: string) => {
    console.log(`Merchant ${merchantId} joined room`);
    socket.join(merchantId);
  });

  socket.on('newOrder', (orderData) => {
    console.log('🔹 Backend nhận order:', orderData);
    const merchantId = orderData.merchant_id;
    io.to(merchantId).emit('newOrder', orderData);
  });
});

httpServer.listen(PORT, HOST, () => {
  const shownHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`🚀 API + Socket.IO listening on http://${shownHost}:${PORT}`);
});

httpServer.on('error', (err: any) => {
  console.error('❌ Server failed to start:', err?.message || err);
  process.exit(1);
});
