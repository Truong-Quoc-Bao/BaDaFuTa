import { prisma } from "@/libs/prisma";
import { MerchantOverviewResponse } from "./merchant-dashboard.type";

export const merchantDashboardRepository = {
  /** Lấy merchant_id từ user_id (chủ nhà hàng) */
  async findMerchantByUserId(user_id: string): Promise<string | null> {
    const merchant = await prisma.merchant.findFirst({
      where: { user_id },
      select: { id: true },
    });
    return merchant?.id || null;
  },

  /** Tổng doanh thu */
  async getTotalRevenue(merchantId: string): Promise<number> {
    const res = await prisma.order.aggregate({
      _sum: { total_amount: true },
      where: {
        merchant_id: merchantId,
        status: "COMPLETED",
        status_payment: "SUCCESS",
      },
    });

    // Vì total_amount là BigInt trong DB → cần ép về number
    const value = res._sum.total_amount ? Number(res._sum.total_amount) : 0;
    return value;
  },

  /** Doanh thu hôm nay */
  async getTodayRevenue(merchantId: string, today: Date): Promise<number> {
    const res = await prisma.order.aggregate({
      _sum: { total_amount: true },
      where: {
        merchant_id: merchantId,
        status: "COMPLETED",
        status_payment: "SUCCESS",
        created_at: { gte: today },
      },
    });

    return res._sum.total_amount ? Number(res._sum.total_amount) : 0;
  },

  /** Số đơn hôm nay */
  async countTodayOrders(merchantId: string, today: Date): Promise<number> {
    return prisma.order.count({
      where: {
        merchant_id: merchantId,
        created_at: { gte: today },
      },
    });
  },

  /** Đơn chờ xử lý */
  async countPendingOrders(merchantId: string): Promise<number> {
    return prisma.order.count({
      where: {
        merchant_id: merchantId,
        status: "PENDING",
      },
    });
  },

  /** Tổng số khách hàng duy nhất */
  async countUniqueCustomers(merchantId: string): Promise<number> {
    const res = await prisma.order.groupBy({
      by: ["user_id"],
      where: { merchant_id: merchantId },
    });
    return res.length;
  },

  /** Đơn hàng gần đây (5 đơn mới nhất) */
  async getRecentOrders(merchantId: string, limit = 5) {
    const orders = await prisma.order.findMany({
      where: { merchant_id: merchantId },
      orderBy: { created_at: "desc" },
      take: limit,
      include: {
        user: { select: { full_name: true } },
        items: { select: { id: true } }, // field trong model là "items"
      },
    });

    return orders.map((o) => ({
      id: o.id,
      user_name: o.user?.full_name || "Khách lạ",
      item_count: o.items.length,
      total_amount: Number(o.total_amount),
      status: o.status,
      payment_method: o.payment_method,
      created_at: o.created_at,
    }));
  },
};
