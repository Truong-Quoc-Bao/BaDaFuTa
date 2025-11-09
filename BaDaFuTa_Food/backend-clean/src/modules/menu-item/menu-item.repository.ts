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

  // 3) Lấy menu items (kèm options)
  const items = await prisma.menu_item.findMany({
    where: {
      merchant_id,
      status: true,
      ...(name_item
        ? { name_item: { contains: name_item, mode: "insensitive" } }
        : {}),
    },
    orderBy: { name_item: "asc" },
    ...(take ? { take } : {}),

    include: {
      // 🔹 include option groups và từng option_item
      menu_item_option: {
        include: {
          option: {
            include: {
              option_item: {
                where: { status: true },
                orderBy: { option_item_name: "asc" },
              },
            },
          },
        },
      },
    },
  });

  // 4) Gom items theo category và format lại
  const itemsByCategory = new Map<string, typeof items>();
  for (const it of items) {
    const key = String(it.category_id);
    if (!itemsByCategory.has(key)) itemsByCategory.set(key, []);
    itemsByCategory.get(key)!.push(it);
  }

  const menu = categories.map((c) => {
    const list = itemsByCategory.get(String(c.id)) ?? [];

    return {
      id: c.id,
      category_id: c.id,
      name: c.category_name,
      category_name: c.category_name,

      items: list.map((mi) => ({
        item_id: mi.id,
        name_item: mi.name_item,
        price: mi.price,
        description: mi.description ?? null,
        image_item: mi.image_item ?? null,
        likes: mi.likes ?? 0,
        sold_count: mi.sold_count ?? 0,

        // 🔹 Thêm field options
        options: mi.menu_item_option.map((mio) => ({
          option_id: mio.option.id,
          option_name: mio.option.option_name,
          multi_select: mio.option.multi_select,
          require_select: mio.option.require_select,
          number_select: mio.option.number_select,
          items: mio.option.option_item.map((oi) => ({
            option_item_id: oi.id,
            option_item_name: oi.option_item_name,
          })),
        })),
      })),
    };
  });

  // 5) Trả đúng shape cũ + options
  return { merchant, menu };
};
