import { and, eq } from "drizzle-orm";
import db from "../config/db.config";
import { categoriesTable, spotsTable, usersTable } from "../db/schema";
import { CustomError } from "../utils/error";
import { getCategoryByIdService } from "./category.service";

// get all spots
export const getAllSpotsByCategoryService = async (
  userId: number,
  categoryId: number
) => {
  // const spots = await db
  //   .select({
  //     spotId: spotsTable.id,
  //     spotName: spotsTable.name,
  //     spotDescription: spotsTable.description,
  //     spotLocation: spotsTable.location,
  //     categoryId: categoriesTable.id,
  //     categoryName: categoriesTable.name,
  //   })
  //   .from(spotsTable)
  //   .innerJoin(categoriesTable, eq(spotsTable.categoryId, categoriesTable.id))
  //   .innerJoin(usersTable, eq(categoriesTable.userId, usersTable.id))
  //   .where(
  //     and(
  //       eq(usersTable.id, userId), // Check the user ID
  //       eq(categoriesTable.id, categoryId) // Check the category ID
  //     )
  //   );

  const spots = await db
    .select({
      spotId: spotsTable.id,
      spotName: spotsTable.name,
      spotDescription: spotsTable.description,
      spotLocation: spotsTable.location,
      categoryId: categoriesTable.id,
      categoryName: categoriesTable.name,
    })
    .from(spotsTable)
    .innerJoin(categoriesTable, eq(spotsTable.categoryId, categoriesTable.id))
    .where(
      and(
        eq(categoriesTable.userId, userId),
        eq(spotsTable.categoryId, categoryId)
      )
    );

  return spots;
};

// get category by id
export const getSpotByIdService = async (spotId: number, userId: number) => {
  // Validate the spot belongs to a category owned by the user
  const spot = await db
    .select({
      spotId: spotsTable.id,
      categoryId: spotsTable.categoryId,
    })
    .from(spotsTable)
    .innerJoin(categoriesTable, eq(spotsTable.categoryId, categoriesTable.id))
    .where(and(eq(spotsTable.id, spotId), eq(categoriesTable.userId, userId)))
    .limit(1)
    .then((results) => results[0]);

  if (!spot) {
    throw new CustomError("Spot not found!", 404);
  }

  return spot;
};

// create category
export const createSpotService = async (
  userId: number,
  name: string,
  categoryId: number,
  location: string,
  description?: string
) => {
  // check if the category exists for that user else error.
  await getCategoryByIdService(categoryId, userId);

  // create the spot in db
  const createdSpot = await db
    .insert(spotsTable)
    .values({
      name,
      description,
      location,
      categoryId,
    })
    .returning();

  return createdSpot[0];
};

// update category
export const updateSpotService = async (
  userId: number,
  spotId: number,
  name?: string,
  description?: string,
  categoryId?: number,
  location?: string
) => {
  // Validate the spot belongs to a category owned by the user
  const spot = await getSpotByIdService(spotId, userId);

  // If a new category is provided, validate the category belongs to the user
  if (categoryId && spot.categoryId !== categoryId) {
    await getCategoryByIdService(categoryId, userId);
  }

  // update category
  const updatedSpot = await db
    .update(spotsTable)
    .set({
      name,
      description,
      location,
      categoryId,
    })
    .where(eq(spotsTable.id, spotId))
    .returning()
    .then((result) => result[0]);

  return updatedSpot;
};

// delete category
export const deleteSpotService = async (spotId: number, userId: number) => {
  // check if the spot exist for that user else error
  await getSpotByIdService(spotId, userId);

  // delete spot since we confirmed above that the spot exist for that user
  const deleteSpot = await db
    .delete(spotsTable)
    .where(eq(spotsTable.id, spotId))
    .returning()
    .then((result) => result[0]);

  return deleteSpot;
};
