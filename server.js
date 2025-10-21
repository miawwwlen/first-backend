import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import router from './src/auth-router.js';
import { RedisClient } from './redis.js';
dotenv.config();

const app = express();
app.use(express.json());

app.use(
  session({
    store: new RedisStore({ client: RedisClient, prefix: 'session:' }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 3,
    },
  })
);

app.use('/auth', router);

app.get('/', (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.send(`Number of views: ${req.session.views}`);
});

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});
