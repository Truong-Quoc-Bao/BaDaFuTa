import crypto from "crypto";
import moment from "moment";
import { prisma } from "@/libs/prisma";
import { paymentRepository } from "./payment.repository";

function vnpEncode(v: string) {
  return encodeURIComponent(v).replace(/%20/g, "+");
}

export const paymentService = {
  /** 🔹 Tạo order + transaction + trả link VNPAY */
  async initiateVNPAY(data: any) {
    if (!data.payment_method || data.payment_method.toUpperCase() !== "VNPAY") {
      throw new Error("Phương thức thanh toán không hợp lệ (phải là VNPAY)");
    }

    // Lấy thông tin user
    const user = await prisma.users.findUnique({
      where: { id: data.user_id },
      select: { full_name: true, phone: true },
    });

    // Tính tổng tiền
    const total = data.items.reduce(
      (sum: number, i: any) => sum + i.quantity * i.price,
      0
    );
    const total_amount = BigInt(total + (data.delivery_fee || 0));

    let order: any;
    let txn_ref: string = "";

    // Gói toàn bộ trong transaction
    await prisma.$transaction(async (tx) => {
      // 🔹 Tìm đơn hàng đang chờ thanh toán qua VNPAY hoặc MOMO
      const pendingOrder = await tx.order.findFirst({
        where: {
          user_id: data.user_id,
          merchant_id: data.merchant_id,
          status_payment: "PENDING",
          payment_method: { in: ["VNPAY", "MOMO"] },
        },
      });

      if (pendingOrder) {
        // 🧹 Xóa order_items cũ
        await tx.order_item.deleteMany({
          where: { order_id: pendingOrder.id },
        });

        // ⚙️ Cập nhật lại order (giữ nguyên payment_method cũ)
        order = await tx.order.update({
          where: { id: pendingOrder.id },
          data: {
            total_amount,
            note: data.note ?? pendingOrder.note,
            delivery_address: data.delivery_address,
            delivery_fee: BigInt(data.delivery_fee || 0),
            updated_at: new Date(),
          },
        });
        // 🧾 Tạo lại order_items và order_item_option
        for (const item of data.items) {
          // 1️⃣ Tạo order_item
          const orderItem = await tx.order_item.create({
            data: {
              order_id: order.id,
              menu_item_id: item.menu_item_id,
              quantity: BigInt(item.quantity),
              price: BigInt(item.price),
              note: item.note ?? null,
            },
          });

          // 2️⃣ Tạo các order_item_option (nếu có)
          if (
            item.selected_option_items &&
            item.selected_option_items.length > 0
          ) {
            await tx.order_item_option.createMany({
              data: item.selected_option_items.map((optId: string) => ({
                order_item_id: orderItem.id,
                option_item_id: optId,
              })),
            });
          }
        }
      } else {
        // 🚀 Tạo order mới hoàn toàn nếu không có đơn chờ phù hợp
        order = await paymentRepository.createOrder(tx, {
          user_id: data.user_id,
          merchant_id: data.merchant_id,
          full_name: user?.full_name || "",
          phone: user?.phone || "",
          delivery_address: data.delivery_address,
          delivery_fee: BigInt(data.delivery_fee || 0),
          note: data.note ?? null,
          total_amount,
          payment_method: "VNPAY",
          items: data.items,
        });
      }

      // 🔹 Sinh mã giao dịch
      txn_ref = `ORD-${order.id}-${Date.now()}`;

      // 🔹 Lưu transaction
      await paymentRepository.createTransaction(tx, {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        order_id: order.id,
        amount: order.total_amount,
        payment_method: "VNPAY",
        txn_ref,
        raw_payload: data,
      });
    });

    // ✅ Sinh link VNPAY sau khi transaction đã lưu
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

    return {
      success: true,
      message: "Khởi tạo thanh toán VNPAY thành công",
      payment_url: paymentUrl,
      order_id: order.id,
    };
  },

  /** 🔹 Callback từ VNPAY */
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

    if (isValid && responseCode === "00") {
      await paymentRepository.updateAfterCallback(txnRef, {
        status: "success",
        response_code: responseCode,
        transaction_no: params["vnp_TransactionNo"],
      });
      return { status: "success", code: responseCode };
    } else {
      await paymentRepository.updateAfterCallback(txnRef, {
        status: "failed",
        response_code: responseCode,
      });
      return { status: "failed", code: responseCode };
    }
  },
};
