import crypto from "crypto";
import moment from "moment";
import { prisma } from "@/libs/prisma";
import { paymentRepository } from "./vnpay.repository";

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
    if (!user) throw new Error("User không tồn tại");

    // ================================
    // 1) TÍNH TỔNG TIỀN MÓN + TOPPING
    // ================================
    const totalItems = data.items.reduce((sum: number, item: any) => {
      const toppingTotal = (item.selected_option_items ?? []).reduce(
        (acc: number, top: any) => acc + (top.price ?? 0),
        0
      );
      return sum + (item.price + toppingTotal) * item.quantity;
    }, 0);

    const deliveryFee = data.delivery_fee || 0;

    // Biến breakdown
    let beforeItems = totalItems;
    let afterItems = totalItems;

    let beforeDelivery = deliveryFee;
    let afterDelivery = deliveryFee;

    let beforeTotal = totalItems + deliveryFee;
    let afterTotal = beforeTotal;

    let discountValue = 0;
    let discount = 0;
    let applyType: "TOTAL" | "DELIVERY" | "MERCHANT" | null = null;
    let voucherRecord: any = null;

    // ================================
    // 2) ÁP DỤNG VOUCHER (GIỐNG COD 100%)
    // ================================
    if (data.voucher) {
      voucherRecord = await prisma.voucher.findUnique({
        where: { code: data.voucher },
      });

      if (!voucherRecord) throw new Error("Voucher không tồn tại");
      if (!voucherRecord.is_active) throw new Error("Voucher không hoạt động");

      const now = new Date();
      if (now < voucherRecord.start_date || now > voucherRecord.end_date) {
        throw new Error("Voucher đã hết thời gian sử dụng");
      }

      applyType = voucherRecord.apply_type;

      // ⭐ DELIVERY
      if (applyType === "DELIVERY") {
        const conditionBase = beforeItems + beforeDelivery;
        let discountRaw = 0;

        if (conditionBase >= (voucherRecord.min_order_value ?? 0)) {
          const shipBase = deliveryFee;

          if (voucherRecord.discount_type === "AMOUNT") {
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
        discountValue = beforeDelivery - afterDelivery;
      }

      // ⭐ MERCHANT
      else if (applyType === "MERCHANT") {
        const isAllowed = await prisma.voucher_merchant.findFirst({
          where: {
            voucher_id: voucherRecord.id,
            merchant_id: data.merchant_id,
          },
        });

        if (!isAllowed)
          throw new Error("Voucher không áp dụng cho merchant này");

        let target = totalItems;

        if (target >= (voucherRecord.min_order_value ?? 0)) {
          if (voucherRecord.discount_type === "AMOUNT") {
            discount = voucherRecord.discount_value;
          } else {
            discount = (target * voucherRecord.discount_value) / 100;
            if (voucherRecord.max_discount) {
              discount = Math.min(discount, voucherRecord.max_discount);
            }
          }
        }

        afterItems = Math.max(0, totalItems - discount);
        discountValue = beforeItems - afterItems;
      }

      // ⭐ TOTAL
      else if (applyType === "TOTAL") {
        let target = beforeTotal;

        if (target >= (voucherRecord.min_order_value ?? 0)) {
          if (voucherRecord.discount_type === "AMOUNT") {
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

    // ================================
    // 3) FINAL TOTAL GIỐNG COD & MOMO
    // ================================
    let finalAmount = 0;
    if (applyType === "TOTAL") {
      finalAmount = afterTotal;
    } else {
      finalAmount = afterItems + afterDelivery;
      afterTotal = finalAmount;
    }

    let order: any;
    let txn_ref = "";

    // ================================
    // 4) TRANSACTION
    // ================================
    await prisma.$transaction(async (tx) => {
      const pendingOrder = await tx.order.findFirst({
        where: {
          user_id: data.user_id,
          merchant_id: data.merchant_id,
          status_payment: "PENDING",
          payment_method: { in: ["VNPAY", "MOMO"] },
        },
      });

      if (pendingOrder) {
        await tx.order_item.deleteMany({
          where: { order_id: pendingOrder.id },
        });

        order = await tx.order.update({
          where: { id: pendingOrder.id },
          data: {
            total_amount: BigInt(finalAmount),
            voucher_id: voucherRecord?.id ?? null,
            note: data.note ?? pendingOrder.note,
            delivery_address: data.delivery_address,
            delivery_fee: BigInt(deliveryFee),
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
            delivery_fee: BigInt(deliveryFee),
            note: data.note ?? null,
            total_amount: BigInt(finalAmount),
            status: "DELIVERING",
            status_payment: "PENDING",
            payment_method: "VNPAY",
            voucher_id: voucherRecord?.id ?? null,
          },
        });
      }

      // Tạo order_items
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

        if (item.selected_option_items?.length > 0) {
          const optionIds = item.selected_option_items.map(
            (opt: any) => opt.option_item_id
          );

          await tx.order_item_option.createMany({
            data: optionIds.map((id: string) => ({
              order_item_id: orderItem.id,
              option_item_id: id,
            })),
          });
        }
      }

      // transaction ref
      txn_ref = `ORD-${order.id}-${Date.now()}`;

      await tx.payment_transaction.create({
        data: {
          user_id: data.user_id,
          merchant_id: data.merchant_id,
          order_id: order.id,
          amount: BigInt(finalAmount),
          payment_method: "VNPAY",
          txn_ref,
          raw_payload: data,
          status: "PENDING",
        },
      });
    });

    // ================================
    // 5) TẠO LINK VNPAY (SỐ TIỀN ĐÃ GIẢM)
    // ================================
    const createDate = moment().format("YYYYMMDDHHmmss");
    const vnpTmnCode = process.env.VNP_TMN_CODE!;
    const vnpHashSecret = process.env.VNP_HASH_SECRET!;
    const vnpBaseUrl = process.env.VNP_URL!;
    const vnpReturnUrl = process.env.VNP_RETURN_URL!;
    const amountVnp = (finalAmount * 100).toString();

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

    // 🔧 Gom input trừ 2 field hash
    const input: Record<string, string> = {};
    Object.keys(params).forEach((k) => {
      if (k === "vnp_SecureHash" || k === "vnp_SecureHashType") return;
      const val = params[k];
      if (typeof val === "string") input[k] = val;
      else if (Array.isArray(val)) input[k] = val.join(",");
    });

    // 🔒 Tạo chuỗi ký hash
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

    // 🪶 Log debug
    console.log("🔍 Raw txnRef từ VNPay:", txnRef);

    // ✅ Tách UUID
    const uuidMatch = txnRef?.match(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
    );
    const orderId = uuidMatch ? uuidMatch[0] : null;

    // 🕒 created_at
    let createdAt: Date | null = null;
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { created_at: true },
      });
      createdAt = order?.created_at ?? null;
    }

    // ❗ Nếu không có order --> failed
    if (!orderId) {
      return {
        status: "failed",
        code: responseCode,
        order_id: null,
        created_at: null,
      };
    }

    // ❗ Sai chữ ký hoặc responseCode != 00
    if (!isValid || responseCode !== "00") {
      await paymentRepository.updateAfterCallback(txnRef, {
        status: "failed",
        response_code: responseCode,
      });

      return {
        status: "failed",
        code: responseCode,
        order_id: orderId,
        created_at: createdAt,
      };
    }

    // 🟢 SUCCESS
    await paymentRepository.updateAfterCallback(txnRef, {
      status: "success",
      response_code: responseCode,
      transaction_no: params["vnp_TransactionNo"],
    });

    // 🔥 ⭐ LẤY FULL ORDER (KHÔNG làm thay đổi môi trường)
    const full = await paymentRepository.getFullOrder(orderId);

    // ⭐ TRẢ VỀ FORMAT GIỐNG MOMO
    return {
      ...full, // full order giống MOMO
      code: responseCode, // mã trả về
      status: "success", // giống MOMO
    };
  },
};
