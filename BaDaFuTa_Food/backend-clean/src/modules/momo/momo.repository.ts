import { prisma } from "@/libs/prisma";

export const momoRepository = {
  /** 🔹 Lưu transaction của MoMo */
  async createTransaction(tx: any, data: any) {
    return tx.payment_transaction.create({
      data: {
        user_id: data.user_id,
        merchant_id: data.merchant_id,
        order_id: data.order_id,
        amount: BigInt(data.amount),
        payment_method: "MOMO",
        txn_ref: data.orderId,
        status: "PENDING",
        raw_payload: data,
      },
    });
  },

  /** 🔹 Cập nhật trạng thái giao dịch */
  async updateTransactionStatus(tx: any, txn_ref: string, status: string) {
    return tx.payment_transaction.updateMany({
      where: { txn_ref },
      data: { status },
    });
  },
};
