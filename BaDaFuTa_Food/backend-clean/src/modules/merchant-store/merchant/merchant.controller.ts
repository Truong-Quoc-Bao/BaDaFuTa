import { Request, Response } from 'express';
import * as merchantService from './merchant.service';

export const login = async (req: Request, res: Response) => {
  try {
    // FE đang gửi {email, password}
    const { email, password } = req.body;

    // Gọi service xử lý
    const merchantData = await merchantService.login(email, password);

    // Trả về đúng format mà FE mong đợi: { data: { merchant_id: ... } }
    res.status(200).json({
      success: true,
      data: merchantData,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message || 'Đăng nhập thất bại',
    });
  }
};
