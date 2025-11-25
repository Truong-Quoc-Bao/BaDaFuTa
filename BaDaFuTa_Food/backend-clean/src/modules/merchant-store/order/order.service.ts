import { merchantOrderRepository } from "./order.repository";
import { order_status } from "@prisma/client";

export const merchantOrderService = {
  async validation(orderId: string, userId: string) {
    const merchantId = await merchantOrderRepository.findMerchantByUserId(
      userId
    );

    if (!merchantId) {
      return { error: "Merchant không tồn tại!" };
    }

    const order = await merchantOrderRepository.findOrderById(orderId);

    if (!order) {
      return { error: "Đơn hàng không tồn tại!" };
    }
    if (order.merchant_id !== merchantId) {
      return { error: "Bạn không có quyền xử lý đơn hàng này!" };
    }

    return { order, merchantId };
  },

  async updateStatus(
    orderId: string,
    userId: string,
    targetStatus: order_status
  ) {
    const check = await this.validation(orderId, userId);

    if (!check.order) {
      return { success: false, message: "Đơn hàng không tồn tại!" };
    }

    const order = check.order;

    if (!order.status) {
      return {
        success: false,
        message: "Đơn hàng chưa có trạng thái hợp lệ!",
      };
    }

    const currentStatus = order.status as order_status;

    const validFlow: Record<order_status, order_status[]> = {
      PENDING: ["CONFIRMED"],
      CONFIRMED: ["PREPARING"],
      PREPARING: ["DELIVERING"],
      DELIVERING: ["COMPLETED"],
      COMPLETED: [],
      CANCELED: [],
    };

    // Kiểm tra flow có hợp lệ không
    const allowedStatuses = validFlow[currentStatus];

    if (!allowedStatuses.includes(targetStatus)) {
      return {
        success: false,
        message: `Không thể chuyển trạng thái từ ${currentStatus} → ${targetStatus}!`,
      };
    }

    // Gọi repo update theo đúng targetStatus
    let updated = null;

    switch (targetStatus) {
      case "CONFIRMED":
        updated = await merchantOrderRepository.confirmedOrder(orderId);
        break;

      case "PREPARING":
        updated = await merchantOrderRepository.preparingOrder(orderId);
        break;

      case "DELIVERING":
        updated = await merchantOrderRepository.deliveringOrder(orderId);
        break;

      case "CANCELED":
        updated = await merchantOrderRepository.canceledOrder(orderId);
        break;

      default:
        return { success: false, message: "Trạng thái không hợp lệ!" };
    }

    return {
      success: true,
      message: `Đơn hàng đã chuyển sang trạng thái ${targetStatus}!`,
      data: updated,
    };
  },

  acceptOrder(orderId: string, userId: string) {
    return this.updateStatus(orderId, userId, "CONFIRMED");
  },

  preparingOrder(orderId: string, userId: string) {
    return this.updateStatus(orderId, userId, "PREPARING");
  },

  deliveringOrder(orderId: string, userId: string) {
    return this.updateStatus(orderId, userId, "DELIVERING");
  },

  canceledOrder(orderId: string, userId: string) {
    return this.updateStatus(orderId, userId, "CANCELED");
  },
};
