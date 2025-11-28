import { Server } from "socket.io";

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Merchant connected:", socket.id);

    socket.on("joinMerchant", (merchantId) => {
      socket.join(merchantId);
      console.log(`Merchant ${merchantId} joined room ${merchantId}`);
    });
  });

  // Hàm push đơn mới
  function pushNewOrderToMerchant(merchantId, orderData) {
    io.to(merchantId).emit("newOrder", orderData);
  }

  return { io, pushNewOrderToMerchant };
}
