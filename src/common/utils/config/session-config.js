import session from "express-session";
import { RedisStore } from "connect-redis";
import { RedisClient } from "../../../../redis.js";

export const getSession = session({
  store: new RedisStore({ client: RedisClient, prefix: "session:" }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
});
