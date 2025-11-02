import { v4 as uuidv4 } from 'uuid';

import { AuthRepositoryTokens } from './auth-repository-tokens.js';

export class TokenService {
  constructor() {
    this.tokenRepository = new AuthRepositoryTokens();
  }
  async generateVerificationToken(userId) {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.tokenRepository.setVereificationToken(userId, token, expiresAt);
    return token;
  }
  async generatePasswordResetToken(email) {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await this.tokenRepository.savePasswordResetToken(email, token, expiresAt);
    return token;
  }
}
