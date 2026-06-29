import { AdminRepository } from './admin.repository';
import jwt from 'jsonwebtoken';

const adminRepository = new AdminRepository();
const JWT_SECRET = process.env.JWT_SECRET || 'badafuta_secret_key';

export class AdminService {
  // Xử lý xác thực đăng nhập
  async executeLogin(email: string, password: string) {
    const admin = await adminRepository.findAdminByEmail(email);
    if (!admin) {
      throw new Error('Tài khoản admin không tồn tại trên hệ thống');
    }

    // So khớp mật khẩu trực tiếp (hoặc dùng bcrypt.compare)
    const isMatch = password === admin.password;
    if (!isMatch) {
      throw new Error('Mật khẩu đăng nhập không chính xác');
    }

    // Ký JWT Token
    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return {
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    };
  }

  // Thu thập dữ liệu thống kê cho Dashboard
  async retrieveDashboardStats() {
    const totalCustomers = await adminRepository.countUsersByRole('customer');
    const totalPartners = await adminRepository.countUsersByRole('partner');

    return {
      totalCustomers,
      totalPartners,
      activePartners: 72,
      growthRate: '+12%',
      recentActivities: [
        {
          text: 'Khách hàng "Nguyễn Văn A" đăng ký tài khoản mới',
          time: '10 phút trước',
          role: 'customer',
        },
        {
          text: 'Đối tác nhà hàng "Bún Chả Hà Nội" đã được kích hoạt',
          time: '1 giờ trước',
          role: 'partner',
        },
      ],
    };
  }

  // Xử lý thêm đối tác mới
  async executeAddPartner(partnerData: any) {
    return await adminRepository.saveNewPartner(partnerData);
  }
}
