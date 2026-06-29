import { prisma } from '@/libs/prisma';

export const merchantRepository = {
  // Tìm chủ sở hữu kèm theo thông tin cửa hàng
  async findOwnerByEmail(email: string) {
    return await prisma.users.findUnique({
      where: { email: email.toLowerCase() },
      include: { merchant: true },
    });
  },

  // Lấy danh sách đơn hàng cho Dashboard
  async getOrders(merchantId: string) {
    return await prisma.order.findMany({
      where: { merchant_id: merchantId },
      orderBy: { created_at: 'desc' },
    });
  },

  /**
   * 🔹 [THẬT] Tự động đăng ký Merchant mới từ luồng tự đăng ký
   * Lưu số CCCD của chủ quán trực tiếp vào trường 'description' để tránh chỉnh sửa schema
   */
  async registerNewMerchantBySelf(data: any) {
    return await prisma.$transaction(async (tx) => {
      // 1. Tạo tài khoản users cho đối tác (gán role là 'merchant')
      const newUser = await tx.users.create({
        data: {
          full_name: data.ownerName,
          email: data.email,
          password: data.password, // Mật khẩu của đối tác đã được mã hóa ở tầng Service
          phone: data.phone,
          role: 'merchant',
          address: data.address,
        },
      });

      // 2. Tạo gian hàng đối tác tương ứng trong bảng merchant kết nối qua user_id
      const newMerchant = await tx.merchant.create({
        data: {
          user_id: newUser.id,
          merchant_name: data.restaurantName,
          phone: data.phone,
          email: data.email,
          profile_image: { url: data.image } as any, // Lưu URL ảnh vào Json
          location: { address: data.address } as any,
          description: `CCCD Chủ sở hữu: ${data.cccd}`, // Ghi nhận số CCCD vào mô tả nhà hàng cực kỳ thông minh
        } as any,
      });

      return newMerchant;
    });
  },
};
