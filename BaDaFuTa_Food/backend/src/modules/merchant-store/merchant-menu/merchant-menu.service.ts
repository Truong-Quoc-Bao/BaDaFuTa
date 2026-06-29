import { merchantMenuRepository } from './merchant-menu.repository';
import { AddMenuInput, UpdateMenuInput, ToggleMenuInput } from './merchant-menu.type';

export const merchantMenuService = {
  async addMenu(data: AddMenuInput) {
    const category = await merchantMenuRepository.findOrCreateCategory(
      data.merchant_id,
      data.category,
    );
    return merchantMenuRepository.createMenuItem({
      ...data,
      category_id: category.id,
    });
  },

  async getMenu(merchantId: string) {
    const items = await merchantMenuRepository.getMenuByMerchant(merchantId);
    return items.map((item: any) => ({
      id: item.id,
      name: item.name_item,
      price: Number(item.price),
      description: item.description,
      image: item.image_item,
      category: item.category?.category_name || '',
      isAvailable: item.status,
      restaurantId: item.merchant_id,
    }));
  },

  // ✅ Dùng UpdateMenuInput thay vì Partial<AddMenuInput>
  async updateMenu(itemId: string, data: UpdateMenuInput) {
    if (data.category) {
      // UpdateMenuInput không có merchant_id nên cần truyền từ nơi khác
      // Hoặc fetch merchant_id từ DB theo itemId
      const existingItem = await merchantMenuRepository.findMenuItem(itemId);
      const category = await merchantMenuRepository.findOrCreateCategory(
        existingItem.merchant_id,
        data.category,
      );
      (data as any).category_id = category.id;
    }
    return merchantMenuRepository.updateMenuItem(itemId, data);
  },

  async toggleMenu(itemId: string, input: ToggleMenuInput) {
    return merchantMenuRepository.toggleMenuItem(itemId, input.isAvailable);
  },

  async deleteMenu(itemId: string) {
    return merchantMenuRepository.deleteMenuItem(itemId);
  },
};
