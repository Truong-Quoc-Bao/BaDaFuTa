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

export const register = async (req: Request, res: Response) => {
  try {
    const { restaurantName, ownerName, email, password, phone, cccd, image, address } = req.body;

    // Xác thực đơn giản theo phong cách của bạn
    if (
      !restaurantName ||
      !ownerName ||
      !email ||
      !password ||
      !phone ||
      !cccd ||
      !image ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Vui lòng nhập đầy đủ toàn bộ thông tin đăng ký' });
    }

    if (phone.length < 10) {
      return res
        .status(400)
        .json({ success: false, message: 'Số điện thoại liên hệ phải chứa ít nhất 10 chữ số' });
    }

    if (cccd.length !== 12) {
      return res
        .status(400)
        .json({ success: false, message: 'Số căn cước công dân (CCCD) phải chứa đúng 12 chữ số' });
    }

    // Gọi đến tầng Service thông qua biến đối tượng merchantService
    const result = await merchantService.merchantService.registerMerchant(req.body);

    res.status(201).json({
      success: true,
      message: 'Đăng ký gian hàng thành công! Đang chờ duyệt.',
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
