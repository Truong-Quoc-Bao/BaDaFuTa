import bcrypt from "bcryptjs";
import { pool } from "../db.js";

// Controller cho đăng ký user
export const registerUser = async (req, res) => {
  try {
    const { full_name, phone, email, password } = req.body;

    if (!full_name || !phone || !email || !password) {
      return res.status(400).json({ success: false, error: "Thiếu dữ liệu" });
    }

    // Kiểm tra email đã tồn tại
    const emailCheck = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (emailCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "Email đã tồn tại" });
        
    }
    
    //Kiểm tra sdt
    const sdt = false;
      
    const sdtCheck = await pool.query("SELECT * FROM users WHERE phone=$1", [
      phone,
    ]);
    if (sdtCheck.rows.length > 0) {
      return res
          .status(400)
          
        .json({ success: false, error: "Số điện thoại đã được đăng ký.", sdt : true});
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      "INSERT INTO users (full_name, phone, email, password) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email",
      [full_name, phone, email, hashedPassword]
    );

    res.json({ success: true, user: result.rows[0], sdt:false });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Lỗi server" });
  }
};
