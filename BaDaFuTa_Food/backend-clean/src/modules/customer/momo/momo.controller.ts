// import { Request, Response } from "express";
// import { momoService } from "./momo.service";

// export const momoController = {
//   /** 🔹 Khởi tạo thanh toán MoMo */
//   async initiate(req: Request, res: Response) {
//     try {
//       const result = await momoService.initiateMoMo(req.body);
//       return res.json(result);
//     } catch (err: any) {
//       console.error("initiateMoMo error:", err);
//       return res.status(400).json({ success: false, message: err.message });
//     }
//   },

//   /** 🔹 Xử lý callback từ MoMo */
//   async callback(req: Request, res: Response) {
//     try {
//       const result = await momoService.handleMomoCallback(req.query);

//       if (result.status === "SUCCESS") {
//         return res.redirect(
//           `http://localhost:5173/cart/checkout/ordersuccess?status=success&code=${result.code}`
//         );
//       } else {
//         return res.redirect(
//           `http://localhost:5173/cart/checkout/orderfailed?status=failed&code=${result.code}`
//         );
//       }
//     } catch (err: any) {
//       console.error("callback error:", err);
//       return res.redirect(
//         `http://localhost:5173/cart/checkout/orderfailed?status=error&message=${encodeURIComponent(
//           err.message
//         )}`
//       );
//     }
//   },
// };

// momo.controller.ts (TypeScript, Express)
import { Request, Response } from "express";
import { momoService } from "./momo.service";

export const momoController = {
  // Called by FE to create payment
  async initiate(req: Request, res: Response) {
    try {
      const body = req.body;
      const result = await momoService.initiateMoMo(body);
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("momo initiate error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // IPN: MoMo server calls this via POST (must be POST)
  async callback(req: Request, res: Response) {
    try {
      console.log("🔔 [MoMo IPN RECEIVED] body:", req.body);

      // call service handler (it will update DB)
      const result = await momoService.handleMomoCallback(req.body);
      console.log("✅ [MoMo IPN HANDLED] result:", result);

      // Must return 200 + success body so MoMo won't retry
      return res.status(200).json({ message: "success" });
    } catch (err) {
      console.error("❌ [MoMo IPN ERROR]:", err);
      // still return 500 so MoMo may retry and you can see logs
      return res.status(500).json({ message: "error" });
    }
  },

  // Optional: handle redirect (user browser). Verify server-side then redirect FE.
  async return(req: Request, res: Response) {
    try {
      console.log("🔁 [MoMo Redirect] query:", req.query);
      const params = { ...req.query, ...req.body };
      // verify using DB or MoMo query API
      const verified = await momoService.verifyMomoTransaction(params);
      if (verified && verified.success) {
        return res.redirect(
          `${
            process.env.FRONTEND_URL || "http://localhost:5173"
          }/cart/checkout/ordersuccess?orderId=${verified.orderId}`
        );
      } else {
        return res.redirect(
          `${
            process.env.FRONTEND_URL || "http://localhost:5173"
          }/cart/checkout`
        );
      }
    } catch (err) {
      console.error("❌ [MoMo Redirect Error]:", err);
      return res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/cart/checkout/orderfailed`
      );
    }
  },
};
