import { z } from 'zod';
import { PasswordSchema } from '../../customer/users/user.validation'; // Chỉ tái sử dụng schema Password

export const MerchantLoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: PasswordSchema,
});
