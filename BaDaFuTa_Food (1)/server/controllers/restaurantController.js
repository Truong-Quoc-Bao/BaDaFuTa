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
    const merchantName = decodeURIComponent(req.params.code);

    // Lấy nhà hàng theo tên
    const merchantRes = await pool.query(
      "SELECT * FROM merchant WHERE LOWER(merchant_name) = LOWER($1)",
      [merchantName]
    );

    if (merchantRes.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy nhà hàng" });
    }

    const merchant = merchantRes.rows[0];

    // Lấy menu theo danh mục
    const { rows: menu } = await pool.query(
      `
      SELECT c.id AS category_id,
             c.category_name,
             COALESCE(
               json_agg(
                 json_build_object(
                   'item_id', m.id,
                   'name_item', m.name_item,
                   'price', m.price,
                   'description', m.description,
                   'image_item', m.image_item
                 )
               ) FILTER (WHERE m.id IS NOT NULL),
               '[]'::json
             ) AS items
      FROM category c
      LEFT JOIN menu_item m
        ON c.id = m.category_id AND m.status = TRUE
      WHERE c.merchant_id = $1
      GROUP BY c.id, c.category_name
      ORDER BY c.category_name
    `,
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
