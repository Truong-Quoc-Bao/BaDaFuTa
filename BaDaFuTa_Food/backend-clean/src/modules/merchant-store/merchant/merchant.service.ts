import bcrypt from 'bcryptjs';
import * as merchantRepo from './merchant.repository';
import { LoginInput } from './merchant.types';

export const login = async (data: LoginInput) => {
  // Tìm user có role 'merchant'
  const user = await merchantRepo.findMerchantByEmail(data.email.toLowerCase());

  if (!user) {
    throw new Error('Tài khoản Merchant không tồn tại');
  }

  // So sánh password từ bảng users
  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) {
    throw new Error('Mật khẩu không đúng');
  }

  // Trả về info merchant
  return {
    user_id: user.id,
    merchant_id: user.merchant[0]?.id, // Giả định quan hệ 1-n
    email: user.email,
    merchant_name: user.merchant[0]?.merchant_name,
  };
};
