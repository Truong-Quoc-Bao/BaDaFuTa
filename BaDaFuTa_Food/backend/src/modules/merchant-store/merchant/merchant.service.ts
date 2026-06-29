import bcrypt from 'bcryptjs';
import { merchantRepository } from './merchant.repository';

export const merchantService = {
  async login(email: string, pass: string) {
    // 1. Xác thực danh tính qua bảng USERS
    const user = await merchantRepository.findOwnerByEmail(email);

    if (!user || user.role !== 'merchant') {
      throw new Error('Tài khoản không tồn tại hoặc không có quyền Partner');
    }

    // 2. So sánh mật khẩu (Lấy từ bảng users)
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new Error('Mật khẩu không chính xác');

    // 3. Lấy thông tin cửa hàng (Dù tên B khác tên A vẫn lấy được ở đây)
    const store = user.merchant[0];
    if (!store) throw new Error('Tài khoản chưa được thiết lập nhà hàng');

    return {
      user_id: user.id, // ID ông chủ (A)
      merchant_id: store.id, // ID nhà hàng (B)
      merchant_name: store.merchant_name, // Tên nhà hàng hiển thị
      email: user.email, // Email dùng để đăng nhập
    };
  },

  async registerMerchant(registerData: any) {
    const saltRounds = 10;
    // Mã hóa mật khẩu mong muốn của đối tác
    const hashedPassword = await bcrypt.hash(registerData.password, saltRounds);

    return await merchantRepository.registerNewMerchantBySelf({
      ...registerData,
      password: hashedPassword,
    });
  },
};
