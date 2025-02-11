import { CustomError } from "../../utils/error";
import { getCategoryByIdService } from "../category/category.service";
import { query } from "../../config/db.config";

// get all spots
export const getAllSpotsByCategoryService = async (
  userId: number,
  categoryId: number
) => {
  // check if the category exists for that user else error.
  await getCategoryByIdService(categoryId, userId);

  const spots = await query(
    `
      SELECT id , name FROM spots
      WHERE category_id = $1 and user_id = $2
    `,
    [categoryId, userId]
  );

  return spots.rows;
};

// get spot by id
export const getSpotByIdService = async (spotId: number, userId: number) => {
  const spot = await query(
    `
    SELECT id , name FROM spots
    WHERE id = $1 and user_id = $2
    LIMIT 1
    `,
    [spotId, userId]
  );

  if (spot.rows?.length === 0) {
    throw new CustomError("Spot not found!", 404);
  }

  return spot.rows[0];
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

  // check if the spot with that name exist in the category to avoid duplicates
  const isSpotExist = await query(
    `
    SELECT COUNT(*) FROM spots
    WHERE name = $1 and user_id = $2 and category_id = $3
    `,
    [name, userId, categoryId]
  );

  if (isSpotExist?.rows[0]?.count !== "0") {
    throw new CustomError(
      "Spot with this name already exists in this category, please use different spot name.",
      400
    );
  }

  const createdSpot = await query(
    `
      INSERT INTO spots (name , description, location , category_id, user_id)
      values ($1 , $2 , $3 , $4 , $5)
      returning id ,  name , description, location , category_id, user_id
    `,
    [name, description, location, categoryId, userId]
  );

  if (createdSpot.rows.length === 0) {
    throw new CustomError("Failed to create spot.", 500);
  }

  return createdSpot.rows[0];
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
  // Validate the spot belongs to this owned by the user
  const spot = await getSpotByIdService(spotId, userId);

  // If a new category is provided, validate the category belongs to the user
  if (categoryId && spot.category_id !== categoryId) {
    await getCategoryByIdService(categoryId, userId);
  }

  // if name is provided check if the name is not duplicated in that category
  if (name) {
    // check the duplication in new category if povided else the existing category
    const checkCategoryId = categoryId ? categoryId : spot.category_id;

    const isSpotDuplicate = await query(
      `
      SELECT COUNT(*) from spots
      WHERE name = $1 and category_id = $2
      
      `,
      [name, checkCategoryId]
    );

    if (isSpotDuplicate.rows[0] && isSpotDuplicate.rows[0]?.count !== "0") {
      throw new CustomError(
        "Spot with this name already exists in this category, please use different spot name.",
        400
      );
    }
  }

  // update spot
  const updatedSpot = await query(
    `
    UPDATE spots
    SET name = COALESCE($1 , name), description = COALESCE($2 , description) , location = COALESCE($3 , location) , category_id = COALESCE($4 , category_id) , updated_at = CURRENT_TIMESTAMP
    WHERE id = $5 AND user_id = $6
    RETURNING *;
    `,
    [name, description, location, categoryId, spotId, userId]
  );

  if (updatedSpot.rows.length === 0) {
    throw new CustomError("Failed to update spot.", 500);
  }

  return updatedSpot.rows[0];
};

// delete category
export const deleteSpotService = async (spotId: number, userId: number) => {
  // check if the spot exist for that user else error
  await getSpotByIdService(spotId, userId);

  // delete spot since we confirmed above that the spot exist for that user
  const deletedSpot = await query(
    `
    DELETE FROM spots
    WHERE id = $1 and user_id = $2
    RETURNING name
    `,
    [spotId, userId]
  );

  if (deletedSpot.rows.length === 0) {
    throw new CustomError("Failed to delete spot.", 500);
  }

  return deletedSpot.rows[0];
};
