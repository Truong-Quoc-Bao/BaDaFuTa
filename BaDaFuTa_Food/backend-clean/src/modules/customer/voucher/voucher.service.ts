import { voucherRepo } from "./voucher.repository";
import { VoucherResponse } from "./voucher.type";

export const voucherService = {
  async getAll(
    user_id?: string,
    merchant_id?: string
  ): Promise<VoucherResponse> {
    return voucherRepo.getAllVouchers(user_id, merchant_id);
  },
};
