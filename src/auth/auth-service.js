import bcrypt from 'bcryptjs';

import { mailService } from '../mail/mail-service.js';
import { AuthRepositoryUsers } from '../user/user-repository.js';
import { AuthRepositoryTokens } from '../token/token-repository.js';
import { TokenService } from '../token/token-service.js';

export class AuthService {
  constructor() {
    this.AuthRepositoryUsers = new AuthRepositoryUsers();
    this.AuthRepositoryTokens = new AuthRepositoryTokens();
    this.tokenService = new TokenService();
    this.mailService = mailService;
  }

  async registerUser(data, session) {
    const candidate = await this.AuthRepositoryUsers.findByEmail(data.email);
    if (candidate) {
      throw new Error(`User with email ${data.email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 7);

    const user = await this.AuthRepositoryUsers.registerUser(
      data.email,
      hashedPassword,
      data.username,
      data.role || 'USER'
    );

    try {
      const verificationToken =
        await this.tokenService.generateVerificationToken(user.email);

      if (this.mailService) {
        await this.mailService.sendVerificationEmail(
          user.email,
          verificationToken
        );
      }
    } catch (error) {
      console.log(error);
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
      } catch (error) {
        console.log(error);
      }
    }
    return sessionUser;
  }

  async verifyEmail(token) {
    if (!token) {
      throw new Error('Verification token is required');
    }
    const tokenRecord = await this.AuthRepositoryTokens.findByVerificationToken(
      token
    );
    if (!tokenRecord) {
      throw new Error('Invalid or expired verification token');
    }
    const user = await this.AuthRepositoryUsers.findByEmail(tokenRecord.email);
    if (!user) throw new Error('User not found');
    await this.AuthRepositoryUsers.verifyUser(user.userId);
    return { message: 'Email successfully verified' };
  }

  async resendVerificationEmail(email) {
    if (!email) {
      throw new Error('Email is required');
    }

    const user = await this.AuthRepositoryUsers.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('Email is already verified');
    }

    const verificationToken = await this.tokenService.generateVerificationToken(
      email
    );

    if (this.mailService) {
      try {
        await this.mailService.sendVerificationEmail(email, verificationToken);
      } catch (error) {
        console.log(error);
        throw new Error('Failed to send verification email');
      }
    } else {
      throw new Error('Mail service not available');
    }

    return { message: 'Verification email sent successfully' };
  }

  async login(data, session) {
    if (!data?.username || !data?.password) {
      throw new Error('username and password are required');
    }
    const user = await this.AuthRepositoryUsers.findByUsername(data.username);
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
      } catch (error) {
        console.log(error);
      }
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
        } catch (error) {
          console.log(error);
        }
        resolve();
      });
    });
  }

  async resetPassword(email) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const user = await this.AuthRepositoryUsers.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = await this.tokenService.generatePasswordResetToken(
        email
      );

      if (this.mailService) {
        try {
          await this.mailService.sendResetPasswordEmail(user.email, resetToken);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log('Mail service not available');
      }
      return { message: 'Password reset email sent' };
    } catch (error) {
      console.log(error);
      throw new Error('Password reset error');
    }
  }

  async confirmResetPassword(token, newPassword) {
    const tokenRecord =
      await this.AuthRepositoryTokens.findByPasswordResetToken(token);
    if (!tokenRecord || tokenRecord.expiresAt < Date.now()) {
      throw new Error('Invalid or expired token');
    }

    const user = await this.AuthRepositoryUsers.findByEmail(tokenRecord.email);
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.AuthRepositoryUsers.updatePassword(user.userId, hashedPassword);

    await this.AuthRepositoryTokens.deleteToken(token);

    return { message: 'Password successfully updated' };
  }
}
