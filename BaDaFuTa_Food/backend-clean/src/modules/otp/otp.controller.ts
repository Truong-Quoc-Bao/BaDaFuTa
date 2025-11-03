import { otpService } from "./otp.service";
import { Request, Response } from "express";

export const otpController = {
  async sendOtp(req: Request, res: Response) {
    const { phone } = req.body;

    try {
      const result = await otpService.sendOtp(phone);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async verifyOtp(req: Request, res: Response) {
    const { phone, otp } = req.body;

    try {
      const result = await otpService.verifyOtp(phone, otp);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },
};
