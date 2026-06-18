import { z } from 'zod';

// Tái sử dụng field price để tránh lặp code
const priceField = z
  .union([z.string(), z.number()])
  .transform((val) => Number(val))
  .refine((val) => !isNaN(val) && val >= 0, 'Giá không hợp lệ');

// Schema thêm món mới
export const AddMenuSchema = z.object({
  merchant_id: z.string().uuid('ID Merchant không hợp lệ'),
  name: z.string().min(1, 'Tên món không được để trống'),
  price: priceField,
  category: z.string().min(1, 'Danh mục không được để trống'),
  description: z.string().optional().default(''),
  image: z.string().optional().default(''),
  isAvailable: z.boolean().optional().default(true),
});

export type AddMenuInput = z.infer<typeof AddMenuSchema>;

// Schema cập nhật món — tất cả field đều optional, không cho đổi merchant_id
export const UpdateMenuSchema = z.object({
  name: z.string().min(1, 'Tên món không được để trống').optional(),
  price: priceField.optional(),
  category: z.string().min(1, 'Danh mục không được để trống').optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

export type UpdateMenuInput = z.infer<typeof UpdateMenuSchema>;

// Schema bật/tắt món
export const ToggleMenuSchema = z.object({
  isAvailable: z.boolean(),
});

export type ToggleMenuInput = z.infer<typeof ToggleMenuSchema>;
