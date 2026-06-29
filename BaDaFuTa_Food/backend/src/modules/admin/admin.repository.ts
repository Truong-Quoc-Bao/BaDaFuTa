import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminRepository {
  async findAdminByEmail(email: string) {
    if (email === 'admin@badafuta.com') {
      return {
        id: 'admin_123',
        email: 'admin@badafuta.com',
        name: 'Trương Quốc Bảo',
        password: 'admin123',
        role: 'admin',
      };
    }
    return null;
  }

  async countUsersByRole(role: string): Promise<number> {
    if (role === 'customer') {
      return await prisma.users.count({ where: { role: 'customer' } });
    }
    if (role === 'merchant') {
      return await prisma.merchant.count();
    }
    return 0;
  }

  async getRecentActivities() {
    const recentSignups = await prisma.users.findMany({
      where: { role: { in: ['customer', 'merchant'] } },
      orderBy: { created_at: 'desc' },
      take: 5,
    });

    return recentSignups.map((u) => {
      const isPartner = u.role === 'merchant';
      return {
        text: isPartner
          ? `Đối tác nhà hàng "${u.full_name}" đã được đăng ký tài khoản`
          : `Khách hàng "${u.full_name}" vừa đăng ký tài khoản mới`,
        time: u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : 'Gần đây',
        role: u.role || 'customer',
      };
    });
  }

  async getAllUsers() {
    const dbUsers = await prisma.users.findMany({
      where: { role: { in: ['customer', 'merchant'] } },
      orderBy: { created_at: 'desc' },
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

  async getAllPartners() {
    const dbMerchants = await prisma.merchant.findMany({
      include: { users: true },
      orderBy: { id: 'desc' },
    });

    return dbMerchants.map((m) => {
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

  async saveNewPartner(data: any) {
    return await prisma.$transaction(async (tx) => {
      const newUser = await tx.users.create({
        data: {
          full_name: data.ownerName,
          email: data.email,
          password: data.password,
          phone: data.phone,
          role: 'merchant',
          address: data.address,
        },
      });

      const newMerchant = await tx.merchant.create({
        data: {
          user_id: newUser.id,
          merchant_name: data.restaurantName,
          phone: data.phone,
          email: data.email,
          location: { address: data.address } as any,
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

  /**
   * 🔹 [THẬT] Xóa tài khoản đối tác (Xóa User liên kết sẽ tự động Cascade xóa Merchant)
   */
  async deletePartner(id: string) {
    const merchant = await prisma.merchant.findUnique({
      where: { id },
    });

    if (merchant) {
      return await prisma.users.delete({
        where: { id: merchant.user_id },
      });
    }
    throw new Error('Không tìm thấy thông tin đối tác để xóa');
  }

  /**
   * 🔹 [THẬT] Cập nhật thông tin đối tác trong cả 2 bảng: 'merchant' và 'users' (Transaction)
   */
  async updatePartner(id: string, data: any) {
    return await prisma.$transaction(async (tx) => {
      // 1. Cập nhật thông tin gian hàng trong bảng merchant
      const updatedMerchant = await tx.merchant.update({
        where: { id },
        data: {
          merchant_name: data.restaurantName,
          phone: data.phone,
          email: data.email,
          location: { address: data.address } as any,
        } as any,
      });

      // 2. Đồng bộ cập nhật thông tin chủ quán trong bảng users liên kết
      await tx.users.update({
        where: { id: updatedMerchant.user_id },
        data: {
          full_name: data.ownerName,
          email: data.email,
          phone: data.phone,
          address: data.address,
        },
      });

      return updatedMerchant;
    });
  }
}
