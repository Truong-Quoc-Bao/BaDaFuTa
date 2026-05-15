// // src/ws.ts
// import { createServer } from "http";
// import { createApp } from "./app";
// import { WebSocketServer, WebSocket } from "ws"; // import class trực tiếp

// const app = createApp();
// export const server = createServer(app);

// // Khởi tạo WS server
// export const wss = new WebSocketServer({ server, path: "/ws/merchant" });

// wss.on("connection", (socket: WebSocket) => {
//   console.log("WS client connected");

//   socket.on("message", (msg) => {
//     console.log("Received WS message:", msg.toString());
//   });

//   socket.on("close", () => console.log("WS client disconnected"));
// });

// // Hàm broadcast
// export const broadcastNewOrder = (order: any) => {
//   wss.clients.forEach((client) => {
//     if ((client as WebSocket).readyState === WebSocket.OPEN) {
//       (client as WebSocket).send(JSON.stringify({ type: "newOrder", data: order }));
//     }
//   });
// };
