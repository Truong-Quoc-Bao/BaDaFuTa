// import crypto from "crypto";
// import moment from "moment";
// import { paymentRepository } from "./payment.repository";
// import { prisma } from "@/libs/prisma";

// /** Helper encode */
// function vnpEncode(v: string) {
//   return encodeURIComponent(v).replace(/%20/g, "+");
// }

// export const paymentService = {
//   /** 🔹 Tạo order + transaction + trả link VNPAY */
//   async initiateVNPAY(data: any) {
//     // 0️⃣ Kiểm tra phương thức thanh toán
//     if (!data.payment_method || data.payment_method.toUpperCase() !== "VNPAY") {
//       throw new Error("Phương thức thanh toán không hợp lệ (phải là VNPAY)");
//     }

//     // 1️⃣ Lấy thông tin user
//     const user = await prisma.users.findUnique({
//       where: { id: data.user_id },
//       select: { full_name: true, phone: true },
//     });

//     // 2️⃣ Tính tổng tiền
//     const total = data.items.reduce(
//       (sum: number, i: any) => sum + i.quantity * i.price,
//       0
//     );
//     const amount = total + (data.delivery_fee || 0);

//     // 3️⃣ Kiểm tra đơn PENDING
//     const pendingOrder = await paymentRepository.findPendingOrder(
//       data.user_id,
//       data.merchant_id
//     );

//     let order;

//     if (pendingOrder) {
//       const isSamePayment =
//         pendingOrder.payment_method &&
//         pendingOrder.payment_method.toUpperCase() === "VNPAY";

//       // ⚠️ Nếu khác cổng thanh toán → huỷ đơn cũ
//       if (!isSamePayment) {
//         await paymentRepository.cancelOrder(pendingOrder.id);
//       }

//       // Nếu cùng VNPAY → so sánh món
//       if (isSamePayment) {
//         const oldItems = JSON.stringify(
//           pendingOrder.items.map((i) => ({
//             menu_item_id: i.menu_item_id,
//             quantity: Number(i.quantity),
//             price: Number(i.price),
//           }))
//         );
//         const newItems = JSON.stringify(data.items);

//         if (oldItems === newItems) {
//           // ✅ Reuse đơn cũ
//           order = pendingOrder;
//         } else {
//           // 🔁 Huỷ & tạo mới
//           await paymentRepository.cancelOrder(pendingOrder.id);
//           order = await prisma.$transaction(async (tx) =>
//             paymentRepository.createOrder(tx, {
//               ...data,
//               total_amount: BigInt(amount),
//               status: "PENDING",
//               status_payment: "PENDING",
//               payment_method: "VNPAY",
//               full_name: user?.full_name,
//             })
//           );
//         }
//       } else {
//         // 🔁 Nếu khác payment method → tạo mới luôn
//         order = await prisma.$transaction(async (tx) =>
//           paymentRepository.createOrder(tx, {
//             ...data,
//             total_amount: BigInt(amount),
//             status: "PENDING",
//             status_payment: "PENDING",
//             payment_method: "VNPAY",
//             full_name: user?.full_name,
//           })
//         );
//       }
//     } else {
//       // 🚀 Không có đơn pending → tạo mới
//       order = await prisma.$transaction(async (tx) =>
//         paymentRepository.createOrder(tx, {
//           ...data,
//           total_amount: BigInt(amount),
//           status: "PENDING",
//           status_payment: "PENDING",
//           payment_method: "VNPAY",
//           full_name: user?.full_name,
//         })
//       );
//     }

//     // 4️⃣ Sinh link VNPAY
//     const txn_ref = `ORD-${order.id}-${Date.now()}`;
//     const createDate = moment().format("YYYYMMDDHHmmss");

//     const vnpTmnCode = process.env.VNP_TMN_CODE!;
//     const vnpHashSecret = process.env.VNP_HASH_SECRET!;
//     const vnpBaseUrl = process.env.VNP_URL!;
//     const vnpReturnUrl = process.env.VNP_RETURN_URL!;

//     const amountVnp = (Number(order.total_amount) * 100).toString();
//     const baseParams: Record<string, string> = {
//       vnp_Version: "2.1.0",
//       vnp_Command: "pay",
//       vnp_TmnCode: vnpTmnCode,
//       vnp_Locale: "vn",
//       vnp_CurrCode: "VND",
//       vnp_TxnRef: txn_ref,
//       vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
//       vnp_OrderType: "billpayment",
//       vnp_Amount: amountVnp,
//       vnp_ReturnUrl: vnpReturnUrl,
//       vnp_IpAddr: "127.0.0.1",
//       vnp_CreateDate: createDate,
//     };

//     const signData = Object.keys(baseParams)
//       .sort()
//       .map(
//         (k) => `${k}=${encodeURIComponent(baseParams[k]).replace(/%20/g, "+")}`
//       )
//       .join("&");

//     const secureHash = crypto
//       .createHmac("sha512", vnpHashSecret)
//       .update(signData, "utf-8")
//       .digest("hex");

//     const paymentUrl = `${vnpBaseUrl}?${signData}&vnp_SecureHash=${secureHash}`;

//     // 5️⃣ Lưu transaction
//     await prisma.$transaction(async (tx) =>
//       paymentRepository.createTransaction(tx, {
//         user_id: data.user_id,
//         merchant_id: data.merchant_id,
//         order_id: order.id,
//         amount: order.total_amount,
//         payment_method: "VNPAY",
//         txn_ref,
//         raw_payload: data,
//       })
//     );

