import { AuthRepositoryUsers } from './user-repository.js';

export class UserService {
  constructor() {
    this.userRepository = new AuthRepositoryUsers();
  }

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async updateUserProfile(userId, data) {
    const existingUser = await this.userRepository.findByUserId(userId);
    if (!existingUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    if (data.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(data.email);
      if (emailExists) {
        throw new Error(`Email ${data.email} is already in use`);
      }
    }

    if (data.username !== existingUser.username) {
      const usernameExists = await this.userRepository.findByUsername(
        data.username
      );
      if (usernameExists) {
        throw new Error(`Username ${data.username} is already taken`);
      }
    }

    return this.userRepository.updateUserProfile(userId, data);
  }
}
