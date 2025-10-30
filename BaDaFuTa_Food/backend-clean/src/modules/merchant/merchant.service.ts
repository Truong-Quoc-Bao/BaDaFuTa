// import * as MerchantResponse from "./merchant.repository";
// import type { MerchantFindArgs } from "./merchant.types";

// /**
//  * Service: nhận tham số từ controller, có thể xử lý thêm (phân trang, meta, cache...)
//  * Hiện tại: chỉ chuyển tiếp xuống repository.
//  */
// export const getRestaurants = async ({
//   take = 20,
//   category_name,
//   name_item,
//   merchant_name,
//   search,
//   include = false,
// }: MerchantFindArgs) => {
//   // Nếu muốn trả kèm meta (total, totalPages...) thì dùng countMany:
//   // const [items, total] = await Promise.all([
//   //   MerchantRepository.findMany({ take, category_name, name_item, include }),
//   //   MerchantRepository.countMany({ category_name, name_item }),
//   // ]);
//   // return { items, meta: { total } };

//   // Đơn giản: trả thẳng danh sách
//   return MerchantResponse.findMany({
//     take,
//     category_name,
//     name_item,
//     merchant_name,
//     search,
//     include,
//   });
// };

import type { MerchantFindArgs } from "./merchant.types";
import * as Repo from "./merchant.repository";

export async function listMerchants(args: MerchantFindArgs) {
  if (args.withMeta) {
    const [items, total] = await Promise.all([
      Repo.findMany(args),
      Repo.count(args),
    ]);
    return { items, meta: { total } };
  }
  return Repo.findMany(args);
}
