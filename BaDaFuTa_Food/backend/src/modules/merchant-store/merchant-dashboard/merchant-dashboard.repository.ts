import { prisma } from "@/libs/prisma";
import { order_status } from "@prisma/client";
import { OrderItemDetail, OrderDetail } from "./merchant-dashboard.type";

export const merchantDashboardRepository = {
  /** Lấy merchant_id từ user_id (chủ nhà hàng) */
  async findMerchantByUserId(user_id: string): Promise<string | null> {
    const merchant = await prisma.merchant.findFirst({
      where: { user_id },
      select: { id: true },
    });
    return merchant?.id || null;
  },

  /** 🔹 Lấy thông tin cơ bản của merchant */
  async getMerchantInfo(merchantId: string) {
    return prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        id: true,
        merchant_name: true,
        location: true,
        phone: true,
        cover_image: true,
        time_open: true,
      },
    });
  },

  /** Tổng doanh thu (trừ delivery_fee) */
  async getTotalRevenue(merchantId: string): Promise<number> {
    const orders = await prisma.order.findMany({
      where: {
        merchant_id: merchantId,
        status: "COMPLETED",
        status_payment: "SUCCESS",
      },
      select: {
        total_amount: true,
        delivery_fee: true,
      },
    });

    const revenue = orders.reduce((sum, o) => {
      const total = Number(o.total_amount ?? 0);
      const fee = Number(o.delivery_fee ?? 0);
      return sum + (total - fee);
    }, 0);

    return revenue;
  },

  /** Doanh thu hôm nay (trừ delivery_fee) */
  async getTodayRevenue(merchantId: string, today: Date): Promise<number> {
    const orders = await prisma.order.findMany({
      where: {
        merchant_id: merchantId,
        status: "COMPLETED",
        status_payment: "SUCCESS",
        created_at: { gte: today },
      },
      select: {
        total_amount: true,
        delivery_fee: true,
      },
    });

    return orders.reduce((sum, o) => {
      return sum + (Number(o.total_amount) - Number(o.delivery_fee));
    }, 0);
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
  async getRecentOrders(merchantId: string, limit = 10) {
    const orders = await prisma.order.findMany({
      where: { merchant_id: merchantId },
      orderBy: { created_at: "desc" },
      take: limit,
      include: {
        user: { select: { full_name: true } },
        items: { select: { id: true } },
      },
    });

    return orders.map((o) => ({
      id: o.id,
      user_name: o.user?.full_name || "Khách lạ",
      item_count: o.items.length,
      total_amount: Number(o.total_amount) - Number(o.delivery_fee), // ⭐
      status: o.status,
      payment_method: o.payment_method,
      created_at: o.created_at,
    }));
  },
};
export const merchantOrderRepository = {
  /** Map Prisma order → OrderDetail cho FE */
  mapOrderToDetail(order: any): OrderDetail {
    return {
      id: order.id,
      user_name: order.user?.full_name ?? "Khách lạ",
      user_phone: order.user?.phone ?? "",
      delivery_address: order.delivery_address ?? "",
      note: order.note ?? null,
      total_amount: Number(order.total_amount),
      delivery_fee: Number(order.delivery_fee),
      status: order.status,
      payment_method: order.payment_method,
      created_at: order.created_at,

      items: order.items.map(
        (item: any): OrderItemDetail => ({
          id: item.id,
          name: item.menu_item?.name_item ?? "Unknown",
          price: Number(item.price),
          quantity: Number(item.quantity),
          note: item.note ?? "",
        })
      ),
    };
  },

  /** Core dùng chung cho tất cả trạng thái */
  async getOrdersByStatus(
    merchantId: string,
    status: string
  ): Promise<OrderDetail[]> {
    const orders = await prisma.order.findMany({
      where: {
        merchant_id: merchantId,
        status: status as order_status,
      },
      orderBy: { created_at: "desc" },
      include: {
        user: { select: { full_name: true, phone: true } },
        items: {
          select: {
            id: true,
            price: true,
            quantity: true,
            note: true,
            menu_item: {
              select: {
                name_item: true,
              },
            },
          },
        },
      },
    });

    return orders.map((o) => this.mapOrderToDetail(o));
  },

  /** Các hàm theo trạng thái */
  getPendingOrders(merchantId: string) {
    return this.getOrdersByStatus(merchantId, "PENDING");
  },
  getConfirmedOrders(merchantId: string) {
    return this.getOrdersByStatus(merchantId, "CONFIRMED");
  },
  getPreparingOrders(merchantId: string) {
    return this.getOrdersByStatus(merchantId, "PREPARING");
  },
  getDeliveringOrders(merchantId: string) {
    return this.getOrdersByStatus(merchantId, "DELIVERING");
  },
  getCompletedOrders(merchantId: string) {
    return this.getOrdersByStatus(merchantId, "COMPLETED");
  },
  getCanceledOrders(merchantId: string) {
    return this.getOrdersByStatus(merchantId, "CANCELED");
  },
};
