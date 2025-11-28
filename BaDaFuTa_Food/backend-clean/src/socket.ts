import { Server as HttpServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';

export const initSocket = (server: HttpServer) => {
  const io = new IOServer(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://ba-da-fu-ta-partner.vercel.app',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
  });

  io.on('connection', (socket: Socket) => {
    console.log('✅ Client connected:', socket.id);

    // Merchant join room
    socket.on('joinMerchant', (merchantId: string) => {
      console.log(`Merchant ${merchantId} joined`);
      socket.join(merchantId);
    });

    // Khi khách tạo đơn, backend nhận orderData
    socket.on('newOrder', (orderData: any) => {
      const merchantId = orderData.merchant_id; // lấy từ orderData
      if (!merchantId) return;
      io.to(merchantId).emit('newOrder', orderData);
    });

    // Test emit đơn mới sau 5s
    setTimeout(() => {
      const testOrder = { id: 'order123', status: 'pending', merchant_id: 'rest-1' };
      io.to(testOrder.merchant_id).emit('newOrder', testOrder);
    }, 5000);
  });

  return io;
};
