import { prisma } from "@/libs/prisma";

export const voucherRepo = {
  async getAllVouchers(user_id?: string, merchant_id?: string) {
    const now = new Date();

    const [appVouchers, merchantVouchers, userVouchers] = await Promise.all([
      // App vouchers
      prisma.voucher.findMany({
        where: {
          is_active: true,
          start_date: { lte: now },
          end_date: { gte: now },
          merchant_targets: { none: {} },
          user_targets: { none: {} },
        },
        orderBy: { start_date: "asc" },
      }),

      // Merchant vouchers
      merchant_id
        ? prisma.voucher.findMany({
            where: {
              is_active: true,
              merchant_targets: { some: { merchant_id } },
            },
            orderBy: { start_date: "asc" },
          })
        : Promise.resolve([]),

      // User vouchers
      user_id
        ? prisma.voucher.findMany({
            where: {
              is_active: true,
              user_targets: { some: { user_id } },
            },
            orderBy: { start_date: "asc" },
          })
        : Promise.resolve([]),
    ]);

    return {
      appVouchers,
      merchantVouchers,
      userVouchers,
    };
  },
};
