// import crypto from "crypto";
// import https from "https";
// import { prisma } from "@/libs/prisma";
// import { paymentRepository } from "../vnpay/payment.repository";

// const MOMO_CONFIG = {
//   accessKey: "F8BBA842ECF85",
//   secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
//   partnerCode: "MOMO",
//   redirectUrl:
//     process.env.MOMO_RETURN_URL ||
//     "http://localhost:5173/cart/checkout/ordersuccess",
//   ipnUrl: process.env.MOMO_IPN_URL || "http://localhost:3000/api/momo/callback",
//   requestType: "payWithMethod",
// };

// export const momoService = {
//   /** 🔹 Tạo transaction + trả link MoMo */
//   async initiateMoMo(data: any) {
//     if (!data.payment_method || data.payment_method.toUpperCase() !== "MOMO") {
//       throw new Error("Phương thức thanh toán không hợp lệ (phải là MOMO)");
//     }

//     const user = await prisma.users.findUnique({
//       where: { id: data.user_id },
//       select: { full_name: true, phone: true },
//     });

//     const total = data.items.reduce(
//       (sum: number, i: any) => sum + i.quantity * i.price,
//       0
//     );
//     const total_amount = BigInt(total + (data.delivery_fee || 0));

//     // Tìm order pending
//     let order = await prisma.order.findFirst({
//       where: {
//         user_id: data.user_id,
//         merchant_id: data.merchant_id,
//         status: "PENDING",
//       },
//     });

//     if (order) {
//       order = await prisma.order.update({
//         where: { id: order.id },
//         data: {
//           payment_method: "MOMO",
//           total_amount,
//           note: data.note ?? order.note,
//         },
//       });
//     } else {
//       order = await prisma.order.create({
//         data: {
//           user_id: data.user_id,
//           merchant_id: data.merchant_id,
//           full_name: user?.full_name || "",
//           phone: user?.phone,
//           delivery_address: data.delivery_address,
//           delivery_fee: data.delivery_fee,
//           note: data.note,
//           total_amount,
//           status: "PENDING",
//           status_payment: "PENDING",
//           payment_method: "MOMO",
//         },
//       });
//     }

//     // Sinh chữ ký và request body
//     const orderId = MOMO_CONFIG.partnerCode + new Date().getTime();
//     const requestId = orderId;
//     const orderInfo = `Thanh toán đơn hàng ${order.id}`;
//     const extraData = "";

//     const rawSignature =
//       `accessKey=${MOMO_CONFIG.accessKey}` +
//       `&amount=${Number(total_amount)}` +
//       `&extraData=${extraData}` +
//       `&ipnUrl=${MOMO_CONFIG.ipnUrl}` +
//       `&orderId=${orderId}` +
//       `&orderInfo=${orderInfo}` +
//       `&partnerCode=${MOMO_CONFIG.partnerCode}` +
//       `&redirectUrl=${MOMO_CONFIG.redirectUrl}` +
//       `&requestId=${requestId}` +
//       `&requestType=${MOMO_CONFIG.requestType}`;

//     const signature = crypto
//       .createHmac("sha256", MOMO_CONFIG.secretKey)
//       .update(rawSignature)
//       .digest("hex");

//     const requestBody = JSON.stringify({
//       partnerCode: MOMO_CONFIG.partnerCode,
//       partnerName: "BaDaFuTa",
//       storeId: "BaDaFuTaStore",
//       requestId,
//       amount: Number(total_amount),
//       orderId,
//       orderInfo,
//       redirectUrl: MOMO_CONFIG.redirectUrl,
//       ipnUrl: MOMO_CONFIG.ipnUrl,
//       lang: "vi",
//       requestType: MOMO_CONFIG.requestType,
//       autoCapture: true,
//       extraData,
//       signature,
//     });

