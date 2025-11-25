import { prisma } from '@/libs/prisma';
import { PaymentStatus, order_status } from '@prisma/client';

export const momoRepository = {
  /** 🔹 Tạo hoặc cập nhật order + items + option */
  async createOrderWithItems(tx: any, data: any) {
    let order = await tx.order.findFirst({
      where: {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        status: order_status.DELIVERING,
        status_payment: PaymentStatus.PENDING,
        payment_method: { in: ['MOMO', 'VNPAY'] },
      },
    });

    if (order) {
      await tx.order_item.deleteMany({ where: { order_id: order.id } });

      order = await tx.order.update({
        where: { id: order.id },
        data: {
          payment_method: 'MOMO',
          total_amount: BigInt(data.total_amount),
          note: data.note ?? order.note,
          delivery_address: data.delivery_address,
          delivery_fee: BigInt(data.delivery_fee || 0),
          updated_at: new Date(),
        },
      });
    } else {
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
          status: order_status.DELIVERING,
          status_payment: PaymentStatus.PENDING,
          payment_method: 'MOMO',
        },
      });
    }

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

        const optionIds = item.selected_option_items?.map((o: any) => o.option_item_id) ?? [];

        if (optionIds.length > 0) {
          const validOptions = await tx.option_item.findMany({
            where: { id: { in: optionIds } },
            select: { id: true },
          });

          if (validOptions.length !== optionIds.length) {
            throw new Error('Một số option không tồn tại hoặc không hợp lệ');
          }

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
        payment_method: 'MOMO',
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
      case 'success':
        statusEnum = PaymentStatus.SUCCESS;
        break;
      case 'failed':
        statusEnum = PaymentStatus.FAILED;
        break;
      case 'canceled':
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
          // status: order_status.PENDING,
          status: order_status.DELIVERING,
        },
      });
    }

    return { success: true };
  },

  /** 🔹 Lấy FULL ORDER JSON (giống COD, VNPAY, MoMo đều dùng) */
  async getFullOrder(order_id: string) {
    const fullOrder = await prisma.order.findUnique({
      where: { id: order_id },
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
      },
    });

    if (!fullOrder) throw new Error('Không tìm thấy order');

    const merchant_address =
      typeof fullOrder.merchant?.location === 'object' &&
      fullOrder.merchant.location &&
      'address' in fullOrder.merchant.location
        ? fullOrder.merchant.location.address
        : 'Chưa có địa chỉ';

    return {
      success: true,
      message: 'Tạo đơn hàng thành công',

      order_id: fullOrder.id,

      merchant_name: fullOrder.merchant?.merchant_name ?? '',
      merchant_address,
      merchant_image: fullOrder.merchant?.profile_image ?? null,
      merchant_phone: fullOrder.merchant?.phone ?? null,

      receiver_name: fullOrder.full_name,
      receiver_phone: fullOrder.phone,

      delivery_address: fullOrder.delivery_address,
      payment_method: fullOrder.payment_method,
      status_payment: fullOrder.status_payment,

      delivery_fee: fullOrder.delivery_fee?.toString() ?? '0',
      total_amount: fullOrder.total_amount?.toString() ?? '0',

      status: fullOrder.status,
      note: fullOrder.note ?? '',
      created_at: fullOrder.created_at,

      items: fullOrder.items.map((item) => ({
        id: item.id,
        menu_item_id: item.menu_item_id,

        name_item: item.menu_item?.name_item ?? '',
        image_item: item.menu_item?.image_item ?? null,

        quantity: item.quantity.toString(),
        price: item.price.toString(),
        note: item.note ?? null,

        options: item.options.map((opt) => ({
          option_id: opt.option_item.option?.id ?? null,
          option_name: opt.option_item.option?.option_name ?? null,
          option_item_id: opt.option_item.id,
          option_item_name: opt.option_item.option_item_name,
          price: opt.option_item.price.toString(),
        })),
      })),
    };
  },
};
