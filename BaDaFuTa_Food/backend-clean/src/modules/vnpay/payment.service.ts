import crypto from "crypto";
import moment from "moment";
import { paymentRepository } from "./payment.repository";
import { prisma } from "@/libs/prisma";

/** Helper encode */
function vnpEncode(v: string) {
  return encodeURIComponent(v).replace(/%20/g, "+");
}

export const paymentService = {
  /** 🔹 Tạo order + transaction + trả link VNPAY */
  async initiateVNPAY(data: any) {
    // 1️⃣ Tính tổng tiền
    const total = data.items.reduce(
      (sum: number, i: any) => sum + i.quantity * i.price,
      0
    );

    // 2️⃣ Kiểm tra xem user có đơn pending/unpaid chưa thanh toán
    const pendingOrder = await paymentRepository.findPendingOrder(
      data.user_id,
      data.merchant_id
    );

    let order;

    if (pendingOrder) {
      // So sánh món cũ & mới
      const oldItems = JSON.stringify(
        pendingOrder.items.map((i) => ({
          menu_item_id: i.menu_item_id,
          quantity: Number(i.quantity),
          price: Number(i.price),
        }))
      );
      const newItems = JSON.stringify(data.items);

      if (oldItems === newItems) {
        // 🔁 Reuse lại đơn cũ
        order = pendingOrder;
      } else {
        // 🗑 Huỷ đơn cũ nếu khác món
        await paymentRepository.cancelOrder(pendingOrder.id);

        // 🚀 Tạo đơn mới
        order = await prisma.$transaction(async (tx) =>
          paymentRepository.createOrder(tx, {
            ...data,
            total_amount: BigInt(total + data.delivery_fee),
            status: "pending",
            status_payment: "unpaid",
            payment_method: "VNPAY",
            full_name: "Khách hàng VNPAY",
          })
        );
      }
    } else {
      // 🚀 Không có đơn pending nào → tạo mới
      order = await prisma.$transaction(async (tx) =>
        paymentRepository.createOrder(tx, {
          ...data,
          total_amount: BigInt(total + data.delivery_fee),
          status: "pending",
          status_payment: "unpaid",
          payment_method: "VNPAY",
          full_name: "Khách hàng VNPAY",
        })
      );
    }

    // 3️⃣ Sinh link VNPAY
    const txn_ref = `ORD-${order.id}-${Date.now()}`;
    const createDate = moment().format("YYYYMMDDHHmmss");

    const vnpTmnCode = process.env.VNP_TMN_CODE!;
    const vnpHashSecret = process.env.VNP_HASH_SECRET!;
    const vnpBaseUrl = process.env.VNP_URL!;
    const vnpReturnUrl = process.env.VNP_RETURN_URL!;

    const amountVnp = (Number(order.total_amount) * 100).toString();
    const baseParams: Record<string, string> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnpTmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: txn_ref,
      vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
      vnp_OrderType: "billpayment",
      vnp_Amount: amountVnp,
      vnp_ReturnUrl: vnpReturnUrl,
      vnp_IpAddr: "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    const signData = Object.keys(baseParams)
      .sort()
      .map(
        (k) => `${k}=${encodeURIComponent(baseParams[k]).replace(/%20/g, "+")}`
      )
      .join("&");

    const secureHash = crypto
      .createHmac("sha512", vnpHashSecret)
      .update(signData, "utf-8")
      .digest("hex");

    const paymentUrl = `${vnpBaseUrl}?${signData}&vnp_SecureHash=${secureHash}`;

    // 4️⃣ Lưu transaction
    await prisma.$transaction(async (tx) =>
      paymentRepository.createTransaction(tx, {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        order_id: order.id,
        amount: order.total_amount,
        payment_method: "VNPAY",
        txn_ref,
        status: "PENDING",
        raw_payload: data,
      })
    );

    return { payment_url: paymentUrl, order_id: order.id };
  },

  /** 🔹 Xử lý callback từ VNPAY */
  async handleVnpayCallback(params: Record<string, any>) {
    const vnpHashSecret = process.env.VNP_HASH_SECRET!;

    const input: Record<string, string> = {};
    Object.keys(params).forEach((k) => {
      if (k === "vnp_SecureHash" || k === "vnp_SecureHashType") return;
      const val = params[k];
      if (typeof val === "string") input[k] = val;
      else if (Array.isArray(val)) input[k] = val.join(",");
    });

    const signData = Object.keys(input)
      .sort()
      .map((k) => `${k}=${vnpEncode(input[k])}`)
      .join("&");

    const calculatedHash = crypto
      .createHmac("sha512", vnpHashSecret)
      .update(signData, "utf-8")
      .digest("hex");

    const receivedHash = params["vnp_SecureHash"] as string;
    const isValid = calculatedHash === receivedHash;

    const responseCode = params["vnp_ResponseCode"];
    const txnRef = params["vnp_TxnRef"];
    const transactionNo = params["vnp_TransactionNo"];

    if (isValid && responseCode === "00") {
      await paymentRepository.updateAfterCallback(txnRef, {
        status: "success",
        response_code: responseCode,
        transaction_no: transactionNo,
      });
      return { status: "success", code: responseCode };
    } else {
      await paymentRepository.updateAfterCallback(txnRef, {
        status: "failed",
        response_code: responseCode ?? "ERR",
        transaction_no: transactionNo,
      });
      return { status: "failed", code: responseCode };
    }
  },
};
