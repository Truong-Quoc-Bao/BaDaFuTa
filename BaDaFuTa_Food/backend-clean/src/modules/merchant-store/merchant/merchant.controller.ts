import { Request, Response } from 'express';
import * as merchantService from './merchant.service';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await merchantService.login(email, password);
    res.status(200).json({ success: true, data });
  } catch (err: any) {
    // Ghi log để bạn biết tại sao nó ném ra 401
    console.error('Login Error Details:', err.message);

    res.status(401).json({
      success: false,
      message: err.message || 'Đăng nhập thất bại',
    });
  }
};
