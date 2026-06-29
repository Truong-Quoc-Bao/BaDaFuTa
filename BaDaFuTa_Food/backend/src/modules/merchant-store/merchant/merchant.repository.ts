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
};
