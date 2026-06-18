import { Request, Response } from 'express';
import * as merchantService from './merchant.service';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await merchantService.merchantService.login(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
};
