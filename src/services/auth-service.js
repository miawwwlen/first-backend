import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { mailService } from '../utils/mail-service.js';
import { AuthRepository } from '../auth/dto/auth-repository.js';

export class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  async registerUser(data, session) {
    const candidate = await this.authRepository.findByEmail(data.email);
    if (candidate) {
      throw new Error(`User with email ${data.email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 7);
    const verificationToken = uuidv4();
    const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000;

    const user = await this.authRepository.registerUser(
      data.email,
      hashedPassword,
      data.username,
      data.role || 'USER',
      verificationToken,
      tokenExpiration
    );

    if (
      mailService &&
      typeof mailService.sendVerificationEmail === 'function'
    ) {
      try {
        await mailService.sendVerificationEmail(user.email, verificationToken);
      } catch (e) {
        console.warn('Failed to send verification email:', e.message || e);
      }
    }

    const sessionUser = {
      userId: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    if (session) {
      try {
        session.user = sessionUser;
      } catch (e) {}
    }

    return sessionUser;
  }

  async verifyEmail(token) {
    if (!token) {
      throw new Error('Verification token is required');
    }
    const tokenRecord = await this.authRepository.findByVerificationToken(
      token
    );
    if (!tokenRecord) {
      throw new Error('Invalid or expired verification token');
    }
    const user = await this.authRepository.findByEmail(tokenRecord.email);
    if (!user) throw new Error('User for token not found');
    await this.authRepository.verifyUser(user.userId);
    return { message: 'Email successfully verified' };
  }

  async login(data, session) {
    if (!data?.username || !data?.password) {
      throw new Error('username and password are required');
    }
    const user = await this.authRepository.findByUsername(data.username);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.hashedPassword
    );
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const sessionUser = {
      userId: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    if (session) {
      try {
        session.user = sessionUser;
      } catch (e) {}
    }

    return sessionUser;
  }

  async logout(req) {
    return new Promise((resolve, reject) => {
      if (!req || !req.session) return resolve();
      req.session.destroy((err) => {
        if (err) return reject(err);
        try {
          req.res && req.res.clearCookie && req.res.clearCookie('connect.sid');
        } catch (e) {}
        resolve();
      });
    });
  }
}
