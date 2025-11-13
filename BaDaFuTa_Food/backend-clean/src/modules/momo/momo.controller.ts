// src/modules/momo/momo.controller.ts
import { Request, Response } from "express";
import { momoService } from "./momo.service";

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:5173";

export const momoController = {
  /** 🔹 Khởi tạo thanh toán */
  async create(req: Request, res: Response) {
    try {
      const data = await momoService.initiateMoMo(req.body);
      return res.json(data);
    } catch (err: any) {
      console.error("❌ [MoMo Create Error]:", err);
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  /** 🔹 Callback từ MoMo (IPN) — server → server */
  async callback(req: Request, res: Response) {
    try {
      console.log("📥 [MoMo Callback] body:", req.body);
      const result = await momoService.handleMomoCallback(req.body);
      console.log("📤 [MoMo Callback Parsed]:", result);
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("❌ [MoMo Callback Error]:", err);
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  // ✅ MoMo redirect chuẩn như VNPay
  /** 🔹 Redirect từ MoMo (user → frontend) — LÀM Y HỆT VNPAY */
  async return(req: Request, res: Response) {
    try {
      console.log("🔁 [MoMo Redirect] query:", req.query);

      // Gom đủ tham số (nếu MoMo gửi cả query/body)
      const params = { ...req.query, ...req.body };

      // Lấy kết quả đã chuẩn hoá từ service (phải có order_id & created_at)
      const result = await momoService.handleMomoCallback(params);
      console.log("📤 [MoMo Redirect Parsed]:", result);

      let redirectUrl = "";

      switch (result.status) {
        case "success": {
          const payload = Buffer.from(
            JSON.stringify({
              status: result.status,
              code: result.code,
              order_id: result.order_id, // 👈 UUID thực trong DB
              created_at: result.created_at,
            })
          ).toString("base64");

          redirectUrl = `http://localhost:5173/cart/checkout/ordersuccess?status=success&data=${payload}`;
          break;
        }

        case "canceled":
          redirectUrl = `http://localhost:5173/cart/pending?status=canceled&code=${result.code}`;
          break;

        default:
          redirectUrl = `http://localhost:5173/cart/checkout?status=failed&code=${result.code}`;
          break;
      }

      console.log("➡ Redirecting to:", redirectUrl);
      return res.redirect(redirectUrl);
    } catch (err: any) {
      console.error("❌ [MoMo Redirect Error]:", err);
      const errorRedirect = `http://localhost:5173/cart/checkout/orderfailed?status=error&message=${encodeURIComponent(
        err.message
      )}`;
      console.log("➡ Redirecting to (error):", errorRedirect);
      return res.redirect(errorRedirect);
    }
  },
};
