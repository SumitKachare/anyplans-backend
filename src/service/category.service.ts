import { CustomError } from "../utils/error";
import { query } from "../config/db.config";

// get all categories
export const getAllCategoriesByUserService = async (userId: number) => {
  const categories = await query(
    `SELECT * FROM categories 
    WHERE user_id = $1`,
    [userId]
  );

  return categories.rows;
};

// get category by id
export const getCategoryByIdService = async (
  categoryId: number,
  userId: number
) => {
  const category = await query(
    `SELECT * FROM categories
     WHERE user_id = $1  and  id = $2 
     LIMIT 1`,
    [userId, categoryId]
  );

  if (category.rows.length === 0) {
    throw new CustomError("Category does not exist.", 404);
  }

  return category.rows[0];
};

// create category
export const createCategorieService = async (
  name: string,
  userId: number,
  description?: string
) => {
  // check if the category name already exists
  const isCategoryExists = await query(
    `
    SELECT COUNT(*) FROM categories WHERE name = $1 AND user_id = $2;
    `,
    [name, userId]
  );

  if (isCategoryExists?.rows[0]?.count !== "0") {
    throw new CustomError("Category with this name already exists.", 400);
  }

  const createdCategory = await query(
    `
    INSERT INTO categories (name , description , user_id)
    values ($1 , $2, $3)
    returning id , name , description , user_id
    `,
    [name, description, userId]
  );

  if (createdCategory.rows.length === 0) {
    throw new CustomError("Failed to create category.", 500);
  }

  return createdCategory.rows[0];
};

// update category
export const updateCategoryService = async (
  categoryId: number,
  userId: number,
  name?: string,
  description?: string
) => {
  // check if the category exist for the user else error
  await getCategoryByIdService(categoryId, userId);

  // check if the category name already exists excluding the current category
  if (name) {
    const isCategoryExists = await query(
      `
      SELECT COUNT(*) FROM categories WHERE name = $1 AND user_id = $2 AND id != $3;
      `,
      [name, userId, categoryId]
    );

    if (isCategoryExists?.rows[0]?.count !== "0") {
      throw new CustomError("Category with this name already exists.", 400);
    }
  }

  // update category
  const updatedCategory = await query(
    `
    UPDATE categories
    SET name = COALESCE($1 , name), description = COALESCE($2, description) , updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    AND user_id = $4
    RETURNING *;
    `,
    [name, description, categoryId, userId]
  );

  if (updatedCategory.rows.length === 0) {
    throw new CustomError("Failed to update category.", 500);
  }

  return updatedCategory.rows[0];
};

// delete category
export const deleteCategoryService = async (
  categoryId: number,
  userId: number
) => {
  // check if the category exist for that user else error
  await getCategoryByIdService(categoryId, userId);

  // delete category
  const deletedCategory = await query(
    `
    DELETE FROM categories 
    WHERE id = $1 and user_id = $2
    RETURNING name
    `,
    [categoryId, userId]
  );

  if (deletedCategory.rows.length === 0) {
    throw new CustomError("Failed to delete category.", 500);
  }

  return deletedCategory.rows[0];
};
