// // import { otpStore } from "./otp.store";

// // export const otpService = {
// //   async sendOtp(phone: string) {
// //     if (!phone) throw new Error("Thiếu số điện thoại!");

// //     const otp = Math.floor(100000 + Math.random() * 900000);
// //     otpStore[phone] = otp;

// //     console.log(`[DEV] OTP for ${phone}: ${otp}`);
// //     return { success: true, message: `OTP ảo đã gửi tới ${phone}`, otp };
// //   },

// //   async verifyOtp(phone: string, otp: number) {
// //     const realOtp = otpStore[phone];
// //     if (!realOtp) throw new Error("OTP chưa gửi hoặc đã hết hạn!");

// //     if (parseInt(otp.toString()) === realOtp) {
// //       delete otpStore[phone];
// //       return { success: true, message: "Xác minh thành công!" };
// //     } else {
// //       return { success: false, message: "OTP không đúng!" };
// //     }
// //   },
// // };

// import { Resend } from 'resend';
// import { otpStore } from './otp.store';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const otpService = {
//   async sendOtp(email: string) {
//     if (!email) throw new Error('Thiếu email!');
//     // Rate limit: không gửi lại nếu chưa đến 1 phút
//     const normalizedEmail = email.trim().toLowerCase();

//     const existing = otpStore[normalizedEmail];
//     if (existing && Date.now() < existing.expiry - 4 * 60 * 1000) {
//       throw new Error('Vui lòng chờ 1 phút trước khi gửi lại!');
//     }
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     otpStore[normalizedEmail] = {
//       code: otp,
//       expiry: Date.now() + 5 * 60 * 1000, // hết hạn sau 5 phút
//     };
//     try {
//       await resend.emails.send({
//         from: 'onboarding@resend.dev',
//         to: email,
//         subject: 'Mã OTP xác nhận',
//         html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
//             <h2 style="color: #333;">Xác thực tài khoản của bạn</h2>
//             <p style="color: #666;">Sử dụng mã OTP dưới đây để hoàn tất quá trình đăng ký:</p>

//             <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px dashed #ddd;">
//               <p style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #ff6600; margin: 0;">${otp}</p>
//             </div>

//             <p style="font-size: 14px; color: #888;">Mã có hiệu lực trong <b style="color: #333;">5 phút</b>.</p>

//             <!-- Khối cảnh báo bảo mật -->
//             <div style="background-color: #fff4f4; padding: 15px; border-radius: 8px; border-left: 4px solid #ff4d4d; text-align: left; margin-top: 25px;">
//               <p style="margin: 0; font-size: 13px; color: #d93025; line-height: 1.5;">
//                 <b>⚠️ CẢNH BÁO BẢO MẬT:</b><br>
//                 • <b>TUYỆT ĐỐI KHÔNG</b> cung cấp mã này cho bất kỳ ai, kể cả nhân viên hỗ trợ khách hàng.<br>
//                 • Mã này chỉ dành riêng cho bạn để xác thực tài khoản trên hệ thống của chúng tôi.<br>
//                 • Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ hỗ trợ nếu thấy dấu hiệu bất thường.
//               </p>
//             </div>

//             <p style="margin-top: 25px; font-size: 12px; color: #aaa;">Đây là email tự động, vui lòng không phản hồi email này.</p>
//           </div>
//         `,
//       });
//       console.log('✅ Gửi mail thành công tới:', email);
//     } catch (mailErr: any) {
//       console.error('❌ Lỗi resend:', mailErr.message);
//       throw new Error('Không thể gửi email: ' + mailErr.message);
//     }
//     return { success: true, message: `OTP đã gửi tới ${email}` };
//   },

//   async verifyOtp(email: string, otp: number) {
//     if (!email || !otp) throw new Error('Thiếu thông tin!');

//     const normalizedEmail = email.trim().toLowerCase();
//     const record = otpStore[normalizedEmail]; // Tìm bằng email đã chuẩn hóa

//     if (!record) {
//       // Đổi message để FE dễ phân biệt
//       throw new Error('Mã OTP không tồn tại hoặc đã hết hạn!');
//     }

//     if (Date.now() > record.expiry) {
//       delete otpStore[normalizedEmail];
//       throw new Error('Mã OTP đã hết hạn!');
//     }

//     if (Number(otp) !== record.code) {
//       // Trả về success false chứ không throw Error để FE nhận diện dễ hơn
//       return { success: false, message: 'Mã OTP không chính xác!' };
//     }

//     delete otpStore[normalizedEmail];
//     return { success: true, message: 'Xác minh thành công!' };
//   },
// };

import Brevo from '@getbrevo/brevo';
import { otpStore } from './otp.store';

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string,
);
export const otpService = {
  async sendOtp(email: string) {
    if (!email) throw new Error('Thiếu email!');

    // GIỮ NGUYÊN 100% LOGIC RATE LIMIT VÀ CHUẨN HÓA
    const normalizedEmail = email.trim().toLowerCase();

    const existing = otpStore[normalizedEmail];
    if (existing && Date.now() < existing.expiry - 4 * 60 * 1000) {
      throw new Error('Vui lòng chờ 1 phút trước khi gửi lại!');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[normalizedEmail] = {
      code: otp,
      expiry: Date.now() + 5 * 60 * 1000, // hết hạn sau 5 phút
    };

    try {
      // Cấu hình email gửi đi theo định dạng Brevo
      // GIỮ NGUYÊN 100% TEMPLATE HTML CŨ ĐỂ KHÔNG ĐỔI UI/UX
      const sendSmtpEmail = {
        subject: 'Mã OTP xác nhận',
        htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333;">Xác thực tài khoản của bạn</h2>
            <p style="color: #666;">Sử dụng mã OTP dưới đây để hoàn tất quá trình đăng ký:</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px dashed #ddd;">
              <p style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #ff6600; margin: 0;">${otp}</p>
            </div>
          
            <p style="font-size: 14px; color: #888;">Mã có hiệu lực trong <b style="color: #333;">5 phút</b>.</p>
          
            <!-- Khối cảnh báo bảo mật -->
            <div style="background-color: #fff4f4; padding: 15px; border-radius: 8px; border-left: 4px solid #ff4d4d; text-align: left; margin-top: 25px;">
              <p style="margin: 0; font-size: 13px; color: #d93025; line-height: 1.5;">
                <b>⚠️ CẢNH BÁO BẢO MẬT:</b><br>
                • <b>TUYỆT ĐỐI KHÔNG</b> cung cấp mã này cho bất kỳ ai, kể cả nhân viên hỗ trợ khách hàng.<br>
                • Mã này chỉ dành riêng cho bạn để xác thực tài khoản trên hệ thống của chúng tôi.<br>
                • Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ hỗ trợ nếu thấy dấu hiệu bất thường.
              </p>
            </div>
          
            <p style="margin-top: 25px; font-size: 12px; color: #aaa;">Đây là email tự động, vui lòng không phản hồi email này.</p>
          </div>
        `,
        sender: {
          name: process.env.BREVO_SENDER_NAME || 'Badafuta Support',
          email: process.env.BREVO_SENDER_EMAIL || 'baotruong.190404@gmail.com',
        },
        to: [{ email: normalizedEmail }],
      };

      // Thực hiện gửi qua Brevo SDK
      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ Gửi mail qua Brevo thành công tới:', email);
    } catch (error: any) {
      console.error('❌ Lỗi Brevo:', error.message);
      // Giữ nguyên kiểu throw lỗi để Frontend bắt được
      throw new Error('Không thể gửi email: ' + error.message);
    }

    // GIỮ NGUYÊN RETURN FORMAT CŨ
    return { success: true, message: `OTP đã gửi tới ${email}` };
  },

  // GIỮ NGUYÊN 100% LOGIC VERIFY CŨ
  async verifyOtp(email: string, otp: number) {
    if (!email || !otp) throw new Error('Thiếu thông tin!');

    const normalizedEmail = email.trim().toLowerCase();
    const record = otpStore[normalizedEmail];

    if (!record) {
      throw new Error('Mã OTP không tồn tại hoặc đã hết hạn!');
    }

    if (Date.now() > record.expiry) {
      delete otpStore[normalizedEmail];
      throw new Error('Mã OTP đã hết hạn!');
    }

    if (Number(otp) !== record.code) {
      // Giữ nguyên format phản hồi thất bại để FE hiện đúng UI chữ đỏ
      return { success: false, message: 'Mã OTP không chính xác!' };
    }

    delete otpStore[normalizedEmail];
    return { success: true, message: 'Xác minh thành công!' };
  },
};
