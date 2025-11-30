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
    // socket.on('joinMerchant', (merchantId: string) => {
    //   console.log(`Merchant ${merchantId} joined`);
    //   socket.join(merchantId);
    // });

    socket.on('newOrder', (orderData) => {
      console.log('🔹 Backend nhận order:', orderData);
      const merchantId = orderData.merchant_id;
      io.to(merchantId).emit('newOrder', orderData);
    });

    // Test emit đơn mới sau 5s
    setInterval(() => {
      const testOrder = {
        id: `order_${Date.now()}`,
        status: 'pending',
        merchant_id: '00ea6129-7f16-4376-925f-d1eab34037fa',
      };
      io.to(testOrder.merchant_id).emit('newOrder', testOrder);
      console.log('📦 Emit test order:', testOrder);
    }, 5000);
  });

  return io;
};
