import Router from 'express';
import authController from './auth-controller.js';
import { check } from 'express-validator';
import { authmiddle } from './middlewareapp/auth-middleware.js';
import { rolemiddle } from './middlewareapp/role-middleware.js';

const router = new Router();

router.post(
  '/registration',
  [
    check('username', 'username cannot be empty').notEmpty(),
    check('password', 'password could be longer than 4 symbols').isLength({
      min: 4,
    }),
  ],
  authController.registration
);
router.post('/login', authController.login);
router.get('/users', rolemiddle(['ADMIN']), authController.getUsers);

export default router;
