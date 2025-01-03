import { and, eq } from "drizzle-orm";
import db from "../config/db.config";
import { categoriesTable } from "../db/schema";
import { CustomError } from "../utils/error";

// get all categories
export const getAllCategoriesByUserService = async (userId: number) => {
  const categories = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.userId, userId));
  return categories;
};

// get category by id
export const getCategoryByIdService = async (
  categoryId: number,
  userId: number
) => {
  const category = await db
    .select()
    .from(categoriesTable)
    .where(
      and(
        eq(categoriesTable.id, categoryId),
        eq(categoriesTable.userId, userId)
      )
    )
    .limit(1)
    .then((result) => result[0]);

  if (!category) {
    throw new CustomError("Category does not exist.", 404);
  }

  return category;
};

// create category
export const createCategorieService = async (
  name: string,
  userId: number,
  description?: string
) => {
  const createdUser = await db
    .insert(categoriesTable)
    .values({
      name,
      description,
      userId,
    })
    .returning();

  return createdUser;
};

// update category
export const updateCategoryService = async (
  categoryId: number,
  userId: number,
  name?: string,
  description?: string
) => {
  // check if the category exist for the user else error

  const isCategoryExist = await getCategoryByIdService(categoryId, userId);

  if (!isCategoryExist) {
    throw new CustomError("Category does not exist.", 404);
  }

  // update category
  const createdUser = await db
    .update(categoriesTable)
    .set({
      name,
      description,
    })
    .where(
      and(
        eq(categoriesTable.id, categoryId),
        eq(categoriesTable.userId, userId)
      )
    )
    .returning();

  return createdUser;
};

// delete category
export const deleteCategoryService = async (
  categoryId: number,
  userId: number
) => {
  // check if the category exist for that user else error
  const isCategoryExist = await getCategoryByIdService(categoryId, userId);

  if (!isCategoryExist) {
    throw new CustomError("Category does not exist.", 404);
  }

  // delete category
  const createdUser = await db
    .delete(categoriesTable)
    .where(
      and(
        eq(categoriesTable.id, categoryId),
        eq(categoriesTable.userId, userId)
      )
    )
    .returning();

  return createdUser;
};
