import express from "express";
import { NODE_ENV, PORT, SESSION_SECRET } from "./config/env.config";
import baseRoute from "./route/routes";
import errorHandler from "./middleware/error.middleware";
import helmet from "helmet";
import { CustomError } from "./utils/error";
import session from "express-session";
import redis from "./config/redis.config";
import { RedisStore } from "connect-redis";
import { v4 as uuidv4 } from "uuid";

const app = express();

// Initialize Redis Store
const redisStore = new RedisStore({
  client: redis,
});

// add securoty headers
app.use(helmet());

// parse reuest body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Listen for Redis successful connection
redis.on("connect", () => {
  console.log("Successfully connected to Redis");
});

// Listen for Redis error connection
redis.on("error", (err) => {
  console.log("Redis connection error");

  shutdownServer();
});

// Extend the session interface
declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      email: string;
    };
  }
}

// session middleware
if (SESSION_SECRET) {
  app.use(
    session({
      store: redisStore,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // Set to true in production with HTTPS
        secure: NODE_ENV === "production" ? true : false,
        // Prevents JavaScript access to cookies
        httpOnly: NODE_ENV === "production" ? true : false,
        // Session expiration in milliseconds (e.g., 1 minute)
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
      },
      genid(req) {
        const randomId = uuidv4();

        return `${
          req.session?.user?.id ? req.session.user.id : ""
        }-${randomId}`;
      },
    })
  );
}

// route entry point
app.use("/api/v1", baseRoute);

// handle invalid routes
app.use("*", () => {
  throw new CustomError("Invalid API route", 400);
});

// global error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// handle graceful exit
process.on("SIGTERM", shutdownServer);
process.on("SIGINT", shutdownServer);

// Gracefully shutdown server
function shutdownServer() {
  console.log("Shutting down server due to Redis connection failure...");

  // Close the Redis connection
  redis.disconnect();

  // Handle server shutdown
  server.close((err) => {
    if (err) {
      console.error("Error shutting down server:", err);
      process.exit(1); // Exit with error code
    }

    console.log("Server shutdown completed gracefully.");
    process.exit(0); // Exit with success code
  });
}
