// src/modules/menu-item/menu-item.service.ts
import * as MenuResponse from "./menu-item.repository";
import type { MenuItemFindArgs } from "./menu-item.repository";

// Service: giữ nguyên interface, chỉ pass-through & có default nhẹ
export const getMenuItem = async ({
  merchant_id,
  take,
  name_item,
}: MenuItemFindArgs) => {
  // default nhẹ (nếu muốn giới hạn), còn không truyền thì lấy hết
  const safeTake = typeof take === "number" && take > 0 ? take : undefined;

  return MenuResponse.getMenu({
    merchant_id,
    take,
    name_item,
  });
};
