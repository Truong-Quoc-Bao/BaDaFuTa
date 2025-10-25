// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "../server/db.js"; // kết nối database
import restaurantRoutes from "../server/routes/restaurantRoutes.js"; // import router riêng
import registerRoutes from "./routes/registerRoutes.js";
import loginRoutes from "./routes/loginCustomerRoutes.js";
import homepageRoutes from "./routes/homepageRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Cấu hình CORS mở rộng để truy cập từ các thiết bị trong cùng Wi-Fi
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Cho phép frontend trên máy tính
      "http://192.168.100.124:5173", // 👈 Cho phép điện thoại truy cập FE (ở nhà)
      "http://172.20.10.3:5173", // đt
      "https://unnibbed-unthrilled-averi.ngrok-free.dev",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(
  session({
    secret: "abc123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // true nếu chạy HTTPS
      httpOnly: true,
      sameSite: "none", // cần cho cross-site cookie khi FE khác domain (ngrok)
    },
  })
);



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
app.use("/api/homepage", homepageRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/login/me", loginRoutes);
app.use("/api/otp", otpRoutes);


// 404 fallback
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Start server
const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));

app.listen(3000, "0.0.0.0", () => console.log("Server running on port 3000"));

