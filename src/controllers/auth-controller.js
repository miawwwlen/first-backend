import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { AuthService } from '../service/auth-service.js';

dotenv.config();

const prisma = new PrismaClient();

class authController {
  async registration(req, res) {
    try {
      const userSession = await AuthService.registerUser(req.body, req.session);
      res.status(201).json({ user: userSession });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Invalid registration data' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (!user) {
        return res.status(400).json({
          error: `User with this ${username} not found`,
        });
      }

      const validPassword = await bcrypt.compare(password, user.hashedPassword);
      if (!validPassword) {
        return res.status(400).json({
          error: `password is Invalid`,
        });
      }
      const token = generatedAccessToken(user.userId, user.role);
      return res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'login error' });
    }
  }

  async logout(req, res) {
    try {
    } catch (error) {
      console.log(error);
    }
    res.status(400).json({ error: 'logout error' });
  }

  async getUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to fetch users' });
    }
  }
}

export default new authController();
