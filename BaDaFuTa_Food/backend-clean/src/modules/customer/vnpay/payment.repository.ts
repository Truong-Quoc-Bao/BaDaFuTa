// import {
//   PrismaClient,
//   Prisma,
//   PaymentStatus,
//   order_status,
//   payment_method,
// } from "@prisma/client";

// export const prisma = new PrismaClient();

// export const paymentRepository = {
//   /**  Tạo order (và các order_item + option nếu có) */
//   async createOrder(
//     tx: Prisma.TransactionClient,
//     data: {
//       user_id: string;
//       merchant_id: string;
//       phone: string;
//       delivery_address: string;
//       delivery_fee: bigint;
//       note?: string | null;
//       total_amount: bigint;
//       status?: order_status;
//       status_payment?: PaymentStatus;
//       payment_method: "VNPAY" | "MOMO" | "COD";
//       full_name: string;

//       /** ⭐⭐ FIX QUAN TRỌNG NHẤT  ⭐⭐ */
//       items?: {
//         menu_item_id: string;
//         quantity: number;
//         price: number;
//         note?: string | null;

//         /** ❗ FE gửi object → BE phải nhận object */
//         selected_option_items?: {
//           option_item_id: string;
//           price: number;
//         }[];
//       }[];
//     }
//   ) {
//     const { items, ...orderData } = data;

//     const normalizedOrder = {
//       ...orderData,
//       status: orderData.status ?? order_status.PENDING,
//       status_payment: orderData.status_payment ?? PaymentStatus.PENDING,
//     };

//     // 🧾 Tạo order
//     const order = await tx.order.create({ data: normalizedOrder });

//     // 🧾 Tạo order_item + option
//     if (items?.length) {
//       for (const item of items) {
//         // 1️⃣ Tạo order_item
//         const orderItem = await tx.order_item.create({
//           data: {
//             order_id: order.id,
//             menu_item_id: item.menu_item_id,
//             quantity: item.quantity,
//             price: item.price,
//             note: item.note ?? null,
//           },
//         });

//         // 2️⃣ Nếu có topping → tạo order_item_option
//         if (item.selected_option_items?.length) {
//           console.log("👉 repository nhận option:", item.selected_option_items);

//           // ⭐ FE gửi object → map lấy ID
//           const optionIds = item.selected_option_items.map(
//             (opt) => opt.option_item_id
//           );

//           // ⭐ Tìm các option hợp lệ
//           const validOptions = await tx.option_item.findMany({
//             where: { id: { in: optionIds } },
//             select: { id: true },
//           });

//           // ⭐ Lưu vào order_item_option
//           for (const opt of validOptions) {
//             await tx.order_item_option.create({
//               data: {
//                 order_item_id: orderItem.id,
//                 option_item_id: opt.id,
//               },
//             });
//           }
//         }
//       }
//     }

//     return order;
//   },

//   /** 🔹 Lưu transaction */
//   async createTransaction(
//     tx: Prisma.TransactionClient,
//     data: {
//       user_id: string;
//       merchant_id: string;
//       order_id: string;
//       amount: bigint;
//       payment_method: payment_method;
//       txn_ref: string;
//       raw_payload: any;
//     }
//   ) {
//     return tx.payment_transaction.create({
//       data: {
//         ...data,
//         status: PaymentStatus.PENDING,
//       },
//     });
//   },

//   /** 🔹 Tìm đơn hàng đang pending/unpaid */
//   async findPendingOrder(user_id: string, merchant_id: string) {
//     return prisma.order.findFirst({
//       where: {
//         user_id,
//         merchant_id,
//         status: order_status.PENDING,
//         status_payment: PaymentStatus.PENDING,
//       },
//       include: { items: true },
//     });
//   },

//   /** 🔹 Hủy đơn hàng */
//   async cancelOrder(order_id: string) {
//     return prisma.order.update({
//       where: { id: order_id },
//       data: { status: order_status.CANCELED },
//     });
//   },

//   /** 🔹 Cập nhật sau callback */
//   async updateAfterCallback(txnRef: string, data: any) {
//     let statusEnum: PaymentStatus;
//     switch (data.status?.toLowerCase()) {
//       case "success":
//         statusEnum = PaymentStatus.SUCCESS;
//         break;
//       case "failed":
//         statusEnum = PaymentStatus.FAILED;
//         break;
//       case "canceled":
//         statusEnum = PaymentStatus.CANCELED;
//         break;
//       default:
//         statusEnum = PaymentStatus.PENDING;
//     }

//     const tx = await prisma.payment_transaction.updateMany({
//       where: { txn_ref: txnRef },
//       data: {
//         response_code: data.response_code,
//         transaction_no: data.transaction_no,
//         status: statusEnum,
//       },
//     });

//     if (statusEnum !== PaymentStatus.PENDING) {
//       const txn = await prisma.payment_transaction.findFirst({
//         where: { txn_ref: txnRef },
//       });

//       if (txn?.order_id) {
//         await prisma.order.update({
//           where: { id: txn.order_id },
//           data: { status_payment: statusEnum },
//         });
//       }
//     }

//     return tx;
//   },
// };

// export default paymentRepository;
