import { prisma } from "@/libs/prisma";
import {
  CreateOrder,
  getOrder,
  updateOrder,
  updateOrderBody,
  cancelOrder,
  orderRatingRepo,
} from "./order.repository";
import {
  CreateCODOrderInput,
  GetOrderInput,
  UpdateOrder,
  UpdateRating,
} from "./order.type";
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

      // 3️⃣ Tính tổng tiền món ăn (chưa có ship)
      const totalItems = data.items.reduce((sum, item) => {
        const toppings = (item.selected_option_items ?? []).reduce(
          (t, op) => t + (op.price ?? 0),
          0
        );
        return sum + (item.price + toppings) * item.quantity;
      }, 0);

      const deliveryFee = data.delivery_fee;
      let discount = 0;

      // 👉 Các biến breakdown
      let beforeItems = totalItems;
      let afterItems = totalItems;

      let beforeDelivery = deliveryFee;
      let afterDelivery = deliveryFee;

      let beforeTotal = totalItems + deliveryFee;
      let afterTotal = beforeTotal;

      let discountValue = 0;

      let voucherRecord: any = null;
      let applyType: "TOTAL" | "DELIVERY" | "MERCHANT" | null = null;

      if (data.voucher) {
        voucherRecord = await tx.voucher.findUnique({
          where: { code: data.voucher },
        });

        if (!voucherRecord) throw new Error("Voucher không tồn tại");
        if (!voucherRecord.is_active)
          throw new Error("Voucher đã hết hiệu lực");

        const now = new Date();
        if (now < voucherRecord.start_date || now > voucherRecord.end_date) {
          throw new Error("Voucher không còn hiệu lực");
        }

        // ⭐ Voucher khách mới (WELCOME...)
        if (voucherRecord.code.startsWith("WELCOME")) {
          const countOrders = await tx.order.count({
            where: { user_id: data.user_id, status: "COMPLETED" },
          });
          if (countOrders > 0) {
            throw new Error("Voucher chỉ áp dụng cho khách mới");
          }
        }

        applyType = voucherRecord.apply_type; // 'TOTAL' | 'DELIVERY' | 'MERCHANT'

        // =======================
        // CASE 1: APPLY_TYPE = DELIVERY
        // =======================
        if (applyType === "DELIVERY") {
          // ĐK đơn tối thiểu dựa trên TỔNG ĐƠN (món + ship)
          const conditionBase = beforeItems + beforeDelivery;

          let discountRaw = 0;

          if (conditionBase >= (voucherRecord.min_order_value ?? 0)) {
            const shipBase = deliveryFee; // chỉ giảm trên phí ship

            if (voucherRecord.discount_type === "AMOUNT") {
              discountRaw = voucherRecord.discount_value;
            } else {
              discountRaw = (shipBase * voucherRecord.discount_value) / 100;

              if (voucherRecord.max_discount) {
                discountRaw = Math.min(discountRaw, voucherRecord.max_discount);
              }
            }

            // Không cho giảm quá tiền ship
            discount = Math.min(discountRaw, shipBase);
          } else {
            discount = 0;
          }

          afterDelivery = Math.max(0, deliveryFee - discount);
          discountValue = deliveryFee - afterDelivery;
          afterItems = beforeItems; // món giữ nguyên

          // =======================
          // CASE 2: APPLY_TYPE = MERCHANT
          // =======================
        } else if (applyType === "MERCHANT") {
          // Chỉ giảm phần món, và phải đúng merchant
          const isAllowed = await tx.voucher_merchant.findFirst({
            where: {
              voucher_id: voucherRecord.id,
              merchant_id: data.merchant_id,
            },
          });

          if (!isAllowed) {
            throw new Error("Voucher không áp dụng cho merchant này");
          }

          let target = totalItems;

          if (target >= (voucherRecord.min_order_value ?? 0)) {
            if (voucherRecord.discount_type === "AMOUNT") {
              discount = voucherRecord.discount_value;
            } else {
              discount = (target * voucherRecord.discount_value) / 100;
              if (voucherRecord.max_discount) {
                discount = Math.min(discount, voucherRecord.max_discount);
              }
            }
          } else {
            discount = 0;
          }

          afterItems = Math.max(0, totalItems - discount);
          discountValue = totalItems - afterItems;
          afterDelivery = beforeDelivery; // ship giữ nguyên

          // =======================
          // CASE 3: APPLY_TYPE = TOTAL
          // =======================
        } else if (applyType === "TOTAL") {
          // Giảm trên tổng bill (món + ship)
          let target = beforeTotal;

          if (target >= (voucherRecord.min_order_value ?? 0)) {
            if (voucherRecord.discount_type === "AMOUNT") {
              discount = voucherRecord.discount_value;
            } else {
              discount = (target * voucherRecord.discount_value) / 100;
              if (voucherRecord.max_discount) {
                discount = Math.min(discount, voucherRecord.max_discount);
              }
            }
          } else {
            discount = 0;
          }

          afterItems = beforeItems; // FE vẫn thấy item không đổi
          afterDelivery = beforeDelivery; // ship không đổi
          afterTotal = Math.max(0, target - discount);

          discountValue = target - afterTotal;
        }
      }

      // 🧮 Tính tổng cuối (tùy theo applyType)
      let finalTotalNumber: number;
      if (applyType === "TOTAL") {
        finalTotalNumber = afterTotal; // đã tính trên tổng
      } else {
        // DELIVERY hoặc MERCHANT hoặc không voucher
        finalTotalNumber = afterItems + afterDelivery;
        afterTotal = finalTotalNumber;
      }

      // Convert to BigInt
      const finalTotal = BigInt(finalTotalNumber);

      // 6️⃣ Tạo order
      const base = await CreateOrder.createOrder(tx, {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        full_name: user.full_name ?? "Khách COD",
        phone: user.phone,
        delivery_address: data.delivery_address,
        delivery_fee: BigInt(data.delivery_fee),
        note: data.note,
        total_amount: finalTotal,
        status: "DELIVERING",
        status_payment: "PENDING",
        voucher_id: voucherRecord?.id ?? null, // <- thêm voucher_id
      });

      // 7️⃣ Tạo order item + options
      await CreateOrder.createOrderItems(tx, base.id, data.items);

      // 8️⃣ Update used_count voucher
      if (voucherRecord) {
        await tx.voucher.update({
          where: { id: voucherRecord.id },
          data: { used_count: (voucherRecord.used_count ?? 0) + 1 },
        });
      }

      // 9️⃣ Chuẩn bị breakdown gửi xuống FE
      const breakdown = {
        apply_type: applyType, // 'DELIVERY' | 'MERCHANT' | 'TOTAL' | null
        voucher_code: voucherRecord?.code ?? null,

        items_before: beforeItems,
        items_after: afterItems,

        delivery_before: beforeDelivery,
        delivery_after: afterDelivery,

        total_before: beforeTotal,
        total_after: afterTotal,

        discount_value: discountValue,
      };

      // 🔟 Lấy full order trả về FE (kèm breakdown)
      return await CreateOrder.getFullOrder(tx, base.id, breakdown);
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

