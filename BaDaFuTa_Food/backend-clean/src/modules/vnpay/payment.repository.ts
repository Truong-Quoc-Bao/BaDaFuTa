import {
  PrismaClient,
  Prisma,
  PaymentStatus,
  order_status,
  payment_method,
} from "@prisma/client";

export const prisma = new PrismaClient();

export const paymentRepository = {
  /** 🔹 Tạo order (và các order_item nếu có) */
  /** 🔹 Tạo order (và các order_item + option nếu có) */
  async createOrder(
    tx: Prisma.TransactionClient,
    data: {
      user_id: string;
      merchant_id: string;
      phone: string;
      delivery_address: string;
      delivery_fee: bigint;
      note?: string | null;
      total_amount: bigint;
      status?: order_status;
      status_payment?: PaymentStatus;
      payment_method: "VNPAY" | "MOMO" | "COD";
      full_name: string;
      items?: {
        menu_item_id: string;
        quantity: number;
        price: number;
        note?: string | null;
        selected_option_items?: string[]; // ✅ thêm vào đây
      }[];
    }
  ) {
    const { items, ...orderData } = data;

    const normalizedOrder = {
      ...orderData,
      status: orderData.status ?? order_status.PENDING,
      status_payment: orderData.status_payment ?? PaymentStatus.PENDING,
    };

    // 1️⃣ Tạo order chính
    const order = await tx.order.create({ data: normalizedOrder });

    // 2️⃣ Nếu có items thì tạo luôn order_item và order_item_option
    if (items?.length) {
      for (const item of items) {
        // 🧾 Tạo order_item
        const orderItem = await tx.order_item.create({
          data: {
            order_id: order.id,
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            price: item.price,
            note: item.note ?? null,
          },
        });

        // 🧩 Nếu có selected_option_items → tạo thêm bảng liên kết
        if (item.selected_option_items?.length) {
          // ✅ Kiểm tra option tồn tại (bảo vệ)
          const validOptions = await tx.option_item.findMany({
            where: { id: { in: item.selected_option_items } },
            select: { id: true },
          });

          if (validOptions.length !== item.selected_option_items.length) {
            throw new Error("Một số option không tồn tại hoặc không hợp lệ");
          }

          // ✅ Lưu vào order_item_option
          await tx.order_item_option.createMany({
            data: validOptions.map((opt) => ({
              order_item_id: orderItem.id,
              option_item_id: opt.id,
            })),
          });
        }
      }
    }

    return order;
  },
  /** 🔹 Lưu transaction */
  async createTransaction(
    tx: Prisma.TransactionClient,
    data: {
      user_id: string;
      merchant_id: string;
      order_id: string;
      amount: bigint;
      payment_method: payment_method;
      txn_ref: string;
      raw_payload: any;
    }
  ) {
    return tx.payment_transaction.create({
      data: {
        ...data,
        status: PaymentStatus.PENDING,
        raw_payload: data.raw_payload,
      },
    });
  },

  /** 🔹 Tìm đơn hàng đang pending/unpaid */
  async findPendingOrder(user_id: string, merchant_id: string) {
    return prisma.order.findFirst({
      where: {
        user_id,
        merchant_id,
        status: order_status.PENDING,
        status_payment: PaymentStatus.PENDING,
      },
      include: { items: true },
    });
  },

  /** 🔹 Hủy đơn hàng */
  async cancelOrder(order_id: string) {
    return prisma.order.update({
      where: { id: order_id },
      data: { status: order_status.CANCELED },
    });
  },

  /** 🔹 Cập nhật sau callback (VNPAY báo về) */
  async updateAfterCallback(txnRef: string, data: any) {
    // 🧠 Map từ string → Enum PaymentStatus
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

    // ✅ Cập nhật payment_transaction
    const tx = await prisma.payment_transaction.updateMany({
      where: { txn_ref: txnRef },
      data: {
        response_code: data.response_code,
        transaction_no: data.transaction_no,
        status: statusEnum,
      },
    });

    // ✅ Nếu thanh toán thành công → cập nhật order
    if (statusEnum === PaymentStatus.SUCCESS) {
      const txn = await prisma.payment_transaction.findFirst({
        where: { txn_ref: txnRef },
      });
      if (txn?.order_id) {
        await prisma.order.update({
          where: { id: txn.order_id },
          data: {
            status_payment: PaymentStatus.SUCCESS,
            status: order_status.PENDING,
          },
        });
      }
    }

    // ❌ Nếu thất bại hoặc bị hủy → giữ order ở trạng thái pending
    if (
      statusEnum === PaymentStatus.FAILED ||
      statusEnum === PaymentStatus.CANCELED
    ) {
      const txn = await prisma.payment_transaction.findFirst({
        where: { txn_ref: txnRef },
      });
      if (txn?.order_id) {
        await prisma.order.update({
          where: { id: txn.order_id },
          data: {
            status_payment: PaymentStatus.PENDING,
            status: order_status.PENDING,
          },
        });
      }
    }

    return tx;
  },
};

export default paymentRepository;
