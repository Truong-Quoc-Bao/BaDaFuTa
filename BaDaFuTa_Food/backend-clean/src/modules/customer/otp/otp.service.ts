import { otpStore } from "./otp.store";

export const otpService = {
  async sendOtp(phone: string) {
    if (!phone) throw new Error("Thiếu số điện thoại!");

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[phone] = otp;

    console.log(`[DEV] OTP for ${phone}: ${otp}`);
    return { success: true, message: `OTP ảo đã gửi tới ${phone}`, otp };
  },

  async verifyOtp(phone: string, otp: number) {
    const realOtp = otpStore[phone];
    if (!realOtp) throw new Error("OTP chưa gửi hoặc đã hết hạn!");

    if (parseInt(otp.toString()) === realOtp) {
      delete otpStore[phone];
      return { success: true, message: "Xác minh thành công!" };
    } else {
      return { success: false, message: "OTP không đúng!" };
    }
  },
};