//     // ✅ Trả về response đồng bộ format với MoMo
//     return {
//       success: true,
//       message: "Khởi tạo thanh toán VNPAY thành công",
//       payment_url: paymentUrl,
//       order_id: order.id,
//     };
//   },

//   /** 🔹 Xử lý callback từ VNPAY */
//   async handleVnpayCallback(params: Record<string, any>) {
//     const vnpHashSecret = process.env.VNP_HASH_SECRET!;

//     // 1️⃣ Lọc và tạo data để ký
//     const input: Record<string, string> = {};
//     Object.keys(params).forEach((k) => {
//       if (k === "vnp_SecureHash" || k === "vnp_SecureHashType") return;
//       const val = params[k];
//       if (typeof val === "string") input[k] = val;
//       else if (Array.isArray(val)) input[k] = val.join(",");
//     });

//     const signData = Object.keys(input)
//       .sort()
//       .map((k) => `${k}=${vnpEncode(input[k])}`)
//       .join("&");

//     const calculatedHash = crypto
//       .createHmac("sha512", vnpHashSecret)
//       .update(signData, "utf-8")
//       .digest("hex");

//     const receivedHash = params["vnp_SecureHash"] as string;
//     const isValid = calculatedHash === receivedHash;

//     // 2️⃣ Lấy thông tin từ callback
//     const responseCode = params["vnp_ResponseCode"];
//     const txnRef = params["vnp_TxnRef"];
//     const transactionNo = params["vnp_TransactionNo"];

//     // 3️⃣ Nếu giao dịch hợp lệ và thành công
//     if (isValid && responseCode === "00") {
//       await paymentRepository.updateAfterCallback(txnRef, {
//         status: "success",
//         response_code: responseCode,
//         transaction_no: transactionNo,
//       });

//       // 🔥 Lấy giao dịch và order
//       const txn = await prisma.payment_transaction.findFirst({
//         where: { txn_ref: txnRef },
//         include: { order: true },
//       });

//       if (txn?.order) {
//         // 🔥 Huỷ các đơn pending khác cổng, khác chính nó
//         await prisma.order.updateMany({
//           where: {
//             id: { not: txn.order.id },
//             user_id: txn.order.user_id,
//             merchant_id: txn.order.merchant_id,
//             payment_method: { not: "VNPAY" },
//             status: "PENDING",
//             status_payment: "PENDING",
//           },
//           data: {
//             status: "CANCELED",
//             status_payment: "FAILED",
//             note: "Đã huỷ vì thanh toán VNPAY thành công cho đơn khác.",
//           },
//         });
//       }

//       return { status: "success", code: responseCode };
//     } else {
//       // ❌ Giao dịch thất bại hoặc sai chữ ký
//       await paymentRepository.updateAfterCallback(txnRef, {
//         status: "failed",
//         response_code: responseCode ?? "ERR",
//         transaction_no: transactionNo,
//       });

//       return { status: "failed", code: responseCode };
//     }
//   },
// };

import crypto from "crypto";
import moment from "moment";
import { prisma } from "@/libs/prisma";
import { paymentRepository } from "./payment.repository";

function vnpEncode(v: string) {
  return encodeURIComponent(v).replace(/%20/g, "+");
}

export const paymentService = {
  /** 🔹 Tạo transaction + trả link VNPAY */
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

    // Tìm order pending
    let order = await prisma.order.findFirst({
      where: {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        status: "PENDING",
      },
    });

    if (order) {
      // Cập nhật phương thức thanh toán
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          payment_method: "VNPAY",
          total_amount,
          note: data.note ?? order.note,
        },
      });
    } else {
      // Tạo mới nếu chưa có
      order = await prisma.order.create({
        data: {
          user_id: data.user_id,
          merchant_id: data.merchant_id,
          full_name: user?.full_name || "",
          phone: user?.phone,
          delivery_address: data.delivery_address,
          delivery_fee: data.delivery_fee,
          note: data.note,
          total_amount,
          status: "PENDING",
          status_payment: "PENDING",
          payment_method: "VNPAY",
        },
      });
    }

    // Sinh link VNPAY
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

    // Tạo transaction mới
    await prisma.payment_transaction.create({
      data: {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        order_id: order.id,
        amount: order.total_amount,
        payment_method: "VNPAY",
        txn_ref,
        raw_payload: data,
        status: "PENDING",
      },
    });

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
    const transactionNo = params["vnp_TransactionNo"];
    if (isValid && responseCode === "00") {
      // 🔹 Lấy transaction theo txnRef
      const txn = await prisma.payment_transaction.findFirst({
        where: { txn_ref: txnRef },
        include: { order: true },
      });

      if (!txn || !txn.order_id)
        throw new Error("Không tìm thấy transaction hoặc order hợp lệ");

      // 🔹 Update transaction SUCCESS
      await prisma.payment_transaction.update({
        where: {
          order_id_txn_ref: {
            order_id: txn.order_id,
            txn_ref: txnRef,
          },
        },
        data: { status: "SUCCESS" },
      });

      // 🔹 Cập nhật order SUCCESS
      await prisma.order.update({
        where: { id: txn.order_id },
        data: { status_payment: "SUCCESS", status: "COMPLETED" },
      });

      // 🔹 Hủy các transaction khác (khác cổng)
      await prisma.payment_transaction.updateMany({
        where: {
          order_id: txn.order_id,
          payment_method: { not: "VNPAY" },
          status: "PENDING",
        },
        data: { status: "FAILED" },
      });

      return { status: "success", code: responseCode };
    } else {
      await prisma.payment_transaction.updateMany({
        where: { txn_ref: txnRef },
        data: { status: "FAILED" },
      });
      return { status: "failed", code: responseCode };
    }
  },
};
