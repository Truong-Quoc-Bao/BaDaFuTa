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
      // 1️⃣ Kiểm tra user
      const user = await tx.users.findUnique({
        where: { id: data.user_id },
        select: { id: true, phone: true, full_name: true },
      });
      if (!user) throw new Error("User không tồn tại");
      if (user.phone !== data.phone)
        throw new Error("Số điện thoại không khớp");

      // 2️⃣ Kiểm tra món
      const itemIds = [...new Set(data.items.map((i) => i.menu_item_id))];
      const itemsFromDB = await tx.menu_item.findMany({
        where: { id: { in: itemIds } },
        select: { id: true, merchant_id: true, name_item: true },
      });

      if (itemsFromDB.length !== itemIds.length)
        throw new Error("Một số món không tồn tại");

      const invalid = itemsFromDB.filter(
        (i) => i.merchant_id !== data.merchant_id
      );
      if (invalid.length)
        throw new Error(
          "Một số món không thuộc merchant: " +
            invalid.map((i) => i.name_item).join(", ")
        );

      // 3️⃣ Tính total
      const totalItems = data.items.reduce((sum, item) => {
        const toppings = (item.selected_option_items ?? []).reduce(
          (t, op) => t + (op.price ?? 0),
          0
        );
        return sum + (item.price + toppings) * item.quantity;
      }, 0);
      const total = BigInt(totalItems + data.delivery_fee);

      // 4️⃣ Tạo order cơ bản (repo trả về id)
      const base = await CreateOrder.createOrder(tx, {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        full_name: user.full_name ?? "Khách COD",
        phone: user.phone,
        delivery_address: data.delivery_address,
        delivery_fee: BigInt(data.delivery_fee),
        note: data.note,
        total_amount: total,
        status: "DELIVERING",
        status_payment: "PENDING",
      });

      // 5️⃣ Tạo items + options
      await CreateOrder.createOrderItems(tx, base.id, data.items);

      // 6️⃣ Lấy full order + format JSON từ repo
      return await CreateOrder.getFullOrder(tx, base.id);
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
