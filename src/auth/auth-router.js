import Router from 'express';

import authController from './auth-controller.js';
import UserController from '../user/user-controller.js';
import { loginLimiter } from '../common/middlewares/login-limit.js';
import { validateDTO } from '../common/middlewares/validate-middleware.js';
import { isAdmin } from '../common/middlewares/is-admin-middleware.js';
import { isAuth } from '../common/middlewares/is-auth-middleware.js';
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
router.get('/users', isAuth, isAdmin, UserController.getAllUsers);
router.get('/verify-email', isAuth, authController.verifyEmail);
router.get(
  '/verify-email/resend',
  isAuth,
  authController.resendVerificationEmail
);
router.post('/verify-email/confirm', isAuth, authController.confirmVerifyEmail);
router.post('/reset-password', authController.resetPassword);
router.post('/reset-password/confirm', authController.confirmResetPassword);
router.put('/update-profile', isAuth, UserController.updateUserProfile);

export default router;
