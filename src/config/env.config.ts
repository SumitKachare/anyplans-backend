import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env" });

// expose all ENV from one file
// export const {
//   PORT,
//   NODE_ENV,
//   DATABASE_URL,
//   SESSION_SECRET,
//   REDIS_PORT,
//   REDIS_HOST,
//   DBMATE_MIGRATIONS_DIR,
// } = process.env;

const validateENV = z.object({
  PORT: z.string({ message: "PORT is required." }),
  NODE_ENV: z.string({ message: "NODE_ENV is reuired." }),
  DATABASE_URL: z.string({ message: "DATABASE_URL is required." }),
  SESSION_SECRET: z.string({ message: "SESSION_SECRET is reuired." }),
  REDIS_PORT: z.string({ message: "REDIS_PORT is required." }),
  REDIS_HOST: z.string({ message: "REDIS_HOST is reuired." }),
  DBMATE_MIGRATIONS_DIR: z.string({
    message: "DBMATE_MIGRATIONS_DIR is required.",
  }),
});

const ENV = validateENV.parse(process.env);

export default ENV;
