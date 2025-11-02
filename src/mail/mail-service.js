import fs from 'fs';
import path from 'path';
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

  async sendVerificationEmail(to, token) {
    const templatePath = path.join(
      __dirname,
      'templates',
      './mail-templates/verify-template.html'
    );

    let html = fs.readFileSync(templatePath, 'utf-8');
    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    html = html.replace('{{verificationUrl}}', url);

    return this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Email Verification',
      html,
    });
  }

  async sendResetPasswordEmail(to, token) {
    const templatePath = path.join(
      __dirname,
      'templates',
      './mail-templates/reset-password-template.html'
    );

    let html = fs.readFileSync(templatePath, 'utf-8');
    const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    html = html.replace('{{resetPasswordUrl}}', url);

    return this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Password Reset',
      html,
    });
  }
}

export const mailService = new MailServiceClass();
