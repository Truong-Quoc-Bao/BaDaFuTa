import { prisma } from "@/libs/prisma";
import { PaymentStatus, order_status } from "@prisma/client";

export const momoRepository = {
  /** 🔹 Tạo order + order_item + order_item_option */
  async createOrderWithItems(tx: any, data: any) {
    // 1️⃣ Tìm order PENDING thuộc user + merchant + MOMO
    let order = await tx.order.findFirst({
      where: {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        status: order_status.PENDING,
        status_payment: PaymentStatus.PENDING,
        payment_method: "MOMO",
      },
    });

    // 2️⃣ Nếu có thì xóa items cũ, cập nhật lại order
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

    // 4️⃣ Tạo các order_item và order_item_option
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

        // 🔹 Nếu có option được chọn thì lưu vào order_item_option
        if (item.selected_option_items?.length) {
          const validOptions = await tx.option_item.findMany({
            where: { id: { in: item.selected_option_items } },
            select: { id: true },
          });

          if (validOptions.length !== item.selected_option_items.length) {
            throw new Error("Một số option không tồn tại hoặc không hợp lệ");
          }

          await tx.order_item_option.createMany({
            data: validOptions.map((opt: { id: string }) => ({
              order_item_id: orderItem.id,
              option_item_id: opt.id,
            })),
          });
        }
      }
    }

    return order;
  },

  /** 🔹 Lưu transaction của MoMo */
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

  /** 🔹 Cập nhật trạng thái giao dịch MoMo (sau callback) */
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
          status: order_status.PENDING, // chờ xác nhận từ merchant
        },
      });
    }

    return { success: true };
  },
};
