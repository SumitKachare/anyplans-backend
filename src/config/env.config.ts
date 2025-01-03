import { config } from "dotenv";

config({ path: ".env" });

// expose all ENV from one file
export const { PORT, NODE_ENV, DATABASE_URL, SESSION_SECRET } = process.env;
