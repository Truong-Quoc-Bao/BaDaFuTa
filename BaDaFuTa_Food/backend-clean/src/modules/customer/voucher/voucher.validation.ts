import { z } from "zod";

export const GetVoucherSchema = z.object({
  user_id: z.string().uuid({ message: "user_id không hợp lệ" }).optional(),
  merchant_id: z
    .string()
    .uuid({ message: "merchant_id không hợp lệ" })
    .optional(),
});
