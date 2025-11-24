import {
  PrismaClient,
  Prisma,
  order_status,
  PaymentStatus,
  payment_method,
} from "@prisma/client";
import { OrderItemInput, GetOrderInput, UpdateRating } from "./order.type";

const prisma = new PrismaClient();

export const CreateOrder = {
  /** 1️⃣ Tạo order cơ bản (chưa có items) */
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
      voucher_id?: string | null; // ✅ THÊM DÒNG NÀY
    }
  ) {
    const normalized = {
      ...data,

      voucher_id: data.voucher_id ?? null, // ✅ OPTIONAL, không có thì để null

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

    // Tạo order → return ID để service còn tạo items
    const created = await tx.order.create({
      data: normalized,
      select: { id: true }, // chỉ cần id
    });

    return created; // { id: ... }
  },

  /** 2️⃣ Tạo món + option */
  async createOrderItems(
    tx: Prisma.TransactionClient,
    order_id: string,
    items: OrderItemInput[]
  ) {
    for (const i of items) {
      const orderItem = await tx.order_item.create({
        data: {
          order_id,
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
              order_item_id: orderItem.id,
              option_item_id: op.option_item_id,
            },
          });
        }
      }
    }
  },

  /** 3️⃣ Lấy FULL ORDER + format JSON giống getOrder() */
  async getFullOrder(
    tx: Prisma.TransactionClient,
    orderId: string,
    breakdown?: {
      apply_type: "DELIVERY" | "MERCHANT" | "TOTAL" | null;
      voucher_code: string | null;

      items_before: number;
      items_after: number;

      delivery_before: number;
      delivery_after: number;

      total_before: number;
      total_after: number;

      discount_value: number;
    }
  ) {
    const fullOrder = await tx.order.findUnique({
      where: { id: orderId },
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
        voucher: true, // nếu bạn có relation voucher trong model order
      },
    });

    if (!fullOrder) throw new Error("Không tìm thấy order");

    const merchant_address =
      (fullOrder.merchant.location as any)?.address ?? "Chưa có địa chỉ";

    // 👇 Tạo object price_breakdown tùy theo apply_type
    let price_breakdown: any = null;

    if (breakdown) {
      const {
        apply_type,
        voucher_code,
        items_before,
        items_after,
        delivery_before,
        delivery_after,
        total_before,
        total_after,
        discount_value,
      } = breakdown;

      if (apply_type === "DELIVERY") {
        // 👉 Case 1: Voucher áp cho phí vận chuyển
        price_breakdown = {
          apply_type,
          voucher_code,

          // in cho FE đúng yêu cầu:
          delivery_before,
          delivery_after,
          discount_value, // số tiền giảm được từ ship

          items_before,
          items_after, // = items_before (không đổi)

          total_after, // = items_before + delivery_after
        };
      } else if (apply_type === "MERCHANT") {
        // 👉 Case 2: Voucher áp cho món ăn
        price_breakdown = {
          apply_type,
          voucher_code,

          items_before,
          items_after,
          discount_value, // số tiền giảm trên phần món

          delivery_before,
          delivery_after, // = delivery_before (không đổi)

          total_after, // = items_after + delivery_before
        };
      } else if (apply_type === "TOTAL") {
        // 👉 Case 3: Voucher áp cho tổng bill
        price_breakdown = {
          apply_type,
          voucher_code,

          items_before,
          items_after, // = items_before (không đổi)

          delivery_before,
          delivery_after, // = delivery_before

          total_before,
          total_after, // = total_before - discount
          discount_value, // số tiền giảm trên tổng
        };
      } else {
        // Không áp voucher
        price_breakdown = {
          apply_type: null,
          voucher_code: null,
          items_before,
          items_after,
          delivery_before,
          delivery_after,
          total_before,
          total_after,
          discount_value,
        };
      }
    }

    return {
      success: true,
      message: "Tạo đơn hàng thành công",

      order_id: fullOrder.id,
      merchant_id: fullOrder.merchant_id,
      merchant_name: fullOrder.merchant.merchant_name,
      merchant_address,
      merchant_image: fullOrder.merchant.profile_image,
      merchant_phone: fullOrder.merchant.phone,

      receiver_name: fullOrder.full_name,
      receiver_phone: fullOrder.phone,

      delivery_address: fullOrder.delivery_address,
      payment_method: fullOrder.payment_method,
      status_payment: fullOrder.status_payment,
      voucher: fullOrder.voucher?.code,

      delivery_fee: String(fullOrder.delivery_fee ?? 0n),
      total_amount: String(fullOrder.total_amount ?? 0n),

      status: fullOrder.status,
      note: fullOrder.note,
      created_at: fullOrder.created_at,

      // 👉 thêm info voucher cơ bản (nếu muốn)
      voucher_code: breakdown?.voucher_code ?? null,
      voucher_apply_type: breakdown?.apply_type ?? null,

      // 👉 breakdown cho FE in ra theo yêu cầu
      price_breakdown,

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
        merchant_id: order.merchant_id,
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
        note: order.note,
        created_at: order.created_at,
        items: order.items.map((item) => ({
          id: item.id,
          menu_item_id: item.menu_item_id,
          name_item: item.menu_item?.name_item,
          image_item: item.menu_item?.image_item,
          quantity: item.quantity,
          price: item.price.toString(),
          // note: item.note,
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
export const cancelOrder = {
  async updateStatus(orderId: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELED",
        status_payment: "REFUNDED",
        updated_at: new Date(),
      },
      include: {
        user: true,
        merchant: true,
      },
    });
  },
};
export const orderRatingRepo = {
  findOrder(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
    });
  },

  findRatingByOrderId(orderId: string) {
    return prisma.order_rating.findUnique({
      where: { order_id: orderId },
    });
  },

  createRating(orderId: string, data: UpdateRating) {
    return prisma.order_rating.create({
      data: {
        order_id: orderId,
        rating: data.rating,
        review: data.review ?? null,
      },
      include: {
        order: true,
      },
    });
  },
  async updateMerchantRating(merchantID: string, rating: number) {
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantID },
      select: {
        rating: true,
        rating_count: true,
      },
    });
    if (!merchant) {
      throw new Error("nhà hàng không tồn tại!");
    }
    let oldRating = merchant.rating ?? 0;
    let oldCount = merchant.rating_count ?? 0;

    let newCount, newRating;

    if (oldCount === 0) {
      newRating = rating;
      newCount = 1;
    } else {
      newCount = oldCount + 1;
      newRating = (oldRating * oldCount + rating) / newCount;
    }
    await prisma.merchant.update({
      where: { id: merchantID },
      data: {
        rating: parseFloat(newRating.toFixed(1)),
        rating_count: newCount,
      },
    });
  },
  updateRating(orderId: string, data: UpdateRating) {
    return prisma.order_rating.update({
      where: { order_id: orderId },
      data: {
        rating: data.rating,
        review: data.review ?? null,
      },
      include: {
        order: true,
      },
    });
  },
  deleteRating(orderId: string) {
    return prisma.order_rating.delete({
      where: { order_id: orderId },
    });
  },
};
