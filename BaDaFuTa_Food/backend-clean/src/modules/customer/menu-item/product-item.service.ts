import * as ProductResponse from "./product-item.repository";
import type { ProductItemArgs } from "./product-item.repository";

// Service: giữ tối thiểu, chỉ pass-through
export const getProductItem = async ({ merchant_id, id }: ProductItemArgs) => {
  return ProductResponse.getProduct({ merchant_id, id });
};
