import { AdminRepository } from './admin.repository';
import jwt from 'jsonwebtoken';

const adminRepository = new AdminRepository();
const JWT_SECRET = process.env.JWT_SECRET || 'badafuta_secret_key';

export class AdminService {
  async executeLogin(email: string, password: string) {
    const admin = await adminRepository.findAdminByEmail(email);
    if (!admin) {
      throw new Error('Tài khoản admin không tồn tại trên hệ thống');
    }

    const isMatch = password === admin.password;
    if (!isMatch) {
      throw new Error('Mật khẩu đăng nhập không chính xác');
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return {
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    };
  }

  async retrieveDashboardStats() {
    const totalCustomers = await adminRepository.countUsersByRole('customer');
    const totalPartners = await adminRepository.countUsersByRole('merchant');
    const recentActivities = await adminRepository.getRecentActivities();

    return {
      totalCustomers,
      totalPartners,
      activePartners: totalPartners,
      growthRate: '+12%',
      recentActivities,
    };
  }

  async executeAddPartner(partnerData: any) {
    return await adminRepository.saveNewPartner(partnerData);
  }

  async retrieveUsers() {
    return await adminRepository.getAllUsers();
  }

  async retrievePartners() {
    return await adminRepository.getAllPartners();
  }
}
