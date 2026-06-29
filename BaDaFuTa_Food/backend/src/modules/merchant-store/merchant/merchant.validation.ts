import { z } from 'zod';
import { PasswordSchema } from '../../customer/users/user.validation'; // Chỉ tái sử dụng schema Password

export const MerchantLoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: PasswordSchema,
});

export class MerchantValidation {
  static validateRegister(body: any): void {
    const requiredFields = [
      'restaurantName',
      'ownerName',
      'email',
      'password',
      'phone',
      'cccd',
      'image',
      'address',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        throw new Error(`Trường thông tin '${field}' là bắt buộc để đăng ký đối tác mới`);
      }
    }

    if (body.phone && body.phone.length < 10) {
      throw new Error('Số điện thoại liên hệ phải chứa ít nhất 10 chữ số');
    }

    if (body.cccd && body.cccd.length !== 12) {
      throw new Error('Số căn cước công dân (CCCD) phải chứa đúng 12 chữ số');
    }
  }
}
