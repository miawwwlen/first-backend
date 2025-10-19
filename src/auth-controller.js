import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

class authController {
  async registration(req, res) {
    try {
      const { username, password, email } = req.body;
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        if (existingUser.username === username) {
          return res.status(400).json({
            error: 'User with this username already exists',
          });
        }
        if (existingUser.email === email) {
          return res.status(400).json({
            error: 'User with this email already exists',
          });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 7);
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          hashedPassword,
          role: 'USER',
          isVerified: false,
        },
        select: {
          username: true,
          email: true,
          role: true,
        },
      });

      res
        .status(201)
        .json({ message: 'User registred sucessfully', user: newUser });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Registration error' });
    }
  }

  async login(req, res) {
    try {
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'login error' });
    }
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
