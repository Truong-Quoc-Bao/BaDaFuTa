import { PrismaClient, Prisma } from "@prisma/client";
import { OrderItemInput } from "./order.type";

const prisma = new PrismaClient();

export const orderRepository = {
  // Tạo order
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
      payment_method?: string;
    }
  ) {
    return tx.order.create({ data });
  },

  /**  Tạo danh sách order_item */
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
