import { prisma } from "@/libs/prisma"; // hoặc đường dẫn của bạn
import type { MerchantFindArgs } from "./merchant.types";

export async function findMany(args: MerchantFindArgs) {
  const {
    take,
    cuisine,
    merchant_name,
    search,
    category_name,
    name_item,
    include,
  } = args;

  return prisma.merchant.findMany({
    take,
    where: {
      ...(cuisine && {
        cuisine: { contains: cuisine, mode: "insensitive" },
      }),
      ...(merchant_name && {
        merchant_name: { contains: merchant_name, mode: "insensitive" },
      }),
      ...(search && {
        OR: [
          { merchant_name: { contains: search, mode: "insensitive" } },
          {
            categories: {
              some: {
                category_name: { contains: search, mode: "insensitive" },
              },
            },
          },
          {
            menu_item: {
              some: {
                name_item: { contains: search, mode: "insensitive" },
              },
            },
          },
        ],
      }),
      ...(category_name && {
        categories: {
          some: {
            category_name: { contains: category_name, mode: "insensitive" },
          },
        },
      }),
      ...(name_item && {
        menu_item: {
          some: { name_item: { contains: name_item, mode: "insensitive" } },
        },
      }),
    },
    select: {
      id: true,
      user_id: true,
      merchant_name: true,
      location: true,
      phone: true,
      email: true,
      profile_image: true,
      cover_image: true,
      time_open: true,
      cuisine: true,
      rating: true,
      rating_count: true,
      description: true,

      ...(include && {
        categories: { select: { id: true, category_name: true } },
        menu_item: {
          select: {
            id: true,
            name_item: true,
            price: true,
            status: true,
          },
        },
      }),
    },

    orderBy: { merchant_name: "asc" },
  });
}

// (tùy chọn) dùng cho meta phân trang
export async function count(args: MerchantFindArgs) {
  const { merchant_name, search, category_name, name_item } = args;
  return prisma.merchant.count({
    where: {
      ...(merchant_name && {
        merchant_name: { contains: merchant_name, mode: "insensitive" },
      }),
      ...(search && {
        OR: [
          { merchant_name: { contains: search, mode: "insensitive" } },
          {
            categories: {
              some: {
                category_name: { contains: search, mode: "insensitive" },
              },
            },
          },
          {
            menu_item: {
              some: { name_item: { contains: search, mode: "insensitive" } },
            },
          },
        ],
      }),
      ...(category_name && {
        categories: {
          some: {
            category_name: { contains: category_name, mode: "insensitive" },
          },
        },
      }),
      ...(name_item && {
        menu_item: {
          some: { name_item: { contains: name_item, mode: "insensitive" } },
        },
      }),
    },
  });
}

export async function OutStandingMerchant() {
  const merchants = await prisma.merchant.findMany({
    orderBy: {
      rating: "desc",
    },
    take: 4,
  });

  return merchants;
}
