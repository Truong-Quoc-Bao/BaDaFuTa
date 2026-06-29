import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminRepository {
  /**
   * 🔹 [MOCK] Đăng nhập Admin (Do chưa cấu hình bảng Admin trong DB)
   */
  async findAdminByEmail(email: string) {
    // Giả lập tài khoản Admin trực tiếp bằng code
    if (email === 'admin@badafuta.com') {
      return {
        id: 'admin_123',
        email: 'admin@badafuta.com',
        name: 'Trần Quốc Bảo',
        password: 'admin123', // Mật khẩu kiểm tra nhanh
        role: 'admin',
      };
    }
    return null;
  }

  /**
   * 🔹 [THẬT] Đếm số lượng Khách hàng & Đối tác từ Database
   */
  async countUsersByRole(role: string): Promise<number> {
    if (role === 'customer') {
      // Đếm số lượng khách hàng thật trong bảng users
      return await prisma.users.count({
        where: {
          role: 'customer',
        },
      });
    }

    if (role === 'partner') {
      // Đếm số lượng nhà hàng thật trong bảng merchant
      return await prisma.merchant.count();
    }

    return 0;
  }

  /**
   * 🔹 [THẬT] Lấy danh sách hoạt động gần đây từ lượt đăng ký thật trong bảng Users
   */
  async getRecentActivities() {
    const recentSignups = await prisma.users.findMany({
      where: {
        role: {
          in: ['customer', 'partner'], // Chỉ lấy khách hàng hoặc đối tác
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 5, // Lấy ra tối đa 5 lượt đăng ký mới nhất
    });

    return recentSignups.map((u) => {
      const isPartner = u.role === 'partner';
      return {
        text: isPartner
          ? `Đối tác nhà hàng "${u.full_name}" đã được đăng ký tài khoản`
          : `Khách hàng "${u.full_name}" vừa đăng ký tài khoản mới`,
        time: u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : 'Gần đây',
        role: u.role || 'customer',
      };
    });
  }

  /**
   * 🔹 [THẬT] Lấy danh sách toàn bộ Users (Khách hàng & Đối tác) từ bảng 'users'
   */
  async getAllUsers() {
    const dbUsers = await prisma.users.findMany({
      where: {
        role: {
          in: ['customer', 'partner'], // Lọc lấy khách hàng và đối tác thật trong DB
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return dbUsers.map((user) => ({
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role || 'customer',
      joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A',
      status: 'Hoạt động',
    }));
  }

  /**
   * 🔹 [THẬT] Lấy danh sách các đối tác từ bảng 'merchant' (kèm join bảng 'users' để lấy thông tin chủ quán)
   */
  async getAllPartners() {
    const dbMerchants = await prisma.merchant.findMany({
      include: {
        users: true, // Join khóa ngoại fk_merchant_user
      },
      orderBy: {
        id: 'desc',
      },
    });

    return dbMerchants.map((m) => {
      // Đọc địa chỉ được cấu hình dưới dạng Json trong database
      let addressString = m.description || 'N/A';
      if (m.location && typeof m.location === 'object') {
        const loc = m.location as Record<string, any>;
        if (loc.address) {
          addressString = loc.address;
        }
      }

      return {
        id: m.id,
        name: m.merchant_name,
        owner: m.users?.full_name || 'N/A',
        phone: m.phone || 'N/A',
        address: addressString,
        status: 'Active',
      };
    });
  }

  /**
   * 🔹 [THẬT] Lưu thông tin tài khoản đối tác & cửa hàng mới vào Database (Transaction)
   */
  async saveNewPartner(data: any) {
    return await prisma.$transaction(async (tx) => {
      // 1. Tạo tài khoản trong bảng users (gán role là 'partner')
      const newUser = await tx.users.create({
        data: {
          full_name: data.ownerName,
          email: data.email,
          password: data.password, // Mật khẩu đã được mã hóa ở tầng Service
          phone: data.phone,
          role: 'partner',
          address: data.address,
        },
      });

      // 2. Tạo gian hàng đối tác tương ứng trong bảng merchant sử dụng cấu trúc phẳng (Unchecked)
      // Ép kiểu 'as any' cho toàn bộ object data để giải quyết dứt điểm lỗi TypeScript ts(2322)
      const newMerchant = await tx.merchant.create({
        data: {
          user_id: newUser.id, // Truyền trực tiếp ID vừa tạo vào khóa ngoại user_id
          merchant_name: data.restaurantName,
          phone: data.phone,
          email: data.email,
          location: { address: data.address } as any, // Định dạng Json chuẩn hóa an toàn
        } as any,
      });

      return {
        id: newMerchant.id,
        restaurantName: newMerchant.merchant_name,
        ownerName: newUser.full_name,
        email: newMerchant.email,
      };
    });
  }
}
