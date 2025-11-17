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
  async return(req: Request, res: Response) {
    try {
      console.log("🔁 [MoMo Redirect] query:", req.query);

      const params = { ...req.query, ...req.body };

      // ⛔ Không gọi verify nữa → gọi luôn handler callback
      const callbackData = await momoService.handleMomoCallback(params);
      console.log("📦 Callback full data:", callbackData);

      // ❌ THẤT BẠI
      if (!callbackData || callbackData.status !== "success") {
        return res.redirect(
          `${process.env.FRONTEND_URL || "http://localhost:5173"}/cart/checkout`
        );
      }

      // Encode base64 full order JSON
      const base64 = Buffer.from(JSON.stringify(callbackData)).toString(
        "base64"
      );

      return res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/cart/checkout/ordersuccess?status=success&data=${base64}`
      );
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
