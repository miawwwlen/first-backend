import dotenv from 'dotenv';
import { AuthService } from './auth-service.js';

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

  async confirmVerifyEmail(req, res) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }
      const result = await authService.verifyEmail(token);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: 'Verification failed' });
    }
  }

  async resendVerificationEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const result = await authService.resendVerificationEmail(email);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Failed to resend verification email' });
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

  async resetPassword(req, res) {
    try {
      const { email } = req.session?.user?.email ? req.session.user : req.body;
      await authService.resetPassword(email);
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Password reset error' });
    }
  }

  async confirmResetPassword(req, res) {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ message: 'Token and password required' });
      }

      const result = await authService.confirmResetPassword(token, password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: 'error.message' });
    }
  }
}
export default new authController();
