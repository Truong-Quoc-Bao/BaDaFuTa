import bcrypt from 'bcryptjs';
import * as merchantRepo from './merchant.repository';

export const login = async (email: string, password: string) => {
  const merchant = await merchantRepo.findByEmail(email.toLowerCase());

  if (!merchant) {
    throw new Error('Email không tồn tại');
  }

  // So sánh mật khẩu (đã thêm cột password vào merchant table)
  const valid = await bcrypt.compare(password, merchant.password);
  if (!valid) {
    throw new Error('Mật khẩu không đúng');
  }

  // Trả về object chứa merchant_id để FE lưu vào merchantAuth
  return {
    merchant_id: merchant.id,
    merchant_name: merchant.merchant_name,
    email: merchant.email,
  };
};
