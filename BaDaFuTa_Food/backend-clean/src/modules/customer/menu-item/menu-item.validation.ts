// import { z } from "zod";

// export const MenuItemListQuery = z.object({
//   take: z.coerce.number().int().positive().max(50).default(20).optional(),
//   name_item: z
//     .string()
//     .trim()
//     .transform((val) => val.replace(/\s+/g, " "))
//     .optional(), // chuẩn hoá tên món thành string
// });

import { z } from "zod";

// "" | null | undefined -> undefined (coi như không gửi)
const emptyToUndef = (v: unknown) =>
  v === "" || v === null || typeof v === "undefined" ? undefined : v;

// chuẩn hóa chuỗi: gọn khoảng trắng
const normalize = (s: string) => s.trim().replace(/\s+/g, " ");

export const MenuItemListQuery = z.object({
  // ✅ mặc định 30, sai kiểu/rỗng cũng về 30 — KHÔNG quăng 400
  take: z
    .preprocess(
      emptyToUndef,
      z.coerce.number().int().min(1).max(100).catch(30) // bạn muốn 30
    )
    .optional(),

  // ví dụ có filter theo tên món
  name_item: z
    .preprocess(emptyToUndef, z.string().transform(normalize))
    .optional(),
});
export type MenuItemListQuery = z.infer<typeof MenuItemListQuery>;
