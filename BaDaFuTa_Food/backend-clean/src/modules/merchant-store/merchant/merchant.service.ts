import bcrypt from 'bcryptjs';
import * as merchantRepo from './merchant.repository';

export const login = async (email: string, password: string) => {
  // 1. Tìm trong bảng MERCHANT (đúng với cột password bạn vừa thêm)
  const merchant = await prisma.merchant.findFirst({
    where: { email: email.toLowerCase() },
  });

  if (!merchant) {
    throw new Error('Email không tồn tại trong hệ thống Merchant');
  }

  // 2. So sánh mật khẩu lấy từ bảng MERCHANT
  // Đảm bảo mật khẩu trong DB đã được bcrypt.hash trước đó
  const valid = await bcrypt.compare(password, merchant.password);

  if (!valid) {
    throw new Error('Mật khẩu không đúng');
  }

  return {
    merchant_id: merchant.id,
    merchant_name: merchant.merchant_name,
    email: merchant.email,
  };
};
