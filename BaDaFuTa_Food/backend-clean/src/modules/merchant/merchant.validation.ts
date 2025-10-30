import { z } from "zod";

export const MerchantListQuery = z.object({
  // số lượng cần lấy, mặc định 20 nhà hàng, tối đa 40 nhà hàng
  take: z.coerce.number().int().positive().max(50).optional().default(30),
  search: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, " "))
    .optional(), // chuẩn hoá tìm kiếm thành string
  category_name: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, " "))
    .optional(), // chuẩn hoá category thành string
  name_item: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, " "))
    .optional(), // chuẩn hoá tên món thành string
  merchant_name: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, " "))
    .optional(), // chuẩn hoá tên nhà hàng thành string
  include: z.coerce.boolean().optional().default(false),
  withMeta: z.coerce.boolean().optional().default(false),
});
