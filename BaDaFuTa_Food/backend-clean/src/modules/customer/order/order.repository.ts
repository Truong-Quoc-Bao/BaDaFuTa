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
    // Chuẩn hóa status
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

    // 1️⃣ Tạo order (chưa có items)
    const baseOrder = await tx.order.create({
      data: normalized,
    });

    // 2️⃣ Truy vấn lại order FULL (sau khi FE đã gọi createOrderItems)
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
                    price: true,
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
    });

    if (!fullOrder) throw new Error("Order not found after creation.");

    // 3️⃣ Format address
    let merchant_address = "Chưa có địa chỉ";
    if (
      typeof fullOrder.merchant?.location === "object" &&
      fullOrder.merchant.location !== null &&
      "address" in fullOrder.merchant.location
    ) {
      merchant_address = (fullOrder.merchant.location as any).address;
    }

    // 4️⃣ Format JSON EXACT TEMPLATE
    return {
      success: true,
      message: "Tạo đơn hàng thành công",

      order_id: fullOrder.id,
      merchant_name: fullOrder.merchant?.merchant_name ?? "Không xác định",
      merchant_address,
      merchant_image: fullOrder.merchant?.profile_image,
      merchant_phone: fullOrder.merchant?.phone ?? null,

      receiver_name: fullOrder.full_name,
      receiver_phone: fullOrder.phone,

      delivery_address: fullOrder.delivery_address,
      payment_method: fullOrder.payment_method,
      status_payment: fullOrder.status_payment,

      delivery_fee: fullOrder.delivery_fee
        ? fullOrder.delivery_fee.toString()
        : "0",
      total_amount: fullOrder.total_amount.toString(),

      status: fullOrder.status,
      created_at: fullOrder.created_at,

      items: fullOrder.items.map((item) => ({
        id: item.id,
        menu_item_id: item.menu_item_id,
        name_item: item.menu_item?.name_item,
        image_item: item.menu_item?.image_item,
        quantity: item.quantity.toString(),
        price: item.price.toString(),
        note: item.note,

        options: item.options.map((opt) => ({
          option_id: opt.option_item.option.id,
          option_name: opt.option_item.option.option_name,
          option_item_id: opt.option_item.id,
          option_item_name: opt.option_item.option_item_name,
          price: opt.option_item.price.toString(),
        })),
      })),
    };
  },
  /** 🧩 Tạo món + option trong order */
  async createOrderItems(
    tx: Prisma.TransactionClient,
    order_id: string,
    items: OrderItemInput[]
  ) {
    for (const i of items) {
      // 1️⃣ Tạo item trong order
      const orderItem = await tx.order_item.create({
        data: {
          order_id,
          menu_item_id: i.menu_item_id,
          quantity: i.quantity,
          price: BigInt(i.price),
          note: i.note ?? null,
        },
      });

      // 2️⃣ Nếu có option / topping
      if (i.selected_option_items && i.selected_option_items.length > 0) {
        console.log("👉 FE gửi option:", i.selected_option_items);

        // ⭐ FE gửi dạng object — map để lấy ID cho Prisma
        const optionIds = i.selected_option_items.map(
          (opt) => opt.option_item_id
        );

        // ⭐ Kiểm tra option hợp lệ trong DB
        const validOptionItems = await tx.option_item.findMany({
          where: { id: { in: optionIds } },
          select: { id: true },
        });

        if (validOptionItems.length === 0) {
          console.warn(`⚠️ Không có option hợp lệ cho món ${i.menu_item_id}`);
          continue;
        }

        // ⭐ Lưu option_item ID (không lưu price)
        for (const opt of validOptionItems) {
          await tx.order_item_option.create({
            data: {
              order_item_id: orderItem.id,
              option_item_id: opt.id,
            },
          });
        }

        console.log("💾 Đã lưu option cho:", i.menu_item_id);
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
            merchant_name: true,
            phone: true,
            location: true,
            profile_image: true,
          },
        },
        user: {
          select: {
            full_name: true,
            phone: true,
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
                    price: true,
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

    return orders.map((order) => {
      let merchant_address = "Chưa có địa chỉ";
      if (
        typeof order.merchant?.location === "object" &&
        order.merchant.location !== null &&
        "address" in order.merchant.location
      ) {
        merchant_address = (order.merchant.location as any).address;
      }

      return {
        success: true,
        message: "Lấy thông tin đơn hàng thành công",
        order_id: order.id,
        merchant_name: order.merchant?.merchant_name ?? "Không xác định",
        merchant_address,
        merchant_image: order.merchant.profile_image,
        merchant_phone: order.merchant?.phone ?? null,
        receiver_name: order.user?.full_name ?? "Không xác định",
        receiver_phone: order.user?.phone ?? null,
        delivery_address: order.delivery_address,
        payment_method: order.payment_method,
        status_payment: order.status_payment,
        delivery_fee: order.delivery_fee,
        total_amount: order.total_amount.toString(),
        status: order.status,
        created_at: order.created_at,
        items: order.items.map((item) => ({
          id: item.id,
          menu_item_id: item.menu_item_id,
          name_item: item.menu_item?.name_item,
          image_item: item.menu_item?.image_item,
          quantity: item.quantity,
          price: item.price.toString(),
          note: item.note,
          options:
            item.options?.map((opt) => ({
              option_id: opt.option_item.option.id,
              option_name: opt.option_item.option.option_name,
              option_item_id: opt.option_item.id,
              option_item_name: opt.option_item.option_item_name,
              price: opt.option_item.price,
            })) ?? [],
        })),
      };
    });
  },
};

export const updateOrderBody = {
  async updateStatus(
    orderId: string,
    data: { status?: order_status; status_payment?: PaymentStatus }
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data,
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
