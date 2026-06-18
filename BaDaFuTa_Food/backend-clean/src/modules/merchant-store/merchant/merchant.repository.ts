import { prisma } from '@/libs/prisma';

export const findMerchantByEmail = async (email: string) => {
  return await prisma.users.findFirst({
    where: {
      email: email,
      role: 'merchant', // Chỉ tìm user có role là merchant
    },
    include: { merchant: true }, // Lấy thông tin cửa hàng đi kèm
  });
};
