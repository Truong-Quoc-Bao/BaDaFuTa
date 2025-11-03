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
      payment_method: "VNPAY";
      full_name: string;
      items?: {
        menu_item_id: string;
        quantity: number;
        price: number;
        note?: string | null;
      }[];
    }
  ) {
    const { items, ...orderData } = data;

    // ✅ Bổ sung fallback enum an toàn
    const normalizedOrder = {
      ...orderData,
      status: orderData.status ?? order_status.PENDING,
      status_payment: orderData.status_payment ?? PaymentStatus.PENDING,
    };

    // 1️⃣ Tạo order chính (dùng normalized)
    const order = await tx.order.create({ data: normalizedOrder });

    // 2️⃣ Nếu có items thì tạo luôn order_item
    if (items?.length) {
      await tx.order_item.createMany({
        data: items.map((i) => ({
          order_id: order.id,
          menu_item_id: i.menu_item_id,
          quantity: i.quantity,
          price: i.price,
          note: i.note ?? null,
        })),
      });
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
            status: order_status.COMPLETED,
          },
        });
      }
    }

    // ❌ Nếu thất bại hoặc bị hủy → giữ order ở trạng thái pending
    if (  statusEnum === PaymentStatus.CANCELED ||
      statusEnum === PaymentStatus.FAILED 
    
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
