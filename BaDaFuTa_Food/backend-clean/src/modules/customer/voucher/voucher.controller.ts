import { Request, Response } from "express";
import { voucherService } from "./voucher.service";
import { GetVoucherSchema } from "./voucher.validation";

export const getAllVouchers = async (req: Request, res: Response) => {
  try {
    const data = GetVoucherSchema.parse(req.query);

    const result = await voucherService.getAll(data.user_id, data.merchant_id);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("voucher error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
