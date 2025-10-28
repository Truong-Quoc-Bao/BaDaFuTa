import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import session from "express-session";
import dotenv from "dotenv";
import routes from "./routes";
import { bigIntJsonMiddleware } from "./middlewares/bigint-json.middleware";

dotenv.config();

export const createApp = () => {
  const app = express();

  // Middleware setup
  app.use((req, _res, next) => {
    console.log("→", req.method, req.originalUrl);
    next();
  });

  app.use(helmet());
  app.use(compression());
  app.use(express.json());

  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://192.168.100.124:5173",
        "http://172.20.10.3:5173",
        "https://unnibbed-unthrilled-averi.ngrok-free.dev",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "abc123",
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
      },
    })
  );

  app.use(bigIntJsonMiddleware);
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", routes);
  app.use((_req, res) => res.status(404).json({ error: "Not found" }));

  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
};
