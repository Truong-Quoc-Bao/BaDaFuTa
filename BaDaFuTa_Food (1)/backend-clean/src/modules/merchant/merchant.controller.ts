// // src/modules/merchant/merchant.controller.ts
// import { Request, Response } from "express";
// import { RestaurantListQuery } from "./merchant.validation";
// import { getRestaurants } from "./merchant.service";

// export const listMerchants = async (req: Request, res: Response) => {
//   try {
//     // Validate “mềm”: nếu query sai -> fallback để không 400
//     const query = RestaurantListQuery.parse(req.query);

//     // Lấy dữ liệu
//     const data = await getRestaurants(query);

//     if (!data) {
//       return res.status(404).json({ error: "Không tìm thấy nhà hàng nào" });
//     }

//     // data có thể là array hoặc { items: [...] } tuỳ service
//     const rows = Array.isArray(data) ? data : (data as any)?.items ?? [];

//     // 🔥 Trả đúng shape FE cũ: THẲNG MẢNG
//     return res.json(rows);
//   } catch (err: any) {
//     console.error("[merchant] listMerchants error:", err?.message || err);
//     // Đừng trả 400 cho lỗi runtime/DB; dùng 500 cho rõ
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

import type { Request, Response } from "express";
import { MerchantListQuery } from "./merchant.validation";
import * as Service from "./merchant.service";

export async function listMerchants(req: Request, res: Response) {
  try {
    const query = MerchantListQuery.parse(req.query);
    const data = await Service.listMerchants(query);

    // Quy ước: danh sách trả 200 + []
    return res.status(200).json(data);
  } catch (err: any) {
    console.error("[merchant] list error:", err?.message || err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
