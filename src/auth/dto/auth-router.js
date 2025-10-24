import Router from 'express';

import { AuthRepository } from './auth-repository.js';
import authController from '../../controllers/auth-controller.js';
import { loginLimiter } from '../../middlewareapp/login-limit.js';
import {
  validateDTO,
  isAuth,
  roleAdmin,
} from '../../middlewareapp/auth-middleware.js';
import { RegisterUserDTO } from '../../utils/register-dto.js';
import { loginUserDTO } from '../../utils/login-dto.js';

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
router.get('/users', isAuth, roleAdmin, authController.getUsers);
router.get('/verify', authController.verifyEmail);

export default router;
