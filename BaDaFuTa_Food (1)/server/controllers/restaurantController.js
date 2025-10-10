// controllers/restaurantController.js
import { pool } from "../db.js"; // ✅ chỉ import 1 lần

// GET /api/restaurants?q=keyword
export async function getRestaurants(req, res) {
  try {
    const { q } = req.query;
    let sql = "SELECT * FROM merchant";
    const params = [];

    if (q && q.trim() !== "") {
      sql += " WHERE merchant_name ILIKE $1 OR (location->>'address') ILIKE $1";
      params.push(`%${q.trim()}%`);
    }

    const { rows } = await pool.query(sql, params);
    res.json(rows); // trả về cả khi rỗng []
  } catch (err) {
    console.error("Error in getRestaurants:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getMenu(req, res) {
  try {
    // decode lại tên nhà hàng từ URL
    const merchantName = decodeURIComponent(req.params.code);

    // Tìm nhà hàng có tên trùng (không phân biệt hoa thường)
    const merchantRes = await pool.query(
      "SELECT * FROM merchant WHERE LOWER(merchant_name) = LOWER($1)",
      [merchantName]
    );

    if (merchantRes.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy nhà hàng" });
    }

    const merchant = merchantRes.rows[0];

    // Lấy danh sách món ăn của nhà hàng đó
    const { rows: menu } = await pool.query(
      "SELECT * FROM menu_item WHERE merchant_id = $1 AND status = TRUE",
      [merchant.id]
    );

    res.json({
      merchant,
      menu,
    });
  } catch (err) {
    console.error("Error in getMenu:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getMenuByRestaurant(req, res) {
  return res.status(501).json({ error: "Not implemented" });
}
