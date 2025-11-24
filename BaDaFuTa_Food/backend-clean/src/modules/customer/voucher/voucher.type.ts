import { voucher } from "@prisma/client";

export interface VoucherResponse {
  appVouchers: voucher[];
  merchantVouchers: voucher[];
  userVouchers: voucher[];
}
