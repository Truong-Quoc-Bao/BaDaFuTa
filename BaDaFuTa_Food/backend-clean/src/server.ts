// src/server.ts
import "dotenv/config";
import { createApp } from "./app";

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const app = createApp();

const server = app.listen(PORT, HOST, () => {
  const shownHost = HOST === "0.0.0.0" ? "localhost" : HOST;
  console.log(`\n🚀 API listening on http://${shownHost}:${PORT}\n`);
});

server.on("error", (err: any) => {
  console.error("❌ Server failed to start:", err?.message || err);
  process.exit(1);
});
