import pg from "pg";
import ENV from "./env.config";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: ENV.DATABASE_URL as string,
});

// test the db connection
// pool
//   .connect()
//   .then((client) => {
//     console.log("Database connected successfully");
//     client.release(); // Release the client back to the pool
//   })
//   .catch((err) => {
//     console.error("Database connection failed:", err.stack);
//   });

export const query = async (text: string, params?: any[]) => {
  const res = await pool.query(text, params);

  return res;
};

// DB Mate migration commands
// https://github.com/amacneil/dbmate?tab=readme-ov-file#commands
