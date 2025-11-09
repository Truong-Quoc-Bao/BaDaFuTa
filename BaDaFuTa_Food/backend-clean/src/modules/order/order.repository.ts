import {
  PrismaClient,
  Prisma,
  order_status,
  PaymentStatus,
  payment_method,
} from "@prisma/client";
import { OrderItemInput, GetOrderInput } from "./order.type";

const prisma = new PrismaClient();

export const CreateOrder = {
  /** 🧾 Tạo order COD */
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

      payment_method: "COD" as payment_method,
    };

    return tx.order.create({ data: normalized });
  },

  /** 🧩 Tạo các món trong đơn hàng (kèm option) */
  /** 🧩 Tạo các món trong đơn hàng (kèm option) */
  async createOrderItems(
    tx: Prisma.TransactionClient,
    order_id: string,
    items: OrderItemInput[]
  ) {
    for (const i of items) {
      // 1️⃣ Tạo từng món trong đơn
      const orderItem = await tx.order_item.create({
        data: {
          order_id,
          menu_item_id: i.menu_item_id,
          quantity: i.quantity,
          price: BigInt(i.price),
          note: i.note ?? null,
        },
      });

      // 2️⃣ Nếu có option được chọn
      if (i.selected_option_items && i.selected_option_items.length > 0) {
        console.log("👉 Option gửi lên:", i.selected_option_items);

        // ✅ Kiểm tra option có tồn tại không
        const validOptionItems = await tx.option_item.findMany({
          where: { id: { in: i.selected_option_items } },
          select: { id: true },
        });

        console.log("✅ Option hợp lệ:", validOptionItems);

        if (validOptionItems.length === 0) {
          console.warn(
            `⚠️ Không tìm thấy option nào hợp lệ cho món ${i.menu_item_id}`
          );
          continue;
        }

        // ✅ Lưu từng option thủ công (fix Prisma không cho createMany composite key)
        for (const opt of validOptionItems) {
          await tx.order_item_option.create({
            data: {
              order_item_id: orderItem.id,
              option_item_id: opt.id,
            },
          });
        }

        console.log("💾 Đã lưu option cho món:", i.menu_item_id);
      } else {
        console.log("ℹ️ Món không có option:", i.menu_item_id);
      }
    }
  },
};

export const getOrder = {
  /** 🔎 Lấy danh sách order */
  async findMany(args: GetOrderInput) {
    const orders = await prisma.order.findMany({
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
        merchant: {
          select: {
            id: true,
            merchant_name: true,
            location: true,
            phone: true,
            profile_image: true,
          },
        },
        items: {
          include: {
            menu_item: {
              select: {
                id: true,
                name_item: true,
                image_item: true,
                price: true,
              },
            },
            options: {
              include: {
                option_item: {
                  select: {
                    id: true,
                    option_item_name: true,
                    option: {
                      select: {
                        id: true,
                        option_name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // ✅ Biến đổi kết quả để có cấu trúc bạn muốn
    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        options: item.options.map((opt) => ({
          id: opt.option_item.option.id,
          option_name: opt.option_item.option.option_name,
          option_item: {
            id: opt.option_item.id,
            option_item_name: opt.option_item.option_item_name,
          },
        })),
      })),
    }));
  },
};
export const updateOrderBody = {
  async updateStatus(
    orderId: string,
    data: { status?: order_status; status_payment?: PaymentStatus }
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data, // ✅ truyền nguyên object, có thể chứa cả status_payment
      include: { merchant: true },
    });
  },
};

export const updateOrder = {
  async updateStatus(orderId: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        status_payment: "SUCCESS",
        updated_at: new Date(),
      },
      include: {
        user: true,
        merchant: true,
      },
    });
  },
};
