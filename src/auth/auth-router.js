import Router from 'express';

import authController from './auth-controller.js';
import { loginLimiter } from '../middlewares/login-limit.js';
import { validateDTO } from '../middlewares/validate-middleware.js';
import { isAdmin } from '../middlewares/is-admin-middleware.js';
import { isAuth } from '../middlewares/is-auth-middleware.js';
import { RegisterUserDTO } from './dto/register-dto.js';
import { loginUserDTO } from './dto/login-dto.js';

const router = new Router();

router.post(
  '/registration',
  loginLimiter,
  validateDTO(RegisterUserDTO),
  authController.registration
);
router.post(
  '/login',
  loginLimiter,
  validateDTO(loginUserDTO),
  authController.login
);
router.post('/logout', isAuth, authController.logout);
router.get('/users', isAuth, isAdmin, authController.getUsers);
router.get('/verify-email', isAuth, authController.verifyEmail);
router.post('/reset-password', isAuth, authController.resetPassword);

export default router;
