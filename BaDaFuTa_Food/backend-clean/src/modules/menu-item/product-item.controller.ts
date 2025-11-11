import { Request, Response } from "express";
import { getProductItem } from "./product-item.service";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * GET /api/restaurants/:restaurantId/detail/:menuItemId
 * Trả: { restaurant, item } (không bọc success/data)
 */
export const ProductDetail = async (req: Request, res: Response) => {
  try {
    const { restaurantId, menuItemId } = req.params;
    if (!restaurantId || !menuItemId) {
      return res
        .status(400)
        .json({ error: "Thiếu restaurantId hoặc menuItemId" });
    }
    if (!UUID_RE.test(restaurantId) || !UUID_RE.test(menuItemId)) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }

    const result = await getProductItem({
      merchant_id: restaurantId,
      id: menuItemId,
    });

    if ((result as any)?.notFound === "merchant") {
      return res.status(404).json({ error: "Không tìm thấy nhà hàng" });
    }
    if ((result as any)?.notFound === "item") {
      return res.status(404).json({ error: "Không tìm thấy món" });
    }
    if ((result as any)?.notMatch) {
      return res.status(404).json({ error: "Món không thuộc nhà hàng này" });
    }

    // Cache nhẹ để lần sau nhanh
    res.set("Cache-Control", "public, max-age=60");
    return res.json(result); // { restaurant, item }
  } catch (err: any) {
    console.error("[ProductDetail] error:", err?.message || err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};