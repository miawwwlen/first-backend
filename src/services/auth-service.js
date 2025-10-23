import { Session, SessionData } from 'express-session';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { AuthRepository } from '../auth/dto/auth-repository';
import { registerUserDTO } from '../utils/validate-dto';

export class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  async registerUser(data, Session) {
    const candidate = await this.authRepository.findByEmail(data.email);
    if (candidate) {
      throw new Error(`User with email ${data.email} already exists`);
    }

    const dto = registerUserDTO(data);
    const hashedPassword = await bcrypt.hash(data.password, 7);
    const verificationToken = uuidv4();
    const tokenExpiration = new (Date.now() * 24 * 60 * 60 * 1000)();
    const user = await this.authRepository.registerUser(
      data.email,
      hashedPassword,
      data.role || 'USER',
      verificationToken,
      tokenExpiration
    );
    Session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return Session.user;
  }
}
