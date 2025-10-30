import dotenv from 'dotenv';
import { AuthService } from '../services/auth-service.js';

const authService = new AuthService();

dotenv.config();

class authController {
  async registration(req, res) {
    try {
      const userSession = await authService.registerUser(req.body, req.session);
      res.status(201).json({ message: 'User registered', user: userSession });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Invalid registration data' });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      const result = await authService.verifyEmail(token);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Email verification error' });
    }
  }

  async login(req, res) {
    try {
      const user = await authService.login(req.body, req.session);
      res.status(200).json({ message: 'User logged in', user });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'login error' });
    }
  }

  async logout(req, res) {
    try {
      await authService.logout(req);
      return res.status(200).json({ message: 'Logged out' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Logout failed' });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await authService.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
    }
  }

  async resetPassword(req, res) {
    try {
      const { email } = req.body;
      await authService.resetPassword(email);
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Password reset error' });
    }
  }
}
export default new authController();
