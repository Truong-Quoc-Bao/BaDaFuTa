// src/modules/momo/momo.service.ts
import crypto from "crypto";
import https from "https";
import { prisma } from "@/libs/prisma";
import { momoRepository } from "./momo.repository";

/**Cấu hình MoMo */
const MOMO_CONFIG = {
  accessKey: process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85",
  secretKey: process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  partnerCode: process.env.MOMO_PARTNER_CODE || "MOMO",
  redirectUrl:
    process.env.MOMO_RETURN_URL || "http://localhost:3000/api/momo/return",
  ipnUrl: process.env.MOMO_IPN_URL || "http://localhost:3000/api/momo/callback",
  requestType: "payWithMethod",
};

export type PaymentStatusType = "success" | "failed" | "canceled";

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
    if (!data.payment_method || data.payment_method.toUpperCase() !== "MOMO") {
      throw new Error("Phương thức thanh toán không hợp lệ (phải là MOMO)");
    }

    const { order, orderId, amount, response } = await prisma.$transaction(
      async (tx) => {
        const user = await tx.users.findUnique({
          where: { id: data.user_id },
          select: { full_name: true, phone: true },
        });
        if (!user) throw new Error("Không tìm thấy user");

        // ============================
        // 1) TÍNH TỔNG TIỀN CÓ TOPPING
        // ============================
        const totalItems = data.items.reduce((sum: number, item: any) => {
          const toppingTotal = (item.selected_option_items ?? []).reduce(
            (acc: number, top: any) => acc + (top.price ?? 0),
            0
          );
          return sum + (item.price + toppingTotal) * item.quantity;
        }, 0);

        const amount = totalItems + (data.delivery_fee || 0);

        // ============================
        // 2) TÌM HOẶC TẠO ORDER PENDING
        // ============================
        let order = await tx.order.findFirst({
          where: {
            user_id: data.user_id,
            merchant_id: data.merchant_id,
            status: "PENDING",
            status_payment: "PENDING",
            payment_method: { in: ["VNPAY", "MOMO"] },
          },
        });

        if (order) {
          await tx.order_item.deleteMany({ where: { order_id: order.id } });

          order = await tx.order.update({
            where: { id: order.id },
            data: {
              payment_method: "MOMO",
              total_amount: BigInt(amount),
              delivery_address: data.delivery_address,
              delivery_fee: BigInt(data.delivery_fee || 0),
              note: data.note ?? order.note,
              updated_at: new Date(),
            },
          });
        } else {
          order = await tx.order.create({
            data: {
              user_id: data.user_id,
              merchant_id: data.merchant_id,
              full_name: user.full_name || "",
              phone: user.phone,
              delivery_address: data.delivery_address,
              delivery_fee: BigInt(data.delivery_fee || 0),
              note: data.note ?? null,
              total_amount: BigInt(amount),
              status: "DELIVERING",
              status_payment: "PENDING",
              payment_method: "MOMO",
            },
          });
        }

        // ============================
        // 3) TẠO ORDER ITEMS + OPTIONS
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

          // FE gửi [{ option_item_id, price }]
          const optionIds =
            item.selected_option_items?.map((o: any) => o.option_item_id) ?? [];

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
        // 4) TẠO PAYLOAD MOMO
        // ============================
        const momoOrderId = MOMO_CONFIG.partnerCode + Date.now();
        const requestId = momoOrderId;
        const orderInfo = `Thanh toán đơn hàng ${order.id}`;

        const rawSignature =
          `accessKey=${MOMO_CONFIG.accessKey}` +
          `&amount=${amount}` +
          `&extraData=` +
          `&ipnUrl=${MOMO_CONFIG.ipnUrl}` +
          `&orderId=${momoOrderId}` +
          `&orderInfo=${orderInfo}` +
          `&partnerCode=${MOMO_CONFIG.partnerCode}` +
          `&redirectUrl=${MOMO_CONFIG.redirectUrl}` +
          `&requestId=${requestId}` +
          `&requestType=${MOMO_CONFIG.requestType}`;

        const signature = crypto
          .createHmac("sha256", MOMO_CONFIG.secretKey)
          .update(rawSignature)
          .digest("hex");

        const requestBody = JSON.stringify({
          partnerCode: MOMO_CONFIG.partnerCode,
          partnerName: "BaDaFuTa",
          storeId: "BaDaFuTaStore",
          requestId,
          amount,
          orderId: momoOrderId,
          orderInfo,
          redirectUrl: MOMO_CONFIG.redirectUrl,
          ipnUrl: MOMO_CONFIG.ipnUrl,
          lang: "vi",
          requestType: MOMO_CONFIG.requestType,
          autoCapture: true,
          extraData: "",
          signature,
        });

        const response: any = await new Promise((resolve, reject) => {
          const req = https.request(
            {
              hostname: "test-payment.momo.vn",
              port: 443,
              path: "/v2/gateway/api/create",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
              },
            },
            (res) => {
              let body = "";
              res.on("data", (c) => (body += c));
              res.on("end", () => resolve(JSON.parse(body)));
            }
          );

          req.on("error", reject);
          req.write(requestBody);
          req.end();
        });

        await tx.payment_transaction.create({
          data: {
            user_id: data.user_id,
            merchant_id: data.merchant_id,
            order_id: order.id,
            amount: BigInt(amount),
            payment_method: "MOMO",
            txn_ref: momoOrderId,
            raw_payload: data,
            status: "PENDING",
          },
        });

        return { order, orderId: momoOrderId, amount, response };
      }
    );

    return {
      success: true,
      message: "Khởi tạo thanh toán MOMO thành công",
      payment_url: response.payUrl,
      order_id: order.id,
    };
  },
  /**  Xác minh trạng thái MoMo */
  async verifyMomoTransaction(params: any): Promise<MomoVerifyResult> {
    if (!params.orderId)
      return { success: false, status: "failed", orderId: null };

    const txn = await prisma.payment_transaction.findFirst({
      where: { txn_ref: String(params.orderId) },
    });

    if (txn && txn.status === "SUCCESS") {
      return { success: true, status: "success", orderId: txn.order_id };
    }

    if (txn && txn.status === "CANCELED") {
      return { success: false, status: "canceled", orderId: txn.order_id };
    }

    return { success: false, status: "failed", orderId: txn?.order_id ?? null };
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
      console.warn(
        "❌ Không tìm thấy transaction hợp lệ cho MoMo callback:",
        orderId
      );
      return { status: "failed", code, message };
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
        data: { status: "SUCCESS" },
      });

      await prisma.order.update({
        where: { id: txn.order_id },
        data: { status_payment: "SUCCESS", status: "PENDING" },
      });

      await prisma.payment_transaction.updateMany({
        where: {
          order_id: txn.order_id,
          payment_method: { not: "MOMO" },
          status: "PENDING",
        },
        data: { status: "FAILED" },
      });

      await momoRepository.updateAfterCallback(String(orderId), {
        status: "success",
        response_code: String(resultCode),
        transaction_no: String(params.transId || orderId),
      });

      // ⭐ Lấy full order (template giống COD)
      const full = await momoRepository.getFullOrder(orderIdStr);

      // ⭐ Gắn thêm 2 field bắt buộc của MomoCallbackResult
      return {
        ...full,
        code,
        status: "success",
      };
    }

    // ❌ Thất bại
    await prisma.payment_transaction.updateMany({
      where: { txn_ref: String(orderId) },
      data: { status: "FAILED" },
    });

    await momoRepository.updateAfterCallback(String(orderId), {
      status: "failed",
      response_code: String(resultCode),
      transaction_no: String(params.transId || orderId),
    });

    return {
      status: "failed",
      code,
      message,
      order_id: orderIdStr,
      created_at: createdAt,
    };
  },
};