//     // Gửi request đến MoMo
//     const response = await new Promise((resolve, reject) => {
//       const options = {
//         hostname: "test-payment.momo.vn",
//         port: 443,
//         path: "/v2/gateway/api/create",
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Content-Length": Buffer.byteLength(requestBody),
//         },
//       };
//       const req = https.request(options, (res) => {
//         let body = "";
//         res.on("data", (chunk) => (body += chunk));
//         res.on("end", () => {
//           try {
//             resolve(JSON.parse(body));
//           } catch (err) {
//             reject(err);
//           }
//         });
//       });
//       req.on("error", (e) => reject(e));
//       req.write(requestBody);
//       req.end();
//     });

//     // Tạo transaction
//     await prisma.payment_transaction.create({
//       data: {
//         user_id: data.user_id,
//         merchant_id: data.merchant_id,
//         order_id: order.id,
//         amount: total_amount,
//         payment_method: "MOMO",
//         txn_ref: orderId,
//         raw_payload: data,
//         status: "PENDING",
//       },
//     });

//     return {
//       success: true,
//       message: "Khởi tạo thanh toán MOMO thành công",
//       payment_url: (response as any).payUrl,
//       order_id: order.id,
//     };
//   },
//   /** 🔹 Callback từ MOMO */
//   async handleMomoCallback(params: any) {
//     const { resultCode, orderId, message } = params;

//     if (resultCode == 0) {
//       // 🔹 Tìm transaction theo txn_ref (orderId của MoMo = txn_ref)
//       const txn = await prisma.payment_transaction.findFirst({
//         where: { txn_ref: orderId },
//         include: { order: true },
//       });

//       if (!txn || !txn.order_id)
//         throw new Error("Không tìm thấy transaction hoặc order hợp lệ");

//       // 🔹 Cập nhật transaction thành công (dựa trên compound key)
//       await prisma.payment_transaction.update({
//         where: {
//           order_id_txn_ref: {
//             order_id: txn.order_id,
//             txn_ref: orderId,
//           },
//         },
//         data: { status: "SUCCESS" },
//       });

//       // 🔹 Cập nhật order
//       await prisma.order.update({
//         where: { id: txn.order_id },
//         data: { status_payment: "SUCCESS", status: "COMPLETED" },
//       });

//       // 🔹 Hủy tất cả transaction khác cổng MOMO
//       await prisma.payment_transaction.updateMany({
//         where: {
//           order_id: txn.order_id,
//           payment_method: { not: "MOMO" },
//           status: "PENDING",
//         },
//         data: { status: "FAILED" },
//       });

//       return { status: "success", code: resultCode, message };
//     } else {
//       // ❌ Giao dịch thất bại
//       await prisma.payment_transaction.updateMany({
//         where: { txn_ref: orderId },
//         data: { status: "FAILED" },
//       });
//       return { status: "failed", code: resultCode, message };
//     }
//   },
// };

// momo.service.ts (only key functions shown)
import crypto from "crypto";
import https from "https";
import { prisma } from "@/libs/prisma";
import { paymentRepository } from "../vnpay/payment.repository"; // or momoRepository

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

