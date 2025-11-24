// src/modules/momo/momo.service.ts
import crypto from 'crypto';
import https from 'https';
import { prisma } from '@/libs/prisma';
import { momoRepository } from './momo.repository';

/**Cấu hình MoMo */
const MOMO_CONFIG = {
  accessKey: process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85',
  secretKey: process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
  redirectUrl:'https://badafuta-production.up.railway.app/api/momo/return',
  ipnUrl:'https://badafuta-production.up.railway.app/api/momo/callback',
  requestType: 'payWithMethod',
};

export type PaymentStatusType = 'success' | 'failed' | 'canceled';

export type MomoInitResult = {
  success: boolean;
  message: string;
  payment_url?: string;
  order_id?: string;
};

export type MomoVerifyResult = {
  success: boolean;
  status: PaymentStatusType;
  orderId: string | null;
};

export type MomoCallbackResult = {
  status: PaymentStatusType;
  code: number | string;
  message?: string;
  order_id?: string | null;
  created_at?: Date | null;
};

export const momoService = {
  /**  Khởi tạo thanh toán MoMo */
  async initiateMoMo(data: any): Promise<MomoInitResult> {
    if (!data.payment_method || data.payment_method.toUpperCase() !== 'MOMO') {
      throw new Error('Phương thức thanh toán không hợp lệ (phải là MOMO)');
    }

    const { order, orderId, amount, breakdown, response } = await prisma.$transaction(
      async (tx) => {
        const user = await tx.users.findUnique({
          where: { id: data.user_id },
          select: { full_name: true, phone: true },
        });
        if (!user) throw new Error('Không tìm thấy user');

        // ============================
        // 1) TÍNH TỔNG TIỀN MÓN + TOPPING
        // ============================
        const totalItems = data.items.reduce((sum: number, item: any) => {
          const toppingTotal = (item.selected_option_items ?? []).reduce(
            (acc: number, top: any) => acc + (top.price ?? 0),
            0,
          );
          return sum + (item.price + toppingTotal) * item.quantity;
        }, 0);

        const deliveryFee = data.delivery_fee || 0;

        let beforeItems = totalItems;
        let afterItems = totalItems;

        let beforeDelivery = deliveryFee;
        let afterDelivery = deliveryFee;

        let beforeTotal = totalItems + deliveryFee;
        let afterTotal = beforeTotal;

        let discountValue = 0;
        let discount = 0;

        let voucherRecord: any = null;
        let applyType: 'TOTAL' | 'DELIVERY' | 'MERCHANT' | null = null;

        // ============================
        // 2) XỬ LÝ VOUCHER (GIỐNG COD 100%)
        // ============================
        if (data.voucher) {
          voucherRecord = await tx.voucher.findUnique({
            where: { code: data.voucher },
          });
          if (!voucherRecord) throw new Error('Voucher không tồn tại');
          if (!voucherRecord.is_active) throw new Error('Voucher đã hết hiệu lực');

          const now = new Date();
          if (now < voucherRecord.start_date || now > voucherRecord.end_date) {
            throw new Error('Voucher không còn hiệu lực');
          }

          applyType = voucherRecord.apply_type;

          // ⭐ DELIVERY
          if (applyType === 'DELIVERY') {
            const conditionBase = beforeItems + beforeDelivery;
            let discountRaw = 0;

            if (conditionBase >= (voucherRecord.min_order_value ?? 0)) {
              const shipBase = deliveryFee;

              if (voucherRecord.discount_type === 'AMOUNT') {
                discountRaw = voucherRecord.discount_value;
              } else {
                discountRaw = (shipBase * voucherRecord.discount_value) / 100;
                if (voucherRecord.max_discount) {
                  discountRaw = Math.min(discountRaw, voucherRecord.max_discount);
                }
              }

              discount = Math.min(discountRaw, shipBase);
            }

            afterDelivery = Math.max(0, deliveryFee - discount);
            afterItems = beforeItems;
            discountValue = beforeDelivery - afterDelivery;
          }
          // ⭐ MERCHANT
          else if (applyType === 'MERCHANT') {
            const isAllowed = await tx.voucher_merchant.findFirst({
              where: {
                voucher_id: voucherRecord.id,
                merchant_id: data.merchant_id,
              },
            });
            if (!isAllowed) throw new Error('Voucher không áp dụng cho merchant này');

            let target = totalItems;

            if (target >= (voucherRecord.min_order_value ?? 0)) {
              if (voucherRecord.discount_type === 'AMOUNT') {
                discount = voucherRecord.discount_value;
              } else {
                discount = (target * voucherRecord.discount_value) / 100;
                if (voucherRecord.max_discount) {
                  discount = Math.min(discount, voucherRecord.max_discount);
                }
              }
            }

            afterItems = Math.max(0, totalItems - discount);
            afterDelivery = beforeDelivery;
            discountValue = beforeItems - afterItems;
          }
          // ⭐ TOTAL
          else if (applyType === 'TOTAL') {
            let target = beforeTotal;

            if (target >= (voucherRecord.min_order_value ?? 0)) {
              if (voucherRecord.discount_type === 'AMOUNT') {
                discount = voucherRecord.discount_value;
              } else {
                discount = (target * voucherRecord.discount_value) / 100;
                if (voucherRecord.max_discount) {
                  discount = Math.min(discount, voucherRecord.max_discount);
                }
              }
            }

            afterTotal = Math.max(0, target - discount);
            discountValue = target - afterTotal;
          }
        }

        // ⭐ FINAL AMOUNT giống COD
        let finalAmount = 0;
        if (applyType === 'TOTAL') {
          finalAmount = afterTotal;
        } else {
          finalAmount = afterItems + afterDelivery;
          afterTotal = finalAmount;
        }

        // ============================
        // 3) TẠO ORDER
        // ============================
        const existing = await tx.order.findFirst({
          where: {
            user_id: data.user_id,
            merchant_id: data.merchant_id,
            status: 'PENDING',
            status_payment: 'PENDING',
            payment_method: { in: ['VNPAY', 'MOMO'] },
          },
        });

        let order;
        if (existing) {
          await tx.order_item.deleteMany({ where: { order_id: existing.id } });
          order = await tx.order.update({
            where: { id: existing.id },
            data: {
              payment_method: 'MOMO',
              total_amount: BigInt(finalAmount),
              delivery_address: data.delivery_address,
              delivery_fee: BigInt(deliveryFee),
              note: data.note ?? existing.note,
              voucher_id: voucherRecord?.id ?? null,
              updated_at: new Date(),
            },
          });
        } else {
          order = await tx.order.create({
            data: {
              user_id: data.user_id,
              merchant_id: data.merchant_id,
              full_name: user.full_name || '',
              phone: user.phone,
              delivery_address: data.delivery_address,
              delivery_fee: BigInt(deliveryFee),
              note: data.note ?? null,
              total_amount: BigInt(finalAmount),
              status: 'DELIVERING',
              status_payment: 'PENDING',
              payment_method: 'MOMO',
              voucher_id: voucherRecord?.id ?? null,
            },
          });
        }

        // ============================
        // 4) TẠO ORDER ITEMS + OPTIONS
        // ============================
        for (const item of data.items) {
          const orderItem = await tx.order_item.create({
            data: {
              order_id: order.id,
              menu_item_id: item.menu_item_id,
              quantity: item.quantity,
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

        // ============================
        // 5) TẠO PAYLOAD MoMo VỚI AMOUNT = finalAmount
        // ============================
        const momoOrderId = MOMO_CONFIG.partnerCode + Date.now();
        const requestId = momoOrderId;
        const orderInfo = `Thanh toán đơn hàng ${order.id}`;

        const rawSignature =
          `accessKey=${MOMO_CONFIG.accessKey}` +
          `&amount=${finalAmount}` +
          `&extraData=` +
          `&ipnUrl=${MOMO_CONFIG.ipnUrl}` +
          `&orderId=${momoOrderId}` +
          `&orderInfo=${orderInfo}` +
          `&partnerCode=${MOMO_CONFIG.partnerCode}` +
          `&redirectUrl=${MOMO_CONFIG.redirectUrl}` +
          `&requestId=${requestId}` +
          `&requestType=${MOMO_CONFIG.requestType}`;

        const signature = crypto
          .createHmac('sha256', MOMO_CONFIG.secretKey)
          .update(rawSignature)
          .digest('hex');

        const requestBody = JSON.stringify({
          partnerCode: MOMO_CONFIG.partnerCode,
          partnerName: 'BaDaFuTa',
          storeId: 'BaDaFuTaStore',
          requestId,
          amount: finalAmount,
          orderId: momoOrderId,
          orderInfo,
          redirectUrl: MOMO_CONFIG.redirectUrl,
          ipnUrl: MOMO_CONFIG.ipnUrl,
          lang: 'vi',
          requestType: MOMO_CONFIG.requestType,
          autoCapture: true,
          extraData: '',
          signature,
        });

        const response: any = await new Promise((resolve, reject) => {
          const req = https.request(
            {
              hostname: 'test-payment.momo.vn',
              port: 443,
              path: '/v2/gateway/api/create',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
              },
            },
            (res) => {
              let body = '';
              res.on('data', (c) => (body += c));
              res.on('end', () => resolve(JSON.parse(body)));
            },
          );

          req.on('error', reject);
          req.write(requestBody);
          req.end();
        });

        await tx.payment_transaction.create({
          data: {
            user_id: data.user_id,
            merchant_id: data.merchant_id,
            order_id: order.id,
            amount: BigInt(finalAmount),
            payment_method: 'MOMO',
            txn_ref: momoOrderId,
            raw_payload: data,
            status: 'PENDING',
          },
        });

        return {
          order,
          orderId: momoOrderId,
          amount: finalAmount,
          breakdown: {
            apply_type: applyType,
            voucher_code: voucherRecord?.code ?? null,

            items_before: beforeItems,
            items_after: afterItems,

            delivery_before: beforeDelivery,
            delivery_after: afterDelivery,

            total_before: beforeTotal,
            total_after: afterTotal,

            discount_value: discountValue,
          },
          response,
        };
      },
    );

    return {
      success: true,
      message: 'Khởi tạo thanh toán MOMO thành công',
      payment_url: response.payUrl,
      order_id: order.id,
    };
  },

  /**  Xác minh trạng thái MoMo */
  async verifyMomoTransaction(params: any): Promise<MomoVerifyResult> {
    if (!params.orderId) return { success: false, status: 'failed', orderId: null };

    const txn = await prisma.payment_transaction.findFirst({
      where: { txn_ref: String(params.orderId) },
    });

    if (txn && txn.status === 'SUCCESS') {
      return { success: true, status: 'success', orderId: txn.order_id };
    }

    if (txn && txn.status === 'CANCELED') {
      return { success: false, status: 'canceled', orderId: txn.order_id };
    }

    return { success: false, status: 'failed', orderId: txn?.order_id ?? null };
  },

  /** 🔹 Callback từ MoMo */
  async handleMomoCallback(params: any): Promise<MomoCallbackResult> {
    const { resultCode, orderId, message } = params;
    const code = Number(resultCode);

    // 🔎 Tìm transaction & order liên quan
    const txn = await prisma.payment_transaction.findFirst({
      where: { txn_ref: String(orderId) },
      include: { order: true },
    });

    if (!txn || !txn.order_id) {
      console.warn('❌ Không tìm thấy transaction hợp lệ cho MoMo callback:', orderId);
      return { status: 'failed', code, message };
    }

    const order = txn.order;
    const orderIdStr = txn.order_id;
    const createdAt = order?.created_at ?? null;

    if (code === 0) {
      // Update transaction
      await prisma.payment_transaction.update({
        where: {
          order_id_txn_ref: {
            order_id: txn.order_id,
            txn_ref: String(orderId),
          },
        },
        data: { status: 'SUCCESS' },
      });

      await prisma.order.update({
        where: { id: txn.order_id },
        data: { status_payment: 'SUCCESS', status: 'PENDING' },
      });

      await prisma.payment_transaction.updateMany({
        where: {
          order_id: txn.order_id,
          payment_method: { not: 'MOMO' },
          status: 'PENDING',
        },
        data: { status: 'FAILED' },
      });

      await momoRepository.updateAfterCallback(String(orderId), {
        status: 'success',
        response_code: String(resultCode),
        transaction_no: String(params.transId || orderId),
      });

      // ⭐ Lấy full order (template giống COD)
      const full = await momoRepository.getFullOrder(orderIdStr);

      // ⭐ Gắn thêm 2 field bắt buộc của MomoCallbackResult
      return {
        ...full,
        code,
        status: 'success',
      };
    }

    // ❌ Thất bại
    await prisma.payment_transaction.updateMany({
      where: { txn_ref: String(orderId) },
      data: { status: 'FAILED' },
    });

    await momoRepository.updateAfterCallback(String(orderId), {
      status: 'failed',
      response_code: String(resultCode),
      transaction_no: String(params.transId || orderId),
    });

    return {
      status: 'failed',
      code,
      message,
      order_id: orderIdStr,
      created_at: createdAt,
    };
  },
};
