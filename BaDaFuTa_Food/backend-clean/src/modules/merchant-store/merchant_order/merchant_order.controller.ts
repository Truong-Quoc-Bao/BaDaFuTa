import { Request, Response } from "express";
import { merchantOrderService } from "./merchant_order.service";
import { orderStatusSchema } from "./merchant_order.validation";

export const merchantOrderController = {
  async updateStatus(req: Request, res: Response) {
    try {
      const data = orderStatusSchema.parse(req.body);
      const result = await merchantOrderService.updateStatus(
        data.order_id,
        data.user_id,
        data.action
      );

      return res.json(result);
    } catch (err) {
      console.error("updateStatus error:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi server!",
      });
    }
  },
};
