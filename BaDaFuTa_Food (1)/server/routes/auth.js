import express from "express";
import User from "../models/User.js"; // model người dùng trong MongoDB
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Tìm user trong database
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // 3️⃣ Tạo JWT token
    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1d" });

    // 4️⃣ Trả về thông tin user (ẩn mật khẩu)
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
