// src/modules/users/user.service.ts
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import * as userRepo from './user.repository';
import { RegisterInput, LoginInput } from './user.types';
import { sendEmail } from '../../../libs/mailer';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

function withCode(err: Error, code: string) {
  (err as any).code = code;
  return err;
}

export const forgotPassword = async (email: string) => {
  // 1. Tìm kiếm user
  const user = await userRepo.findByEmail(email);
  if (!user) {
    // return; // Bảo mật: Không thông báo lỗi cụ thể để tránh dò tìm email
    throw new Error('Email này chưa được đăng ký trên hệ thống BADAFUTA!');
  }

  // LỚP CHẶN SPAM GỬI MAIL (RATE LIMIT 2 PHÚT)
  if (user.resetPasswordExpire) {
    const remainingTime = user.resetPasswordExpire.getTime() - Date.now();
    const elapsedTime = 15 * 60 * 1000 - remainingTime; // 15 phút ban đầu trừ đi thời gian còn lại
    const cooldownTime = 2 * 60 * 1000; // Cooldown 2 phút (120.000 ms)

    if (elapsedTime < cooldownTime) {
      const secondsToWait = Math.ceil((cooldownTime - elapsedTime) / 1000);
      throw new Error(`Vui lòng chờ ${secondsToWait} giây trước khi yêu cầu gửi lại email!`);
    }
  }

  // 2. Tạo token ngẫu nhiên và thời gian hết hạn (15 phút)
  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenExpireTime = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

  // 3. Lưu thông tin token vào database
  await userRepo.saveResetToken(user.id, resetToken, tokenExpireTime);

  // 4. Chuẩn bị nội dung gửi mail (Đồng bộ thiết kế với email OTP đăng ký cũ)
  const resetUrl = `https://ba-da-fu-ta-food.vercel.app/resetpass?token=${resetToken}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #333;">Yêu cầu đặt lại mật khẩu</h2>
      <p style="color: #666;">Chúng tôi nhận được yêu cầu thiết lập lại mật khẩu cho tài khoản BADAFUTA của bạn:</p>
      
      <!-- Nút đổi mật khẩu màu cam thương hiệu -->
      <div style="margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #ff6600; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(255, 102, 0, 0.2);">Đặt lại mật khẩu</a>
      </div>
    
      <p style="font-size: 14px; color: #888;">Đường dẫn này có hiệu lực trong vòng <b style="color: #333;">15 phút</b>.</p>
    
      <!-- Khối cảnh báo bảo mật đồng bộ -->
      <div style="background-color: #fff4f4; padding: 15px; border-radius: 8px; border-left: 4px solid #ff4d4d; text-align: left; margin-top: 25px;">
        <p style="margin: 0; font-size: 13px; color: #d93025; line-height: 1.5;">
          <b>⚠️ CẢNH BÁO BẢO MẬT:</b><br>
          • <b>TUYỆT ĐỐI KHÔNG</b> chia sẻ liên kết này cho bất kỳ ai khác.<br>
          • Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ bộ phận hỗ trợ khách hàng của BADAFUTA ngay lập tức.
        </p>
      </div>
    
      <p style="margin-top: 25px; font-size: 12px; color: #aaa;">Đây là email tự động, vui lòng không phản hồi email này.</p>
    </div>
  `;

  // Gửi mail thông qua helper dùng chung
  await sendEmail(email, 'Yêu cầu đặt lại mật khẩu tài khoản BADAFUTA', htmlContent);
};

// export const resetPassword = async (token: string, newPassword: string) => {
//   const user = await userRepo.findByResetToken(token);
//   if (!user) {
//     throw new Error('Liên kết không hợp lệ hoặc đã hết hạn.');
//   }

//   if (user.resetPasswordExpire && new Date() > user.resetPasswordExpire) {
//     throw new Error('Liên kết đặt lại mật khẩu đã hết hạn.');
//   }

//   const hashedPassword = await bcrypt.hash(newPassword, 10);

//   await userRepo.updatePasswordAndClearToken(user.id, hashedPassword);
// };
//
//
// src/modules/users/user.service.ts

