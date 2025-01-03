import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!);

db.$client.connect((err) => {
  if (err) {
    console.log("Error Connecting DB");
  }

  console.log("Database connected");
});

export default db;
