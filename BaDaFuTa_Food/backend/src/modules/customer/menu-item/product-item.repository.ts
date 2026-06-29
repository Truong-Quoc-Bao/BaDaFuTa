import { prisma } from "@/libs/prisma";

export type ProductItemArgs = {
  merchant_id: string;
  id: string; // menuItemId
};

export const getProduct = async ({ merchant_id, id }: ProductItemArgs) => {
  // Gọi song song merchant + item (kèm options)
  const [outRestaurant, outItem] = await Promise.all([
    prisma.merchant.findUnique({
      where: { id: merchant_id },
    }),

    prisma.menu_item.findUnique({
      where: { id },
      include: {
        // 🔹 include toàn bộ nhóm option
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
    }),
  ]);

  if (!outItem) return { restaurant: outRestaurant, item: null };

  // 🔹 Chuẩn hoá dữ liệu options
  const options = outItem.menu_item_option.map((mio) => ({
    option_id: mio.option.id,
    option_name: mio.option.option_name,
    multi_select: mio.option.multi_select,
    require_select: mio.option.require_select,
    number_select: mio.option.number_select,
    items: mio.option.option_item.map((oi) => ({
      option_item_id: oi.id,
      option_item_name: oi.option_item_name,
      price: oi.price,
    })),
  }));

  // 🔹 Gộp options vào item
  const item = {
    id: outItem.id,
    merchant_id: outItem.merchant_id,
    category_id: outItem.category_id,
    name_item: outItem.name_item,
    likes: outItem.likes,
    price: outItem.price,
    description: outItem.description,
    sold_count: outItem.sold_count,
    image_item: outItem.image_item,
    status: outItem.status,
    options, // ✅ thêm field này
  };

  return { restaurant: outRestaurant, item };
};
