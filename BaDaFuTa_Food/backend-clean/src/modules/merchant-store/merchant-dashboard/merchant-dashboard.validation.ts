import { z } from "zod";

export const MerchantDashboardSchema = z.object({
  user_id: z.string().uuid("user_id phải là UUID hợp lệ"),
});
