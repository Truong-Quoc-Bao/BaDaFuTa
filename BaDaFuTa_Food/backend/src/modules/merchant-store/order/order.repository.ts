import { prisma } from "@/libs/prisma";

export const merchantOrderRepository = {
  /** Lấy merchant_id từ user_id */
  async findMerchantByUserId(user_id: string): Promise<string | null> {
    const merchant = await prisma.merchant.findFirst({
      where: { user_id },
      select: { id: true },
    });
    return merchant?.id ?? null;
  },

  /** Lấy danh sách order thuộc merchant */
  async findOrdersOfMerchant(merchant_id: string) {
    return prisma.order.findMany({
      where: { merchant_id },
      select: { id: true },
    });
  },

  /** Lấy 1 order để kiểm tra quyền */
  async findOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      select: { merchant_id: true, status: true },
    });
  },

  /** Xác nhận 1 order */
  async confirmedOrder(orderId: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: "CONFIRMED" },
    });
  },
  async preparingOrder(orderId: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: "PREPARING" },
    });
  },
  async deliveringOrder(orderId: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: "DELIVERING" },
    });
  },
  async canceledOrder(orderId: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELED" },
    });
  },
};
