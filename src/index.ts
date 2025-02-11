import express from "express";
import ENV from "./config/env.config";
import baseRoute from "./routes";
import errorHandler from "./middleware/error.middleware";
import helmet from "helmet";
import { CustomError } from "./utils/error";
import redis from "./config/redis.config";
import { sessionPersistance } from "./config/sessionPeristance.config";

const app = express();

// add securoty headers
app.use(helmet());

// parse reuest body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session middleware
app.use(sessionPersistance());

// route entry point
app.use("/api/v1", baseRoute);

// handle invalid routes
app.use("*", () => {
  throw new CustomError("Invalid API route", 400);
});

// global error handler
app.use(errorHandler);

const server = app.listen(ENV.PORT, () => {
  console.log(`Server running on ${ENV.PORT}`);
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
