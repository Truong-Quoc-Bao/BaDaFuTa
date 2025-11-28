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
    path: '/socket.io', // cực kỳ quan trọng trên Railway
  });

  io.on('connection', (socket: Socket) => {
    console.log('✅ Client connected:', socket.id);

    socket.on('joinMerchant', (merchantId: string) => {
      console.log(`Merchant ${merchantId} joined`);
      socket.join(merchantId);
    });

    socket.on('newOrder', (merchantId: string, orderData: any) => {
      io.to(merchantId).emit('newOrder', orderData);
    });

    // test emit đơn mới 5s sau connect
    setTimeout(() => {
      io.to('rest-1').emit('newOrder', { id: 'order123', status: 'pending' });
    }, 5000);
  });

  return io;
};
