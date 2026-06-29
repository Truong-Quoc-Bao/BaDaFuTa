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

  // Lấy danh sách người dùng thực tế
  async getUsers(req: Request, res: Response) {
    try {
      const users = await adminService.retrieveUsers();
      return res.status(200).json({ users });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Lấy danh sách đối tác/nhà hàng thực tế
  async getPartners(req: Request, res: Response) {
    try {
      const partners = await adminService.retrievePartners();
      return res.status(200).json({ partners });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // 🔹 Xóa đối tác (Đã cập nhật ép kiểu 'as string' ở dòng 63)
  async deletePartner(req: Request, res: Response) {
    try {
      const id = req.params.id as string; // <-- Ép kiểu rõ ràng thành 'as string' để sửa lỗi TS2345
      await adminService.executeDeletePartner(id);
      return res.status(200).json({ message: 'Xóa đối tác thành công' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // 🔹 Cập nhật thông tin đối tác (Đã cập nhật ép kiểu 'as string' ở dòng 74)
  async updatePartner(req: Request, res: Response) {
    try {
      const id = req.params.id as string; // <-- Ép kiểu rõ ràng thành 'as string' để sửa lỗi TS2345
      const updated = await adminService.executeUpdatePartner(id, req.body);
      return res.status(200).json({
        message: 'Cập nhật đối tác thành công',
        partner: updated,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
