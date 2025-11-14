import { prisma } from "@/libs/prisma";
import { PaymentStatus, order_status } from "@prisma/client";

export const momoRepository = {
  /** 🔹 Tạo hoặc cập nhật order + items + option */
  async createOrderWithItems(tx: any, data: any) {
    // 1️⃣ Tìm order PENDING của user + merchant (MOMO hoặc VNPAY)
    let order = await tx.order.findFirst({
      where: {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        status: order_status.PENDING,
        status_payment: PaymentStatus.PENDING,
        payment_method: { in: ["MOMO", "VNPAY"] },
      },
    });

    // 2️⃣ Nếu có → update
    if (order) {
      await tx.order_item.deleteMany({ where: { order_id: order.id } });

      order = await tx.order.update({
        where: { id: order.id },
        data: {
          payment_method: "MOMO",
          total_amount: BigInt(data.total_amount),
          note: data.note ?? order.note,
          delivery_address: data.delivery_address,
          delivery_fee: BigInt(data.delivery_fee || 0),
          updated_at: new Date(),
        },
      });
    } else {
      // 3️⃣ Nếu chưa có → tạo mới
      order = await tx.order.create({
        data: {
          user_id: data.user_id,
          merchant_id: data.merchant_id,
          full_name: data.full_name,
          phone: data.phone,
          delivery_address: data.delivery_address,
          delivery_fee: BigInt(data.delivery_fee || 0),
          note: data.note,
          total_amount: BigInt(data.total_amount),
          status: order_status.PENDING,
          status_payment: PaymentStatus.PENDING,
          payment_method: "MOMO",
        },
      });
    }

    // =====================================
    // 4️⃣ Tạo order_item + order_item_option
    // =====================================
    if (data.items?.length) {
      for (const item of data.items) {
        const orderItem = await tx.order_item.create({
          data: {
            order_id: order.id,
            menu_item_id: item.menu_item_id,
            quantity: BigInt(item.quantity),
            price: BigInt(item.price),
            note: item.note ?? null,
          },
        });

        // FE gửi selected_option_items dạng object:
        // [{ option_item_id, price }]
        const optionIds =
          item.selected_option_items?.map((o: any) => o.option_item_id) ?? [];

        if (optionIds.length > 0) {
          const validOptions = await tx.option_item.findMany({
            where: { id: { in: optionIds } },
            select: { id: true },
          });

          // Nếu có option nào không tồn tại → báo lỗi
          if (validOptions.length !== optionIds.length) {
            throw new Error("Một số option không tồn tại hoặc không hợp lệ");
          }

          // Lưu topping vào order_item_option
          for (const opt of validOptions) {
            await tx.order_item_option.create({
              data: {
                order_item_id: orderItem.id,
                option_item_id: opt.id,
              },
            });
          }
        }
      }
    }

    return order;
  },

  /** 🔹 Tạo transaction MoMo */
  async createTransaction(tx: any, data: any) {
    return tx.payment_transaction.create({
      data: {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        order_id: data.order_id,
        amount: BigInt(data.amount),
        payment_method: "MOMO",
        txn_ref: data.orderId,
        status: PaymentStatus.PENDING,
        raw_payload: data,
      },
    });
  },

  /** 🔹 Cập nhật trạng thái sau callback */
  async updateAfterCallback(txn_ref: string, data: any) {
    let statusEnum: PaymentStatus;

    switch (data.status?.toLowerCase()) {
      case "success":
        statusEnum = PaymentStatus.SUCCESS;
        break;
      case "failed":
        statusEnum = PaymentStatus.FAILED;
        break;
      case "canceled":
        statusEnum = PaymentStatus.CANCELED;
        break;
      default:
        statusEnum = PaymentStatus.PENDING;
    }

    await prisma.payment_transaction.updateMany({
      where: { txn_ref },
      data: {
        response_code: data.response_code,
        transaction_no: data.transaction_no,
        status: statusEnum,
      },
    });

    const txn = await prisma.payment_transaction.findFirst({
      where: { txn_ref },
    });

    if (txn?.order_id) {
      await prisma.order.update({
        where: { id: txn.order_id },
        data: {
          status_payment: statusEnum,
          status: order_status.PENDING,
        },
      });
    }

    return { success: true };
  },
};
