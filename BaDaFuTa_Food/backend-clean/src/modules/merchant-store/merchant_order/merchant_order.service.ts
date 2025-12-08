import { merchantOrderRepository } from "./merchant_order.repository";
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
    if (check.error) {
      return { success: false, message: check.error };
    }

    let updatedOrder = null;

    switch (targetStatus) {
      case "DELIVERING":
        updatedOrder = await merchantOrderRepository.deliveringOrder(orderId);
        break;

      case "CANCELED":
        updatedOrder = await merchantOrderRepository.canceledOrder(orderId);
        break;

      default:
        return {
          success: false,
          message: `Repo không hỗ trợ cập nhật sang trạng thái ${targetStatus}!`,
        };
    }

    return {
      success: true,
      message: `Đã cập nhật đơn hàng sang trạng thái ${targetStatus}!`,
      data: updatedOrder,
    };
  },

  deliveringOrder(orderId: string, userId: string) {
    return this.updateStatus(orderId, userId, "DELIVERING");
  },

  canceledOrder(orderId: string, userId: string) {
    return this.updateStatus(orderId, userId, "CANCELED");
  },
};