export const momoService = {
  // existing initiateMoMo(...) - ensure ipnUrl uses env/ngrok
  async initiateMoMo(data: any) {
    if (!data.payment_method || data.payment_method.toUpperCase() !== "MOMO") {
      throw new Error("Phương thức thanh toán không hợp lệ (phải là MOMO)");
    }

    // 1️⃣ Lấy thông tin user
    const user = await prisma.users.findUnique({
      where: { id: data.user_id },
      select: { full_name: true, phone: true },
    });

    // 2️⃣ Tính tổng tiền
    const total = data.items.reduce(
      (sum: number, i: any) => sum + i.quantity * i.price,
      0
    );
    const amount = total + (data.delivery_fee || 0);

    // 3️⃣ Tìm order đang pending của user + merchant
    let order = await prisma.order.findFirst({
      where: {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        status: "PENDING",
      },
    });

    // Nếu có thì update lại phương thức thanh toán → MOMO
    if (order) {
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          payment_method: "MOMO",
          total_amount: BigInt(amount),
          note: data.note ?? order.note,
        },
      });
    } else {
      // Nếu chưa có → tạo mới
      order = await prisma.order.create({
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

    // 4️⃣ Sinh orderId & requestId cho MoMo
    const orderId = MOMO_CONFIG.partnerCode + new Date().getTime();
    const requestId = orderId;
    const orderInfo = `Thanh toán đơn hàng ${order.id}`;
    const extraData = "";

    // 5️⃣ Tạo raw signature (chuẩn MoMo)
    const rawSignature =
      `accessKey=${MOMO_CONFIG.accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
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
      extraData,
      signature,
    });

    // 6️⃣ Gửi request HTTPS đến MoMo
    const response = await new Promise((resolve, reject) => {
      const options = {
        hostname: "test-payment.momo.vn",
        port: 443,
        path: "/v2/gateway/api/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(err);
          }
        });
      });

      req.on("error", (e) => reject(e));
      req.write(requestBody);
      req.end();
    });

    // 7️⃣ Lưu transaction vào DB
    await prisma.payment_transaction.create({
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

    // 8️⃣ Trả kết quả cho FE
    return {
      success: true,
      message: "Khởi tạo thanh toán MOMO thành công",
      payment_url: (response as any).payUrl,
      order_id: order.id,
    };
  },
  // Verify by DB (fast) or call MoMo query API (more secure)
  async verifyMomoTransaction(params: any) {
    // Option A: check DB transaction existing and status SUCCESS
    if (!params.orderId) return { success: false };
    const txn = await prisma.payment_transaction.findFirst({
      where: { txn_ref: String(params.orderId) },
    });
    if (txn && txn.status === "SUCCESS")
      return { success: true, orderId: txn.order_id };

    // Option B (optional): call MoMo Query API to verify server->server (recommended for prod)
    // Implement MoMo query API request here if you want (needs secret/accessKey).
    return { success: false };
  },

  async handleMomoCallback(params: any) {
    const { resultCode, orderId, message } = params;

    if (Number(resultCode) === 0) {
      // find txn
      const txn = await prisma.payment_transaction.findFirst({
        where: { txn_ref: String(orderId) },
        include: { order: true },
      });

      if (!txn || !txn.order_id) {
        console.error(
          "MoMo callback: transaction not found for txn_ref",
          orderId
        );
        throw new Error("Transaction not found");
      }

      // update transaction (using compound unique if applicable)
      await prisma.payment_transaction.update({
        where: {
          order_id_txn_ref: {
            order_id: txn.order_id,
            txn_ref: String(orderId),
          },
        },
        data: { status: "SUCCESS" },
      });

      // update order: mark paid & completed
      await prisma.order.update({
        where: { id: txn.order_id },
        data: { status_payment: "SUCCESS", status: "COMPLETED" },
      });

      // mark other pending transactions for same order as FAILED
      await prisma.payment_transaction.updateMany({
        where: {
          order_id: txn.order_id,
          payment_method: { not: "MOMO" },
          status: "PENDING",
        },
        data: { status: "FAILED" },
      });

      // optional: call paymentRepository.updateAfterCallback to record response_code etc
      await paymentRepository.updateAfterCallback(String(orderId), {
        status: "success",
        response_code: String(resultCode),
        transaction_no: String(params.transId || orderId),
      });

      return { status: "success", code: resultCode, message };
    } else {
      // failure: mark txn failed (updateMany safe)
      await prisma.payment_transaction.updateMany({
        where: { txn_ref: String(orderId) },
        data: { status: "FAILED" },
      });

      await paymentRepository.updateAfterCallback(String(orderId), {
        status: "failed",
        response_code: String(resultCode),
        transaction_no: String(params.transId || orderId),
      });

      return { status: "failed", code: resultCode, message };
    }
  },
};
