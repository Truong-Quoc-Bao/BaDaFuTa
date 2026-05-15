// import { otpStore } from "./otp.store";

// export const otpService = {
//   async sendOtp(phone: string) {
//     if (!phone) throw new Error("Thiếu số điện thoại!");

//     const otp = Math.floor(100000 + Math.random() * 900000);
//     otpStore[phone] = otp;

//     console.log(`[DEV] OTP for ${phone}: ${otp}`);
//     return { success: true, message: `OTP ảo đã gửi tới ${phone}`, otp };
//   },

//   async verifyOtp(phone: string, otp: number) {
//     const realOtp = otpStore[phone];
//     if (!realOtp) throw new Error("OTP chưa gửi hoặc đã hết hạn!");

//     if (parseInt(otp.toString()) === realOtp) {
//       delete otpStore[phone];
//       return { success: true, message: "Xác minh thành công!" };
//     } else {
//       return { success: false, message: "OTP không đúng!" };
//     }
//   },
// };

import nodemailer from 'nodemailer';
import { otpStore } from './otp.store';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // 👈
  port: 587, // 👈
  secure: false, // 👈
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const otpService = {
  async sendOtp(email: string) {
    if (!email) throw new Error('Thiếu email!');

    // Rate limit: không gửi lại nếu chưa đến 1 phút
    const existing = otpStore[email];
    if (existing && Date.now() < existing.expiry - 4 * 60 * 1000) {
      throw new Error('Vui lòng chờ 1 phút trước khi gửi lại!');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = {
      code: otp,
      expiry: Date.now() + 5 * 60 * 1000, // hết hạn sau 5 phút
    };

    try {
      // 👈

      await transporter.sendMail({
        from: `"App của bạn" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Mã OTP xác nhận',
        html: `
        <h2>Mã OTP của bạn</h2>
        <p style="font-size:32px;font-weight:bold;letter-spacing:8px">${otp}</p>
        <p>Mã có hiệu lực trong <b>5 phút</b>.</p>
        <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      `,
      });

      console.log('✅ Gửi mail thành công tới:', email); // 👈
    } catch (mailErr: any) {
      // 👈
      console.error('❌ Lỗi nodemailer:', mailErr.message); // 👈
      throw new Error('Không thể gửi email: ' + mailErr.message); // 👈
    }

    return { success: true, message: `OTP đã gửi tới ${email}` };
  },

  async verifyOtp(email: string, otp: number) {
    if (!email || !otp) throw new Error('Thiếu thông tin!');

    const record = otpStore[email];
    if (!record) throw new Error('OTP chưa được gửi!');
    if (Date.now() > record.expiry) {
      delete otpStore[email];
      throw new Error('OTP đã hết hạn!');
    }
    if (parseInt(otp.toString()) !== record.code) {
      return { success: false, message: 'OTP không đúng!' };
    }

    delete otpStore[email];
    return { success: true, message: 'Xác minh thành công!' };
  },
};
