import { z } from "zod";

export const orderStatusSchema = z.object({
  user_id: z.string().min(1, "Thiếu user_id!"),
  order_id: z.string().min(1, "Thiếu order_id!"),
  action: z.enum(["CONFIRMED", "PREPARING", "DELIVERING", "CANCELED"]),
});
