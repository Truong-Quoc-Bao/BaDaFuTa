// src/modules/menu-item/menu-item.controller.ts
import { Request, Response } from "express";
import { MenuItemListQuery } from "./menu-item.validation";
import { getMenuItem } from "./menu-item.service";

export const listMenu = async (req: Request, res: Response) => {
  try {
    // 1) Lấy id nhà hàng từ URL
    const { restaurantId } = req.params;
    if (!restaurantId) {
      return res
        .status(400)
        .json({ error: "restaurantId is required in path" });
    }

    // 2) Validate & chuẩn hoá query (take, name_item, ...)
    const query = MenuItemListQuery.parse(req.query);

    // 3) Gọi service
    const data = await getMenuItem({
      merchant_id: restaurantId,
      ...query,
    });

    if (!data) {
      return res.status(404).json({ error: "Không tìm thấy nhà hàng" });
    }

    // 4) Trả đúng **shape backend cũ**: { merchant, menu }
    //    (không bọc success/data)
    return res.json({
      merchant: data.merchant,
      menu: data.menu,
      // (tuỳ chọn) tương thích thêm:
      // categories: data.menu, // nếu FE nào đọc categories
    });
  } catch (err: any) {
    console.error("[menu_item] listMenu error:", err?.message || err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
