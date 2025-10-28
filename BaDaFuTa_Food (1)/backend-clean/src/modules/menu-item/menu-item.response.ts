// src/modules/menu-item/menu-item.response.ts
import { prisma } from "@/libs/prisma";

export type MenuItemFindArgs = {
  merchant_id: string;
  name_item?: string;
  take?: number; // undefined => lấy hết
};

// Repo: truy vấn DB và **định hình** dữ liệu giống backend cũ
export const getMenu = async ({
  merchant_id,
  name_item,
  take,
}: MenuItemFindArgs) => {
  // 1) Merchant
  const merchant = await prisma.merchant.findUnique({
    where: { id: merchant_id },
  });
  if (!merchant) return null;

  // 2) Lấy toàn bộ categories của merchant
  const categories = await prisma.category.findMany({
    where: { merchant_id },
    orderBy: { category_name: "asc" },
  });

  // 3) Lấy menu items theo merchant (lọc theo name_item nếu có)
  const items = await prisma.menu_item.findMany({
    where: {
      merchant_id,
      status: true,
      ...(name_item
        ? { name_item: { contains: name_item, mode: "insensitive" } }
        : {}),
    },
    orderBy: { name_item: "asc" },
    ...(take ? { take } : {}), // nếu undefined thì không giới hạn
  });

  // 4) Gom items theo category giống JSON cũ
  const itemsByCategory = new Map<string, typeof items>();
  for (const it of items) {
    const key = String(it.category_id);
    if (!itemsByCategory.has(key)) itemsByCategory.set(key, []);
    itemsByCategory.get(key)!.push(it);
  }

  const menu = categories.map((c) => {
    const list = itemsByCategory.get(String(c.id)) ?? [];
    return {
      // alias song song để FE nào cũng đọc được
      id: c.id,
      category_id: c.id,
      name: c.category_name,
      category_name: c.category_name,

      // items theo đúng key backend cũ
      items: list.map((mi) => ({
        item_id: mi.id,
        name_item: mi.name_item,
        price: mi.price,
        description: mi.description ?? null,
        image_item: mi.image_item ?? null,
        likes: mi.likes ?? 0,
        sold_count: mi.sold_count ?? 0,
      })),
    };
  });

  // 5) Trả đúng **shape cũ**: { merchant, menu }
  return { merchant, menu };
};
