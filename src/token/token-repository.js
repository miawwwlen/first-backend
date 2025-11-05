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

  async setVereificationToken(email, token, expiresAt) {
    return this.prisma.token.create({
      data: {
        email,
        token,
        type: 'VERIFICATION',
        expiresAt,
      },
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

  async findByPasswordResetToken(token) {
    return this.prisma.token.findUnique({
      where: { token },
    });
  }

  async deleteToken(token) {
    return this.prisma.token.delete({
      where: { token },
    });
  }
}
