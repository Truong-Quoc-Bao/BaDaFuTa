// controllers/restaurantController.js
import { pool } from "../db.js"; // ✅ chỉ import 1 lần

// -------------------------------
// 🔹 GET /api/restaurants?q=keyword
// -------------------------------
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

// -------------------------------
// 🔹 GET /api/restaurants/:id/menu
// -------------------------------
// export const getMenu = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // ⚠️ Kiểm tra bảng thật trong DB
//     // Nếu bảng là merchant thì sửa lại cho đúng, không phải restaurants
//     const merchantRes = await pool.query(
//       "SELECT * FROM merchant WHERE id = $1",
//       [id]
//     );

//     const merchant = merchantRes.rows[0];
//     if (!merchant) {
//       return res.status(404).json({ message: "Không tìm thấy nhà hàng" });
//     }

//     // ⚠️ Kiểm tra tên cột trong bảng menu (id_merchant, merchant_id, hoặc idMerchant)
//     const menuRes = await pool.query(
//       "SELECT * FROM menu WHERE id_merchant = $1",
//       [id]
//     );


//     const menuList = menuRes.rows;

//     res.json({ merchant, menuList });
//   } catch (error) {
//     console.error("Error in getMenu:", error);
//     res.status(500).json({ error: "Lỗi khi lấy menu nhà hàng" });
//   }
// };


const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * GET /api/restaurants/:id/menu
 * :id = merchant.id (UUID)
 * Trả về: { merchant, menu: [{category_id, category_name, items:[...]}] }
 */
export async function getMenu(req, res) {
  try {
    const merchantId = req.params.id;

    // Validate UUID
    if (!UUID_RE.test(merchantId)) {
      return res.status(400).json({ error: "id không phải UUID hợp lệ" });
    }

    // Lấy thông tin merchant (khớp schema)
    const { rows: mRows } = await pool.query(
      `
      SELECT * FROM merchant WHERE id = $1::uuid
      `,
      [merchantId]
    );

    if (mRows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy nhà hàng" });
    }
    const merchant = mRows[0];

    // Gom menu theo category (đúng tên cột trong schema; không dùng sort_order)
    const { rows: menu } = await pool.query(
      `
      SELECT
        c.id AS category_id,
        c.category_name,
        COALESCE(
          json_agg(
            json_build_object(
              'item_id',     mi.id,
              'name_item',   mi.name_item,
              'price',       mi.price,
              'description', mi.description,
              'image_item',  mi.image_item,
              'likes',       mi.likes,
              'sold_count',  mi.sold_count
            )
            ORDER BY mi.name_item ASC
          ) FILTER (WHERE mi.id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM category c
      LEFT JOIN menu_item mi
        ON mi.category_id = c.id
       AND mi.merchant_id = c.merchant_id
       AND mi.status = TRUE
      WHERE c.merchant_id = $1::uuid
      GROUP BY c.id, c.category_name
      ORDER BY c.category_name ASC
      `,
      [merchantId]
    );

    return res.json({ merchant, menu });
  } catch (err) {
    console.error("Error in getMenu:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
// -------------------------------
// 🔹 Not implemented placeholder
// -------------------------------
export async function getMenuByRestaurant(req, res) {
  return res.status(501).json({ error: "Not implemented" });
}
