import Twilio from "twilio";

const client = Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendOtp = async (req, res) => {
  try {
    let { phone } = req.body;

    // Chuyển số về dạng +84...
    if (phone.startsWith("0")) phone = "+84" + phone.slice(1);

    const verification = await client.verify
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: phone, channel: "sms" });

    return res.json({ success: true, message: "OTP đã gửi thành công!" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Không thể gửi OTP!" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    let { phone, otp } = req.body;

    if (phone.startsWith("0")) phone = "+84" + phone.slice(1);

    const verificationCheck = await client.verify
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phone, code: otp });

    if (verificationCheck.status === "approved") {
      return res.json({ success: true, message: "Xác minh thành công!" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "OTP không đúng!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};
