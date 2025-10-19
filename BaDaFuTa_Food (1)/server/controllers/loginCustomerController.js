import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// ====================== Đăng nhập ======================
export async function loginCustomer(req, res) {
  
  const { identifier, password } = req.body;

  // Kiểm tra đầu vào
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ error: "Vui lòng nhập đủ email/sđt và mật khẩu" });
  }

  try {
    // Tìm user bằng email hoặc số điện thoại
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $1 LIMIT 1",
      [identifier]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Email hoặc số điện thoại không tồn tại" });
    }

    const user = result.rows[0];

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mật khẩu không chính xác" });
    }

    // ✅ Tạo token sau khi xác thực xong
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "7d" }
    );

    // ✅ Trả về phản hồi cho FE **sau khi xác thực xong**
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


// ====================== LẤY THÔNG TIN USER ======================
export async function getUserInfo(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Thiếu token xác thực" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token không hợp lệ" });
    }

    // ✅ Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");

    // 📥 Lấy thông tin người dùng từ DB
    const result = await pool.query(
      "SELECT id, full_name, email, phone, role FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error);
    res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn" });
  }
}