import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { faker } from "@faker-js/faker";
import { usersTable, categoriesTable, spotsTable } from "./schema"; // Adjust the import path
import { config } from "dotenv";
import { hash } from "bcrypt";

config({ path: ".env" });

const DATABASE_URL = "postgres://myuser:mypassword@localhost:5432/onlyplans";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const db = drizzle(pool);

const userCount = 3;
const perUserCategoryCount = 17;
const perCategorySpotCount = 27;

let loopCount = 1;

async function seedDatabase() {
  console.log("Seeding database...");

  for (let i = 0; i < userCount; i++) {
    const userId = await db
      .insert(usersTable)
      .values({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        // real password = Sumit@2024
        password:
          "$2b$10$ci1sv1SsFj4sjI2HY.0Sge6YsHtAyvMH/Wa5UYGwmhux8bbQbMTS6",
        bio: faker.lorem.sentence(),
      })
      .returning({
        id: usersTable.id,
      });

    for (let j = 0; j < (loopCount < 2 ? perUserCategoryCount : 7); j++) {
      const categoryId = await db
        .insert(categoriesTable)
        .values({
          name: faker.commerce.department(),
          description: faker.lorem.sentence(),
          userId: userId[0].id,
        })
        .returning({
          id: categoriesTable.id,
        });

      for (let k = 0; k < (loopCount < 2 ? perCategorySpotCount : 7); k++) {
        await db.insert(spotsTable).values({
          name: faker.company.name(),
          description: faker.lorem.sentence(),
          location: `${faker.location.latitude()}, ${faker.location.longitude()}`,
          categoryId: categoryId[0].id,
        });
      }
    }

    loopCount = loopCount + 1;
  }

  console.log("Database seeded successfully.");
}

async function clearDatabase() {
  console.log("Deleting all data from tables...");

  try {
    await db.delete(spotsTable).execute();
    await db.delete(categoriesTable).execute();
    await db.delete(usersTable).execute();
    console.log("All data deleted successfully.");
  } catch (error) {
    console.error("Error while deleting data:", error);
  }
}

if (process.argv.includes("--seed")) {
  seedDatabase()
    .catch((err) => {
      console.error("Error seeding database:", err);
    })
    .finally(() => {
      pool.end();
    });
} else if (process.argv.includes("--clear")) {
  clearDatabase()
    .catch((err) => {
      console.error("Error de-seeding database:", err);
    })
    .finally(() => {
      pool.end();
    });
}
