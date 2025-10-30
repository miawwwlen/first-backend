import { PrismaClient } from '@prisma/client';

export class AuthRepositoryTokens {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findByVerificationToken(token) {
    return this.prisma.token.findUnique({
      where: { token },
    });
  }

  async setVereificationToken(userId, token, expiresAt) {
    return this.prisma.token.update({
      where: { userId },
      data: { token, expiresAt },
    });
  }

  async savePasswordResetToken(email, token, expiresAt) {
    return this.prisma.token.create({
      data: {
        email,
        token,
        type: 'PASSWORD_RESET',
        expiresAt,
      },
    });
  }
}
