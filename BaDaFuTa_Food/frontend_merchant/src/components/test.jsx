<header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSidebar}
      className="p-2"
    >
      <PanelLeft className="w-4 h-4" />
</Button>
    <div>
      <h1 className="text-base font-semibold text-gray-900">
        {menuItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
      </h1>
      <p className="text-xs text-gray-600">
        Quản lý nhà hàng và đơn hàng của bạn
      </p>
    </div>
  </div>
</header>
//
//
//
//
// src/app.ts
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import session from "express-session";
import routes from "./routes";
import { bigIntJsonMiddleware } from "./middlewares/bigint-json.middleware";

export const createApp = () => {
  const app = express();

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
        "http://localhost:5174",
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
      cookie: { secure: false, httpOnly: true, sameSite: "lax" },
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
