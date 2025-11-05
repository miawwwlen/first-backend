import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';

import router from './src/auth/auth-router.js';
import { getSession } from './src/common/utils/config/session-config.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(getSession);

app.use('/auth', router);

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});
