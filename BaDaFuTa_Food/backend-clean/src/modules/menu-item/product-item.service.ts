import * as ProductResponse from "./product-item.response";
import type { ProductItemArgs } from "./product-item.response";

// Service: giữ tối thiểu, chỉ pass-through
export const getProductItem = async ({ merchant_id, id }: ProductItemArgs) => {
  return ProductResponse.getProduct({ merchant_id, id });
};