export const resetPassword = async (token: string, newPassword: string) => {
  // LỚP BẢO VỆ 1: Bắt buộc token phải tồn tại, là chuỗi và không được rỗng/undefined
  if (!token || typeof token !== 'string' || token.trim() === '') {
    throw new Error('Liên kết không hợp lệ hoặc đã hết hạn.');
  }

  // 1. Tìm user bằng token
  const user = await userRepo.findByResetToken(token);

  // LỚP BẢO VỆ 2: Đề phòng Prisma bỏ qua 'undefined' trả về user đầu tiên có token = null
  // Kiểm tra xem token trong database của user tìm được có khớp chính xác với token gửi lên hay không
  if (!user || user.resetPasswordToken !== token) {
    throw new Error('Liên kết không hợp lệ hoặc đã hết hạn.');
  }

  // LỚP BẢO VỆ 3: Đảm bảo trường thời gian hết hạn bắt buộc phải có và chưa quá hạn
  if (!user.resetPasswordExpire || new Date() > user.resetPasswordExpire) {
    throw new Error('Liên kết đặt lại mật khẩu đã hết hạn.');
  }

  // 3. Mã hóa mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4. Cập nhật mật khẩu mới và xóa sạch các trường token cũ trong database
  await userRepo.updatePasswordAndClearToken(user.id, hashedPassword);
};
//
//
export const register = async (data: RegisterInput) => {
  const email = (data.email || '').trim().toLowerCase();
  const phone = (data.phone || '').trim();
  const full_name = (data.full_name || '').trim();
  const plainPass = (data.password || '').trim();
  const role = (data.role as any) || 'customer';

  // Tồn tại email/phone?
  // const existingEmail = await userRepo.findByEmail(email);
  // if (existingEmail)
  //   throw withCode(new Error("Email đã tồn tại"), "AUTH_EMAIL_EXISTS");

  // const existingPhone = await userRepo.findByPhone(phone);
  // if (existingPhone)
  //   throw withCode(new Error("Số điện thoại đã tồn tại"), "AUTH_PHONE_EXISTS");

  const [existingEmail, existingPhone] = await Promise.all([
    userRepo.findByEmail(email),
    userRepo.findByPhone(phone),
  ]);

  // Kiểm tra và throw lỗi theo ưu tiên hoặc gộp lỗi
  if (existingEmail && existingPhone) {
    // Nếu bạn muốn báo cả hai, nhưng thông thường ta vẫn chọn 1 cái để báo trước
    // Hoặc tạo một error_code đặc biệt
    throw withCode(new Error('Email và Số điện thoại đều đã tồn tại'), 'AUTH_BOTH_EXISTS');
  }

  if (existingEmail) throw withCode(new Error('Email đã tồn tại'), 'AUTH_EMAIL_EXISTS');

  if (existingPhone) throw withCode(new Error('Số điện thoại đã tồn tại'), 'AUTH_PHONE_EXISTS');

  const hashedPassword = await bcrypt.hash(plainPass, 10);

  const user = await userRepo.create({
    full_name,
    email,
    phone,
    password: hashedPassword, // hiện đang dùng field 'password' để lưu hash
    role,
  } as any);

  return user;
};

export const login = async (data: LoginInput) => {
  const identifier = (data.identifier || '').trim();
  const plainPass = (data.password || '').trim();

  // Tìm theo email (lowercase) hoặc phone
  const user =
    (await userRepo.findByEmail(identifier.toLowerCase())) ||
    (await userRepo.findByPhone(identifier));

  if (!user) throw withCode(new Error('Tài khoản không tồn tại'), 'AUTH_USER_NOT_FOUND');

  const hash = (user as any).password;
  if (!hash || typeof hash !== 'string') {
    throw withCode(new Error('Tài khoản chưa có mật khẩu hợp lệ'), 'AUTH_PASSWORD_MISSING');
  }

  const valid = await bcrypt.compare(plainPass, hash);
  if (!valid) throw withCode(new Error('Mật khẩu không đúng'), 'AUTH_WRONG_PASSWORD');

  return user;
};

// login google

const client = new OAuth2Client(
  '138305516299-2e9fia9gnhnl4k72j7a67h3a47krl68v.apps.googleusercontent.com',
);

// Thêm hàm loginGoogle này vào file user.service.ts
export const loginGoogle = async (idToken: string) => {
  // 1. Xác thực ID Token do Google gửi lên có hợp lệ không
  const ticket = await client.verifyIdToken({
    idToken,
    audience: '138305516299-2e9fia9gnhnl4k72j7a67h3a47krl68v.apps.googleusercontent.com',
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Mã xác thực Google không hợp lệ.');
  }

  const email = payload.email.trim().toLowerCase();
  const fullName = payload.name || 'Người dùng Google';

  // 2. Kiểm tra xem người dùng này đã có tài khoản trong hệ thống chưa
  let user = await userRepo.findByEmail(email);

  if (!user) {
    // 3. Nếu chưa có, tiến hành đăng ký tài khoản tự động
    const randomPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Tạo số điện thoại ảo tạm thời vì Google không trả về SĐT (Người dùng sẽ cập nhật trong Profile sau)
    const tempPhone = 'GG_' + crypto.randomBytes(6).toString('hex');

    user = await userRepo.create({
      full_name: fullName,
      email: email,
      phone: tempPhone,
      password: hashedPassword,
      role: 'customer',
    } as any);
  }

  // 4. Phát hành mã Token JWT của hệ thống bạn
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });

  return { user, token };
};
