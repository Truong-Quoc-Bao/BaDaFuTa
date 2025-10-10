// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "../server/db.js"; // kết nối database
import restaurantRoutes from "../server/routes/restaurantRoutes.js"; // import router riêng

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check (kiểm tra server + DB)
app.get("/api/health", async (_req, res) => {
  try {
    const r = await pool.query("SELECT NOW() AS db_time");
    res.json({ ok: true, db_time: r.rows[0].db_time });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Các route chính
app.use("/api/restaurants", restaurantRoutes);

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
