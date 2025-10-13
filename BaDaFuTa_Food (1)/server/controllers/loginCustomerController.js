import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginCustomer(req, res) {
  const { identifier, password } = req.body;

  // Kiểm tra đầu vào
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ error: "Vui lòng nhập đủ email/sdt và mật khẩu" });
  }

  try {
    // Tìm user bằng email hoặc phone
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $1 LIMIT 1",
      [identifier]
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Sai email/số điện thoại hoặc mật khẩu" });
    }

    const user = result.rows[0];

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Sai email/số điện thoại hoặc mật khẩu" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secret_key", // 🔹 bạn có thể đổi sang process.env.JWT_SECRET sau
      { expiresIn: "7d" }
    );

    // Trả kết quả
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
}
