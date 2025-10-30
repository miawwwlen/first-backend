import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { RedisStore } from 'connect-redis';
import 'reflect-metadata';

import router from './src/auth/auth-router.js';
import { RedisClient } from './redis.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    store: new RedisStore({ client: RedisClient, prefix: 'session:' }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use('/auth', router);

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});
