import { Request, Response } from "express";
import { merchantDashboardService } from "./merchant-dashboard.service";
import { MerchantDashboardSchema } from "./merchant-dashboard.validation";

export const merchantDashboardController = {
  async overview(req: Request, res: Response) {
    try {
      // ✅ Validate input
      const parsed = MerchantDashboardSchema.safeParse(req.body);
      if (!parsed.success) {
        const firstError =
          parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
        return res.status(400).json({
          success: false,
          message: firstError,
        });
      }

      const { user_id } = parsed.data;

      // ✅ Gọi service xử lý logic
      const data = await merchantDashboardService.getOverviewByUser(user_id);

      // ✅ Trả về dữ liệu
      return res.status(200).json({
        success: true,
        message: "Lấy dữ liệu dashboard thành công",
        data,
      });
    } catch (err: any) {
      console.error("❌ Dashboard error:", err.message);
      return res.status(500).json({
        success: false,
        message: err.message || "Lỗi server nội bộ",
      });
    }
  },
};
