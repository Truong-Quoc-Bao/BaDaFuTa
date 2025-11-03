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

  // /** 🔹 Xử lý callback từ VNPAY */
  // async callback(req: Request, res: Response) {
  //   console.log("📥 VNPay callback query full:", req.query);

  //   // console.log("📥 VNPay callback query:", req.query);

  //   try {
  //     const result = await paymentService.handleVnpayCallback(req.query);
  //     console.log("📤 Parsed result:", result);

     
  //     if (result.status === "success") {
  //       return res.redirect(
  //         `http://localhost:5173/cart/checkout?status=success&code=${result.code}`
  //       );
  //     } else if (result.status === "canceled") {
  //       return res.redirect(
  //         `http://localhost:5173/cart/pending?status=canceled&code=${result.code}`
  //       );
  //     } else {
  //       return res.redirect(
  //         `http://localhost:5173/cart/checkout?status=failed&code=${result.code}`
  //       );
  //     }



  //   } catch (err: any) {
  //     console.error("callback error:", err);
  //     return res.redirect(
  //       `http://localhost:5173/cart/checkout/orderfailed?status=error&message=${encodeURIComponent(
  //         err.message
  //       )}`
  //     );
  //   }


/** 🔹 Xử lý callback từ VNPAY (debug & fix huỷ) */
async callback(req: Request, res: Response) {
  console.log("📥 VNPay callback query full:", req.query);

  try {
    const result = await paymentService.handleVnpayCallback(req.query);
    console.log("📤 Parsed result:", result);

    // Debug: log URL redirect
    let redirectUrl = "";

    switch (result.status) {
      case "success":
        redirectUrl = `http://localhost:5173/cart/checkout?status=success&code=${result.code}`;
        break;

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
    console.error("callback error:", err);
    const errorRedirect = `http://localhost:5173/cart/checkout/orderfailed?status=error&message=${encodeURIComponent(
      err.message
    )}`;
    console.log("➡ Redirecting to (error):", errorRedirect);
    return res.redirect(errorRedirect);
  }

  },
};
