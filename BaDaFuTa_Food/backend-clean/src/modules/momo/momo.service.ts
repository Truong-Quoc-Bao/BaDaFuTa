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
    process.env.MOMO_RETURN_URL ||
    "http://localhost:5173/cart/checkout/ordersuccess",
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
};

export const momoService = {
  /**  Khởi tạo thanh toán MoMo */
  async initiateMoMo(data: any): Promise<MomoInitResult> {
    if (!data.payment_method || data.payment_method.toUpperCase() !== "MOMO") {
      throw new Error("Phương thức thanh toán không hợp lệ (phải là MOMO)");
    }

    // ✅ Transaction để đảm bảo atomic
    const { order, orderId, amount, response } = await prisma.$transaction(
      async (tx) => {
        // Lấy user
        const user = await tx.users.findUnique({
          where: { id: data.user_id },
          select: { full_name: true, phone: true },
        });
        if (!user) throw new Error("Không tìm thấy user");

        // Tổng tiền
        const total = data.items.reduce(
          (sum: number, i: any) => sum + i.quantity * i.price,
          0
        );
        const amount = total + (data.delivery_fee || 0);

        // Tìm hoặc tạo order pending
        let order = await prisma.order.findFirst({
          where: {
            user_id: data.user_id,
            merchant_id: data.merchant_id,
            status: "PENDING",
            status_payment: "PENDING",
            payment_method: { in: ["VNPAY", "MOMO"] },
          },
        });

        if (order) {
          // Xóa item cũ
          await tx.order_item.deleteMany({ where: { order_id: order.id } });
          order = await tx.order.update({
            where: { id: order.id },
            data: {
              payment_method: "MOMO",
              total_amount: BigInt(amount),
              note: data.note ?? order.note,
            },
          });
        } else {
          order = await tx.order.create({
            data: {
              user_id: data.user_id,
              merchant_id: data.merchant_id,
              full_name: user?.full_name || "",
              phone: user?.phone,
              delivery_address: data.delivery_address,
              delivery_fee: data.delivery_fee,
              note: data.note,
              total_amount: BigInt(amount),
              status: "PENDING",
              status_payment: "PENDING",
              payment_method: "MOMO",
            },
          });
        }

        // ✅ Thêm order_item & order_item_option
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

          if (item.selected_option_items?.length) {
            const validOptions = await tx.option_item.findMany({
              where: { id: { in: item.selected_option_items } },
              select: { id: true },
            });
            await tx.order_item_option.createMany({
              data: validOptions.map((opt) => ({
                order_item_id: orderItem.id,
                option_item_id: opt.id,
              })),
            });
          }
        }

        // Tạo MoMo payload
        const orderId = MOMO_CONFIG.partnerCode + new Date().getTime();
        const requestId = orderId;
        const orderInfo = `Thanh toán đơn hàng ${order.id}`;
        const rawSignature =
          `accessKey=${MOMO_CONFIG.accessKey}` +
          `&amount=${amount}` +
          `&extraData=` +
          `&ipnUrl=${MOMO_CONFIG.ipnUrl}` +
          `&orderId=${orderId}` +
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
          orderId,
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
              res.on("data", (chunk) => (body += chunk));
              res.on("end", () => {
                try {
                  resolve(JSON.parse(body));
                } catch (err) {
                  reject(err);
                }
              });
            }
          );

          req.on("error", reject);
          req.write(requestBody);
          req.end();
        });

        // Tạo transaction
        await tx.payment_transaction.create({
          data: {
            user_id: data.user_id,
            merchant_id: data.merchant_id,
            order_id: order.id,
            amount: BigInt(amount),
            payment_method: "MOMO",
            txn_ref: orderId,
            raw_payload: data,
            status: "PENDING",
          },
        });

        return { order, orderId, amount, response };
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

  /** Callback từ MoMo */
  async handleMomoCallback(params: any): Promise<MomoCallbackResult> {
    const { resultCode, orderId, message } = params;
    const code = Number(resultCode);

    if (code === 0) {
      const txn = await prisma.payment_transaction.findFirst({
        where: { txn_ref: String(orderId) },
        include: { order: true },
      });

      if (!txn || !txn.order_id)
        throw new Error("Không tìm thấy transaction hợp lệ");

      // Cập nhật transaction thành công
      await prisma.payment_transaction.update({
        where: {
          order_id_txn_ref: {
            order_id: txn.order_id,
            txn_ref: String(orderId),
          },
        },
        data: { status: "SUCCESS" },
      });

      // Cập nhật order: payment thành công
      await prisma.order.update({
        where: { id: txn.order_id },
        data: { status_payment: "SUCCESS", status: "PENDING" },
      });

      //Huỷ các transaction khác cùng order
      await prisma.payment_transaction.updateMany({
        where: {
          order_id: txn.order_id,
          payment_method: { not: "MOMO" },
          status: "PENDING",
        },
        data: { status: "FAILED" },
      });

      // Cập nhật lại transaction
      await momoRepository.updateAfterCallback(String(orderId), {
        status: "success",
        response_code: String(resultCode),
        transaction_no: String(params.transId || orderId),
      });

      return { status: "success", code, message };
    }

    // Trường hợp thất bại
    await prisma.payment_transaction.updateMany({
      where: { txn_ref: String(orderId) },
      data: { status: "FAILED" },
    });

    await momoRepository.updateAfterCallback(String(orderId), {
      status: "failed",
      response_code: String(resultCode),
      transaction_no: String(params.transId || orderId),
    });

    return { status: "failed", code, message };
  },
};
