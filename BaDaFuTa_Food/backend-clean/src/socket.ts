import { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";

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
  });

  io.on("connection", (socket: Socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("joinMerchant", (merchantId: string) => {
      console.log(`Merchant ${merchantId} joined`);
      socket.join(merchantId);
    });

    socket.on("newOrder", (merchantId: string, orderData: any) => {
      io.to(merchantId).emit("newOrder", orderData);
    });
  });

  return io;
};
