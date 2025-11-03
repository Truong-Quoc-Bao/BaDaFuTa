// // Nơi duy nhất gọi Prisma cho merchant
// import { prisma } from "../../libs/prisma";
// import type { MerchantFindArgs } from "./merchant.types";

// /**
//  * Tìm danh sách merchant với các filter cơ bản.
//  * - Mặc định KHÔNG include quan hệ (categories/menu_item/option).
//  * - Nếu cần có thể bật include = true.
//  * - Dùng where.some để lọc theo quan hệ nhưng không cần include dữ liệu quan hệ.
//  */
// export const findMany = async ({
//   take = 20,
//   category_name,
//   name_item,
//   merchant_name,
//   search,
//   include = false,
// }: MerchantFindArgs) => {
//   const where: any = {};

//   if (category_name) {
//     // Merchant có ít nhất 1 category có tên khớp
//     where.categories = {
//       some: {
//         category_name: {
//           contains: category_name,
//           mode: "insensitive",
//         },
//       },
//     };
//   }

//   if (merchant_name) {
//     // Khớp tên merchant
//     where.merchant_name = { contains: merchant_name, mode: "insensitive" };
//   }

//   if (name_item) {
//     // Merchant có ít nhất 1 món có tên khớp
//     where.menu_item = {
//       some: {
//         name_item: {
//           contains: name_item,
//           mode: "insensitive",
//         },
//       },
//     };
//   }
//   if (search) {
//     // Tìm kiếm
//     where.OR = [
//       { merchant_name: { contains: search, mode: "insensitive" } },
//       {
//         categories: {
//           some: {
//             category_name: { contains: search, mode: "insensitive" },
//           },
//         },
//       },
//       {
//         menu_item: {
//           some: { name_item: { contains: search, mode: "insensitive" } },
//         },
//       },
//     ];
//   }
//   return prisma.merchant.findMany({
//     take,
//     where,
//     ...(include
//       ? {
//           include: {
//             categories: true,
//             menu_item: true,
//             option: true,
//           },
//         }
//       : {}),
//     orderBy: { merchant_name: "asc" },
//   });
// };
// /** Giữ nguyên style import trong controller của bạn */
// export const successResponse = (data: unknown) => ({
//   success: true,
//   data,
// });

// export const errorResponse = (message: string) => ({
//   success: false,
//   error: message,
// });


import { prisma } from "@/libs/prisma"; // hoặc đường dẫn của bạn
import type { MerchantFindArgs } from "./merchant.types";

export async function findMany(args: MerchantFindArgs) {
  const { take, merchant_name, search, category_name, name_item, include } =
    args;

  return prisma.merchant.findMany({
    take,
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
    include: include
      ? {
          categories: { select: { id: true, category_name: true } },
          menu_item: {
            select: { id: true, name_item: true, price: true, status: true },
          },
        }
      : undefined,
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
