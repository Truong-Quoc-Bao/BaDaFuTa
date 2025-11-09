import { prisma } from "@/libs/prisma";
import {
  CreateOrder,
  getOrder,
  updateOrder,
  updateOrderBody,
} from "./order.repository";
import { CreateCODOrderInput, GetOrderInput, UpdateOrder } from "./order.type";

export const orderService = {
  async createCODOrder(data: CreateCODOrderInput) {
    return prisma.$transaction(async (tx) => {
      // Kiểm tra user tồn tại
      const user = await tx.users.findUnique({
        where: { id: data.user_id },
        select: { id: true, phone: true, full_name: true },
      });

      if (!user) {
        throw new Error("User không tồn tại trong hệ thống");
      }

      // Kiểm tra phone có khớp user
      if (user.phone !== data.phone) {
        throw new Error("Số điện thoại không khớp với tài khoản người dùng");
      }

      //Kiểm tra các món thuộc merchant
      const itemIds = data.items.map((i) => i.menu_item_id);
      const itemsFromDB = await tx.menu_item.findMany({
        where: { id: { in: itemIds } },
        select: { id: true, merchant_id: true, name_item: true },
      });

      if (itemsFromDB.length !== itemIds.length) {
        throw new Error("món không tồn tại");
      }

      const invalidItems = itemsFromDB.filter(
        (i) => i.merchant_id !== data.merchant_id
      );
      if (invalidItems.length > 0) {
        throw new Error(
          `Một số món không thuộc merchant này: ${invalidItems
            .map((i) => i.name_item)
            .join(", ")}`
        );
      }

      // Tổng tiền
      const total = BigInt(
        data.items.reduce((sum, i) => sum + i.price * i.quantity, 0) +
          data.delivery_fee
      );

      //Tạo Order
      const order = await CreateOrder.createOrder(tx, {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        full_name: user.full_name ?? "Khách hàng COD",
        phone: user.phone,
        delivery_address: data.delivery_address,
        delivery_fee: BigInt(data.delivery_fee),
        note: data.note ?? null,
        total_amount: total,
        // status: "PENDING",
        status:"DELIVERING",
        status_payment: "PENDING",
      });

      //Tạo order items
      await CreateOrder.createOrderItems(tx, order.id, data.items);

      return order;
    });
  },
};
export const getOrderService = async (args: GetOrderInput) => {
  return getOrder.findMany(args);
};

export const updateOrderService = {
  async updateOrderStatus(orderId: string, data: UpdateOrder, io?: any) {
    const updated = await updateOrderBody.updateStatus(orderId, data);

    if (io) {
      io.emit("order:statusUpdated", {
        orderId,
        ...data,
        userId: updated.user_id,
        merchantId: updated.merchant_id,
      });
    }

    return {
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công!",
      data: updated,
    };
  },
};

export async function updateOrderStatus(orderId: string) {
  return updateOrder.updateStatus(orderId);
}
