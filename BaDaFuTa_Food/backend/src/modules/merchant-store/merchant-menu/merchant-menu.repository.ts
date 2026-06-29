import { prisma } from '@/libs/prisma';

function serializeBigInt<T>(obj: T): any {
  return JSON.parse(
    JSON.stringify(obj, (_key, val) => (typeof val === 'bigint' ? val.toString() : val)),
  );
}

export const merchantMenuRepository = {
  async findOrCreateCategory(merchantId: string, categoryName: string) {
    let category = await prisma.category.findFirst({
      where: { merchant_id: merchantId, category_name: categoryName },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { merchant_id: merchantId, category_name: categoryName },
      });
    }
    return category;
  },

  // ✅ Thêm mới — service dùng để lấy merchant_id khi update category
  async findMenuItem(itemId: string) {
    const item = await prisma.menu_item.findUniqueOrThrow({
      where: { id: itemId },
      include: { category: true },
    });
    return serializeBigInt(item);
  },

  async createMenuItem(data: any) {
    const item = await prisma.menu_item.create({
      data: {
        merchant_id: data.merchant_id,
        category_id: data.category_id,
        name_item: data.name,
        price: BigInt(Math.round(data.price)),
        description: data.description || '',
        image_item: data.image || '',
        status: data.isAvailable ?? true,
      },
      include: { category: true },
    });
    return serializeBigInt(item);
  },

  async getMenuByMerchant(merchantId: string) {
    const items = await prisma.menu_item.findMany({
      where: { merchant_id: merchantId },
      include: { category: true },
      orderBy: { name_item: 'asc' },
    });
    return serializeBigInt(items);
  },

  // ✅ Sửa — chỉ update field nào được truyền vào, tránh ghi đè undefined
  async updateMenuItem(itemId: string, data: any) {
    const item = await prisma.menu_item.update({
      where: { id: itemId },
      data: {
        ...(data.name !== undefined && { name_item: data.name }),
        ...(data.price !== undefined && { price: BigInt(Math.round(data.price)) }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.image !== undefined && { image_item: data.image }),
        ...(data.isAvailable !== undefined && { status: data.isAvailable }),
        ...(data.category_id !== undefined && { category_id: data.category_id }),
      },
      include: { category: true },
    });
    return serializeBigInt(item);
  },

  async toggleMenuItem(itemId: string, isAvailable: boolean) {
    const item = await prisma.menu_item.update({
      where: { id: itemId },
      data: { status: isAvailable },
    });
    return serializeBigInt(item);
  },

  async deleteMenuItem(itemId: string) {
    return await prisma.menu_item.delete({ where: { id: itemId } });
  },
};