export async function cancelOrderStatus(orderId: string) {
  return cancelOrder.updateStatus(orderId);
}
export const orderRatingService = {
  async create(orderId: string, data: UpdateRating, io?: any) {
    const order = await orderRatingRepo.findOrder(orderId);
    if (!order) throw new Error("Không tìm thấy đơn hàng.");

    const existed = await orderRatingRepo.findRatingByOrderId(orderId);
    if (existed) throw new Error("Đơn hàng này đã được đánh giá.");

    // tạo rating
    const created = await orderRatingRepo.createRating(orderId, data);

    await orderRatingRepo.updateMerchantRating(order.merchant_id, data.rating);

    // emit socket
    if (io) {
      io.emit("order:ratingCreated", {
        orderId,
        ...data,
      });
    }

    return {
      success: true,
      message: "Đánh giá đơn hàng thành công!",
      data: created,
    };
  },

  async update(orderId: string, data: UpdateRating, io?: any) {
    const existed = await orderRatingRepo.findRatingByOrderId(orderId);
    if (!existed) {
      throw new Error("Bạn chưa đánh giá đơn hàng này.");
    }

    //update
    const updated = await orderRatingRepo.updateRating(orderId, data);

    //emit socket
    if (io) {
      io.emit("order:ratingUpdated", {
        orderId,
        ...data,
      });
    }

    return {
      success: true,
      message: "Cập nhật đánh giá đơn hàng thành công!",
      data: updated,
    };
  },

  async get(orderId: string) {
    const rating = await orderRatingRepo.findRatingByOrderId(orderId);

    return {
      success: true,
      message: rating
        ? "Lấy đánh giá đơn hàng thành công!"
        : "Đơn hàng này chưa được đánh giá",
      data: rating ?? null,
    };
  },
  async delete(orderId: string) {
    const existed = await orderRatingRepo.findRatingByOrderId(orderId);

    if (!existed) {
      throw new Error("Đơn hàng này chưa có đánh giá để xoá.");
    }

    const deleted = await orderRatingRepo.deleteRating(orderId);
    return {
      success: true,
      message: "Xoá đánh giá thành công!",
    };
  },
};
