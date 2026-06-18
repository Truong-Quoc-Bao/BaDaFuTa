import { Request, Response } from 'express';
import * as merchantService from './merchant.service';
import { MerchantLoginSchema } from './merchant.validation';

export const login = async (req: Request, res: Response) => {
  try {
    const data = MerchantLoginSchema.parse(req.body);
    const merchant = await merchantService.login(data);

    // Phát JWT riêng cho Merchant
    // const token = jwt.sign({ id: merchant.merchant_id, type: 'MERCHANT' }, process.env.JWT_SECRET!);

    res.status(200).json({
      success: true,
      data: merchant,
      message: 'Đăng nhập Merchant thành công',
    });
  } catch (e: any) {
    res.status(401).json({
      success: false,
      message: e.message || 'Đăng nhập Merchant thất bại',
    });
  }
};
