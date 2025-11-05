import { PrismaClient } from '@prisma/client';
import { AuthRepositoryTokens } from '../token/token-repository.js';

export class AuthRepositoryUsers {
  constructor() {
    this.prisma = new PrismaClient();
    this.tokenRepository = new AuthRepositoryTokens();
  }

  async findByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUserId(userId) {
    return this.prisma.user.findUnique({
      where: { userId },
    });
  }

  async findByUsername(username) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async verifyUser(userId) {
    return this.prisma.user.update({
      where: { userId },
      data: { isVerified: true },
    });
  }

  async updatePassword(userId, hashedPassword) {
    return this.prisma.user.update({
      where: { userId },
      data: { hashedPassword },
      select: {
        userId: true,
        email: true,
        username: true,
      },
    });
  }

  async registerUser(
    email,
    hashedPassword,
    username,
    role = 'USER',
    verificationToken = null,
    tokenExpiration = null
  ) {
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        hashedPassword,
        role,
      },
      select: {
        userId: true,
        email: true,
        username: true,
        role: true,
      },
    });

    if (verificationToken) {
      const expiresAt = tokenExpiration
        ? new Date(Date.now() + tokenExpiration)
        : new Date(Date.now() + 24 * 60 * 60 * 1000);
      await this.prisma.token.create({
        data: {
          token: verificationToken,
          email: email,
          type: 'VERIFICATION',
          expiresAt: expiresAt,
        },
      });
    }

    return user;
  }

  async loginUser(email) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUserProfile(userId, data) {
    return this.prisma.user.update({
      where: { userId },
      data,
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        userId: true,
        email: true,
        username: true,
        role: true,
        isVerified: true,
      },
    });
  }
}
