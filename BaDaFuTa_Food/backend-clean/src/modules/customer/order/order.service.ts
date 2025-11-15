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

      if (user.phone !== data.phone) {
        throw new Error("Số điện thoại không khớp");
      }

      // 2️⃣ Kiểm tra món có thuộc merchant không
      const itemIds = [...new Set(data.items.map((i) => i.menu_item_id))];

      const itemsFromDB = await tx.menu_item.findMany({
        where: { id: { in: itemIds } },
        select: { id: true, merchant_id: true, name_item: true },
      });

      if (itemsFromDB.length !== itemIds.length) {
        throw new Error("Một số món không tồn tại");
      }

      const invalidItems = itemsFromDB.filter(
        (i) => i.merchant_id !== data.merchant_id
      );

      if (invalidItems.length)
        throw new Error(
          "Một số món không thuộc merchant: " +
            invalidItems.map((i) => i.name_item).join(", ")
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

      // 4️⃣ CREATE ORDER
      const baseOrder = await tx.order.create({
        data: {
          user_id: data.user_id,
          merchant_id: data.merchant_id,
          full_name: user.full_name ?? "Khách COD",
          phone: user.phone,
          delivery_address: data.delivery_address,
          delivery_fee: BigInt(data.delivery_fee),
          note: data.note,
          total_amount: total,
          payment_method: "COD",
          status: "DELIVERING",
          status_payment: "PENDING",
        },
      });

      // 5️⃣ CREATE ORDER ITEMS
      for (const i of data.items) {
        const newItem = await tx.order_item.create({
          data: {
            order_id: baseOrder.id,
            menu_item_id: i.menu_item_id,
            quantity: i.quantity,
            price: BigInt(i.price),
            note: i.note ?? null,
          },
        });

        if (i.selected_option_items?.length) {
          for (const op of i.selected_option_items) {
            await tx.order_item_option.create({
              data: {
                order_item_id: newItem.id,
                option_item_id: op.option_item_id,
              },
            });
          }
        }
      }

      // 6️⃣ FETCH FULL ORDER SAU KHI TẠO ITEMS & OPTIONS
      const fullOrder = await tx.order.findUnique({
        where: { id: baseOrder.id },
        include: {
          merchant: {
            select: {
              merchant_name: true,
              phone: true,
              location: true,
              profile_image: true,
            },
          },
          items: {
            include: {
              menu_item: true,
              options: {
                include: {
                  option_item: {
                    include: { option: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!fullOrder) throw new Error("Không tìm thấy full order");
      return {
        order_id: fullOrder.id,
        merchant_name: fullOrder.merchant.merchant_name,
        merchant_address:
          (fullOrder.merchant.location as any)?.address ?? "Chưa có địa chỉ",
        merchant_image: fullOrder.merchant.profile_image,
        merchant_phone: fullOrder.merchant.phone,

        receiver_name: fullOrder.full_name,
        receiver_phone: fullOrder.phone,

        delivery_address: fullOrder.delivery_address,
        payment_method: fullOrder.payment_method,
        status_payment: fullOrder.status_payment,

        delivery_fee: String(fullOrder.delivery_fee ?? 0n),
        total_amount: String(fullOrder.total_amount ?? 0n),

        status: fullOrder.status,
        created_at: fullOrder.created_at,

        items: fullOrder.items.map((i) => ({
          id: i.id,
          menu_item_id: i.menu_item_id,
          name_item: i.menu_item?.name_item,
          image_item: i.menu_item?.image_item,
          quantity: String(i.quantity),
          price: String(i.price),
          note: i.note,

          options: i.options.map((op) => ({
            option_id: op.option_item.option.id,
            option_name: op.option_item.option.option_name,
            option_item_id: op.option_item.id,
            option_item_name: op.option_item.option_item_name,
            price: String(op.option_item.price),
          })),
        })),
      };
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
