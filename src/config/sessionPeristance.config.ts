import session from "express-session";
import redis from "./redis.config";
import { RedisStore } from "connect-redis";
import crypto from "crypto";
import ENV from "./env.config";

// Extend the session interface
declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      email: string;
    };
  }
}

export const sessionPersistance = () => {
  // Initialize Redis Store
  const redisStore = new RedisStore({
    client: redis,
  });

  return session({
    store: redisStore,
    secret: ENV.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // Set to true in production with HTTPS
      secure: ENV.NODE_ENV === "production" ? true : false,
      // Prevents JavaScript access to cookies
      httpOnly: ENV.NODE_ENV === "production" ? true : false,
      // Session expiration in milliseconds (e.g., 1 minute)
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
    genid(req) {
      const randomId = crypto.randomUUID();

      return `${req.session?.user?.id ? req.session.user.id : ""}-${randomId}`;
    },
  });
};
