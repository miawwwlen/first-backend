import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const generatedAccessToken = (id, role) => {
  const payload = {
    id,
    role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Registration error', errors });
      }
      const { username, password, email } = req.body;
      const existingUser = await prisma.user.findMany({
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
          userId: true,
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
      const { username, password } = req.body;
      const user = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });
      if (!user) {
        return res.status(400).json({
          error: `User with this ${username} not found`,
        });
      }
      const validPassword = bcrypt.compareSync(password, user.hashedPassword);
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
