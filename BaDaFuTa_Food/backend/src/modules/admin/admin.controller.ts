import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { AdminValidation } from './admin.validation';

const adminService = new AdminService();

export class AdminController {
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

  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await adminService.retrieveDashboardStats();
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

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

  async getUsers(req: Request, res: Response) {
    try {
      const users = await adminService.retrieveUsers();
      return res.status(200).json({ users });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getPartners(req: Request, res: Response) {
    try {
      const partners = await adminService.retrievePartners();
      return res.status(200).json({ partners });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Xóa đối tác
  async deletePartner(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await adminService.executeDeletePartner(id);
      return res.status(200).json({ message: 'Xóa đối tác thành công' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Cập nhật thông tin đối tác
  async updatePartner(req: Request, res: Response) {
    try {
      const { id } = req.params;
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
