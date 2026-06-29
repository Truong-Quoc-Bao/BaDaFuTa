import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { AdminValidation } from './admin.validation';

const adminService = new AdminService();

export class AdminController {
  // Đăng nhập Admin
  async login(req: Request, res: Response) {
    try {
      AdminValidation.validateLogin(req.body);
      const { email, password } = req.body;
      const result = await adminService.executeLogin(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Lấy thống kê
  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await adminService.retrieveDashboardStats();
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Thêm đối tác mới
  async addPartner(req: Request, res: Response) {
    try {
      AdminValidation.validateCreatePartner(req.body);
      const newPartner = await adminService.executeAddPartner(req.body);
      return res.status(201).json({
        message: 'Tạo tài khoản đối tác thành công',
        partner: newPartner,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
