import {
  PrismaClient,
  Prisma,
  order_status,
  PaymentStatus,
  payment_method,
} from "@prisma/client";
import { OrderItemInput, GetOrderInput } from "./order.type";

const prisma = new PrismaClient();
export const postOrder = {
  // 🧾 Tạo order (COD)
  async createOrder(
    tx: Prisma.TransactionClient,
    data: {
      user_id: string;
      merchant_id: string;
      full_name: string;
      phone?: string | null;
      delivery_address?: string | null;
      delivery_fee: bigint;
      note?: string | null;
      total_amount: bigint;
      status?: string;
      status_payment?: string;
    }
  ) {
    const normalized = {
      ...data,
      status:
        ((
          data.status || "PENDING"
        ).toUpperCase() as keyof typeof order_status) in order_status
          ? ((data.status || "PENDING").toUpperCase() as order_status)
          : order_status.PENDING,

      status_payment:
        ((
          data.status_payment || "PENDING"
        ).toUpperCase() as keyof typeof PaymentStatus) in PaymentStatus
          ? ((data.status_payment || "PENDING").toUpperCase() as PaymentStatus)
          : PaymentStatus.PENDING,

      // 🔹 Ép cứng payment_method = COD
      payment_method: "COD" as payment_method,
    };

    return tx.order.create({ data: normalized });
  },

  /**  🧾 Tạo danh sách order_item */
  async createOrderItems(
    tx: Prisma.TransactionClient,
    order_id: string,
    items: OrderItemInput[]
  ) {
    return tx.order_item.createMany({
      data: items.map((i) => ({
        order_id,
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
        price: BigInt(i.price),
        note: i.note ?? null,
      })),
    });
  },
};

export const orderRepository = {
  findMany: async (args: GetOrderInput) => {
    return prisma.order.findMany({
      where: {
        ...(args.id && { id: args.id }),
        ...(args.user_id && { user_id: args.user_id }),
        ...(args.merchant_id && { merchant_id: args.merchant_id }),
        ...(args.phone && { phone: args.phone }),
        ...(args.status && { status: args.status }),
        ...(args.status_payment && { status_payment: args.status_payment }),
        ...(args.payment_method && { payment_method: args.payment_method }),
      },
      include: {
        items: {
          include: {
            menu_item: true,
            options: {
              include: { option_item: true },
            },
          },
        },
        payments: true,
        merchant: true,
        user: true,
      },
      orderBy: { created_at: "desc" },
    });
  },

  count: async (args: GetOrderInput) => {
    return prisma.order.count({
      where: {
        ...(args.user_id && { user_id: args.user_id }),
        ...(args.status && { status: args.status }),
      },
    });
  },
};
