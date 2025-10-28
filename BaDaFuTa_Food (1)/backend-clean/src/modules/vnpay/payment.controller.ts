import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import { CreateCODOrderSchema } from "../order/order.validation";

export const paymentController = {
  /** 🔹 Khởi tạo thanh toán VNPAY (tạo order + transaction + link) */
  async initiate(req: Request, res: Response) {
    try {
      const parsed = CreateCODOrderSchema.parse(req.body);

      if (parsed.payment_method !== "VNPAY") {
        return res.status(400).json({
          success: false,
          message: "Phương thức thanh toán không hợp lệ (phải là VNPAY)",
        });
      }

      const payment = await paymentService.initiateVNPAY(parsed);

      return res.json({
        success: true,
        message: "Khởi tạo thanh toán VNPAY thành công",
        payment_url: payment.payment_url,
        order_id: payment.order_id,
      });
    } catch (err: any) {
      console.error("initiatePayment error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Không thể khởi tạo thanh toán",
      });
    }
  },

  /** 🔹 Xử lý callback từ VNPAY */
  async callback(req: Request, res: Response) {
    try {
      const result = await paymentService.handleVnpayCallback(req.query);

      if (result.status === "success") {
        return res.json({
          success: true,
          message: "Thanh toán thành công",
          code: result.code,
          order_status: "completed",
          payment_status: "paid",
        });
      } else {
        return res.json({
          success: false,
          message: "Thanh toán thất bại hoặc bị hủy",
          code: result.code,
          order_status: "cancelled",
          payment_status: "unpaid",
        });
      }
    } catch (err: any) {
      console.error("callback error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Lỗi xử lý callback VNPAY",
      });
    }
  },
};
