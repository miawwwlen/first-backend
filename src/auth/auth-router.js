import Router from 'express';
import express from 'express';
import authController from '../controllers/auth-controller.js';
import { authmiddle } from '../middlewareapp/auth-middleware.js';
import { rolemiddle } from '../middlewareapp/role-middleware.js';

const router = new Router();

router.post('/registration', authController.registration);
router.post('/login', authmiddle, authController.login);
//router.poset('/logout', authController.logout);
router.get('/users', rolemiddle(['ADMIN']), authController.getUsers);

export default router;
