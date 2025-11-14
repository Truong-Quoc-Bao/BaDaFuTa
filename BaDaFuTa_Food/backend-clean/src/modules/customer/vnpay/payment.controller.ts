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
  async callback(req: Request, res: Response) {
    try {
      const result = await paymentService.handleVnpayCallback(req.query);

      if (result.status === "success") {
        // ✅ Redirect về trang thông báo thành công
        return res.redirect(
          `http://localhost:5173/cart/checkout/ordersuccess?status=success&code=${result.code}`
        );
      } else {
        // ❌ Redirect về trang thất bại
        return res.redirect(
          `http://localhost:5173/cart/checkout/orderfailed?status=failed&code=${result.code}`
        );
      }
    } catch (err: any) {
      console.error("callback error:", err);
      // ⚠️ Redirect về trang lỗi chung
      return res.redirect(
        `http://localhost:5173/cart/checkout/orderfailed?status=error&message=${encodeURIComponent(
          err.message
        )}`
      );
    }
  },

  // async callback(req: Request, res: Response) {
  //   console.log("📥 VNPay callback query full:", req.query);

  //   try {
  //     // Gọi service xử lý hash + DB
  //     const result = await paymentService.handleVnpayCallback(req.query);
  //     console.log("📤 Parsed result từ service:", result);

  //     // Debug: log URL redirect
  //     let redirectUrl = "";

  //     switch (result.status) {
  //       case "success":
  //         // ✅ Tạo payload có đủ thông tin
  //         const payload = Buffer.from(
  //           JSON.stringify({
  //             status: result.status,
  //             code: result.code,
  //             order_id: result.order_id,
  //             created_at: result.created_at,
  //           })
  //         ).toString("base64");

  //         // ✅ Redirect về FE trang success (giữ đúng format mẹ yêu cầu)
  //         redirectUrl = `http://localhost:5173/cart/checkout/ordersuccess?status=success&data=${payload}`;
  //         break;

  //       case "canceled":
  //         redirectUrl = `http://localhost:5173/cart/pending?status=canceled&code=${result.code}`;
  //         break;

  //       default:
  //         redirectUrl = `http://localhost:5173/cart/checkout/orderfailed?status=failed&code=${result.code}`;
  //         break;
  //     }

  //     console.log("➡ Redirecting to:", redirectUrl);
  //     return res.redirect(redirectUrl);
  //   } catch (err: any) {
  //     console.error("❌ callback error:", err);

  //     // Nếu có lỗi → redirect về trang thất bại
  //     const errorRedirect = `http://localhost:5173/cart/checkout/orderfailed?status=error&message=${encodeURIComponent(
  //       err.message
  //     )}`;

  //     console.log("➡ Redirecting to (error):", errorRedirect);
  //     return res.redirect(errorRedirect);
  //   }
  // },
};