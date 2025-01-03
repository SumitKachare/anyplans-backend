import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  bio: varchar({ length: 255 }).notNull(),
});

export const usersTableRelations = relations(usersTable, ({ many, one }) => ({
  preferences: one(userPreferencesTable),
  categories: many(categoriesTable),
}));

export const userPreferencesTable = pgTable("userPreferences", {
  id: serial().primaryKey(),
  darkTheme: boolean().default(false),
  userId: integer().references(() => usersTable.id, { onDelete: "cascade" }),
});

export const userPreferencesRelations = relations(
  userPreferencesTable,
  ({ one }) => {
    return {
      user: one(usersTable, {
        fields: [userPreferencesTable.userId],
        references: [usersTable.id],
      }),
    };
  }
);

export const categoriesTable = pgTable(
  "categories",
  {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }),
    userId: integer().references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    {
      uniqueCategoryForUser: uniqueIndex("unique_category_for_user").on(
        table.name,
        table.userId
      ),
    },
  ]
);

export const categoriesTableRelations = relations(
  categoriesTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [categoriesTable.userId],
      references: [usersTable.id],
    }),
    spots: many(spotsTable),
  })
);

export const spotsTable = pgTable(
  "spots",
  {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }),
    location: varchar({ length: 255 }).notNull(),
    categoryId: integer()
      .notNull()
      .references(() => categoriesTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    {
      uniqueSpotsAndLocationForUser: uniqueIndex(
        "unique_spot_location_for_user"
      ).on(table.name, table.location, table.categoryId),
    },
  ]
);

export const spotsTableRelations = relations(spotsTable, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [spotsTable.categoryId],
    references: [categoriesTable.id],
  }),
}));
