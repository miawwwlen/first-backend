import { PrismaClient } from '@prisma/client/extension';

export class AuthRepository {
  constructor() {
    this.prisma = new PrismaClient();
  }
  async registerUser(email, hashedPassword, username) {
    return this.prisma.user.create({
      data: {
        email: email,
        hashedPassword: hashedPassword,
        username: username,
      },
    });
  }
}
