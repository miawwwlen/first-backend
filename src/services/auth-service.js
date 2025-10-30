import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { mailService } from '../mailServices/mail-service.js';
import { AuthRepositoryUsers } from '../auth/auth-repository-users.js';
import { AuthRepositoryTokens } from '../auth/auth-repository-tokens.js';

export class AuthService {
  constructor() {
    this.AuthRepositoryUsers = new AuthRepositoryUsers();
    this.AuthRepositoryTokens = new AuthRepositoryTokens();
    this.mailService = mailService;
  }

  async registerUser(data, session) {
    const candidate = await this.AuthRepositoryUsers.findByEmail(data.email);
    if (candidate) {
      throw new Error(`User with email ${data.email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 7);
    const verificationToken = uuidv4();
    const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000;

    const user = await this.AuthRepositoryUsers.registerUser(
      data.email,
      hashedPassword,
      data.username,
      data.role || 'USER',
      verificationToken,
      tokenExpiration
    );

    if (mailService) {
      try {
        await mailService.sendVerificationEmail(user.email, verificationToken);
      } catch (error) {
        console.log(error);
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
    const user = await this.AuthRepositoryTokens.findByEmail(tokenRecord.email);
    if (!user) throw new Error('User not found');
    await this.AuthRepositoryUsers.verifyUser(user.userId);
    return { message: 'Email successfully verified' };
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

  async resetPassword(req, res) {
    try {
      if (!req.cookies) {
        return res.status(400).json({ error: 'Cookies not available' });
      }

      const email = req.cookies.email;
      if (!email) {
        return res.status(400).json({ error: 'Email is required in cookies' });
      }

      const resetToken = uuidv4();
      const tokenExpiration = Date.now() + 1 * 60 * 60 * 1000;

      await this.AuthRepositoryTokens.savePasswordResetToken(
        email,
        resetToken,
        tokenExpiration
      );
      if (this.mailService) {
        try {
          await this.mailService.sendPasswordResetEmail(user.email, resetToken);
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
}
