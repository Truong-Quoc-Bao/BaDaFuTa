// src/libs/mailer.ts
import * as Brevo from '@getbrevo/brevo';

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string,
);

export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  const sendSmtpEmail = {
    subject,
    htmlContent,
    sender: {
      name: process.env.BREVO_SENDER_NAME || 'Badafuta Support',
      email: process.env.BREVO_SENDER_EMAIL || 'baotruong.190404@gmail.com',
    },
    to: [{ email: to.trim().toLowerCase() }],
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Gửi mail qua Brevo thành công tới:', to);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Lỗi gửi mail Brevo:', error.message);
    throw new Error('Không thể gửi email: ' + error.message);
  }
};
