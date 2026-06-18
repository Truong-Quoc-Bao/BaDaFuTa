import bcrypt from 'bcryptjs';
import * as merchantRepo from './merchant.repository';
// BẠN ĐANG THIẾU DÒNG IMPORT NÀY HOẶC NÓ ĐANG BỊ LỖI
import { prisma } from '@/libs/prisma';

export const login = async (email: string, password: string) => {
  const merchant = await merchantRepo.findByEmail(email);
  if (!merchant) throw new Error('Email không tồn tại');

  // LOG NÀY SẼ HIỆN LÊN RENDER
  console.log('Input password:', password);
  console.log('DB password:', merchant.password);

  const valid = await bcrypt.compare(password, merchant.password);

  if (!valid) {
    throw new Error('Mật khẩu không đúng');
  }
  // ...
  return {
    merchant_id: merchant.id,
    merchant_name: merchant.merchant_name,
    email: merchant.email,
  };
};
