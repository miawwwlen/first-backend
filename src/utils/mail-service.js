import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

class MailServiceClass {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  // <-- имя метода совпадает с тем, что ты вызвал в сервисе
  async sendVerificationEmail(to, token) {
    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const html = `<p>Please verify your email by clicking the link below:</p>
                  <a href="${url}">${url}</a>`;
    return this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Email Verification',
      html,
    });
  }
}

export const mailService = new MailServiceClass();
