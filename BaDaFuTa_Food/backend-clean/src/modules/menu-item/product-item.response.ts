import { prisma } from "@/libs/prisma";

export type ProductItemArgs = {
  merchant_id: string;
  id: string; // menuItemId
};

export const getProduct = async ({ merchant_id, id }: ProductItemArgs) => {
  const [outRestaurant, outItem] = await Promise.all([
    prisma.merchant.findUnique({
      where: { id: merchant_id },
    }),
    prisma.menu_item.findUnique({
      where: { id },
    }),
  ]);

  return { restaurant: outRestaurant, item: outItem };
};
