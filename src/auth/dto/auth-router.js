import Router from 'express';
import AuthRepository from './auth-repository.js';
import authController from '../../controllers/auth-controller.js';
import { loginLimiter } from '../../middlewareapp/login-limit.js';
import { authmiddle } from '../../middlewareapp/auth-middleware.js';
import { rolemiddle } from '../../middlewareapp/role-middleware.js';

const router = new Router();

router.post('/registration', loginLimiter, authController.registration);
router.post('/login', loginLimiter, authmiddle, authController.login);
router.post('/logout', authController.logout);
router.get('/users', rolemiddle(['ADMIN']), authController.getUsers);

export default router;
