import { Request, Response } from 'express';
import * as merchantService from './merchant.service';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const merchantData = await merchantService.login(email, password);
    res.status(200).json({ success: true, data: merchantData });
  } catch (err: any) {
    // THÊM DÒNG LOG NÀY ĐỂ XEM LỖI TRÊN RENDER
    console.error('Login Error:', err.message);

    res.status(401).json({
      success: false,
      message: err.message, // Lỗi này sẽ hiện ở tab Response của trình duyệt
    });
  }
};
