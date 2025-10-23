import session from 'express-session';
import { RedisStore } from 'connect-redis';
import dotenv from 'dotenv';
import express from 'express';

import { RedisClient } from '../redis.js';

dotenv.config();

export const configureSession = (app = express()) =>
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
