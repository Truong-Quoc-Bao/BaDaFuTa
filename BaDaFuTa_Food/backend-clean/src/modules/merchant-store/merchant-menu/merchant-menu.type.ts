// merchant-menu.type.ts

// ✅ Bỏ hoàn toàn AddMenuInput và ToggleMenuInput thủ công
// Import thẳng từ validation để luôn đồng bộ với Zod schema
export type { AddMenuInput, UpdateMenuInput, ToggleMenuInput } from './merchant-menu.validation';

// Giữ lại MenuItemResponse vì đây là kiểu trả về từ DB, không liên quan Zod
export interface MenuItemResponse {
  id: string;
  name_item: string;
  price: string; // serialize từ BigInt → string
  description: string | null;
  image_item: string | null;
  status: boolean;
  category_id: string | null;
  merchant_id: string; // ✅ thêm vào để updateMenu dùng được
  category?: { category_name: string };
}
