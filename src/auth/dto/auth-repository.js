import { PrismaClient } from '@prisma/client';
export class AuthRepository {
  constructor() {
    this.prisma = new PrismaClient();
  }
  async findByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
  async findByVerificationToken(token) {
    return this.prisma.token.findUnique({
      where: { token },
    });
  }
  async verifyUser(userId) {
    return this.prisma.user.update({
      where: { userId },
      data: { isVerified: true, expiresAt: null },
    });
  }
  async setVereificationToken(userId, token, expiresAt) {
    return this.prisma.token.update({
      where: { userId },
      data: { token, expiresAt },
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
      const expiresAt = tokenExpiration ? new Date(tokenExpiration) : undefined;
      await this.prisma.token.create({
        data: {
          token: verificationToken,
          email: email,
          type: 'VERIFICATION',
          expiresAt: expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
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
