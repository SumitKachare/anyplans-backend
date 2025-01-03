import { z } from "zod";
import { CustomError } from "../utils/error";

export const getSpotByCategoryValidation = z
  .object({
    categoryId: z.string({ message: "Category ID is required." }),
  })
  .transform((val) => {
    const parsed = parseInt(val.categoryId);
    if (isNaN(parsed)) {
      throw new CustomError("Invalid categoryId ID.", 400);
    }
    return parsed;
  });

export const getSpotByIdValidation = z
  .object({
    spotId: z.string({ message: "Spot ID is required." }),
  })
  .transform((val) => {
    const parsed = parseInt(val.spotId);
    if (isNaN(parsed)) {
      throw new CustomError("Invalid spot ID.", 400);
    }
    return parsed;
  });

export const createSpotValidation = z.object({
  name: z
    .string({ message: "Name is required." })
    .trim()
    .min(2, { message: "Name should be 2 characters minimum." })
    .max(20, { message: "Name should not exceed 20 characters." }),
  description: z
    .string({ message: "Description is required." })
    .trim()
    .min(5, { message: "Description should be 5 characters minimum." })
    .max(50, { message: "Description should not exceed 50 characters." })
    .optional(),
  location: z
    .string({ message: "Location is required." })
    .trim()
    .min(2, { message: "Location should be 2 characters minimum." })
    .max(20, { message: "Location should not exceed 20 characters." }),
  categoryId: z.number({ message: "Category ID is required." }),
});

export const updateSpotValidation = z
  .object({
    name: z
      .string({ message: "Name is required." })
      .trim()
      .min(2, { message: "Name should be 2 characters minimum." })
      .max(20, { message: "Name should not exceed 20 characters." })
      .optional(),
    description: z
      .string({ message: "Description is required." })
      .trim()
      .min(5, { message: "Description should be 5 characters minimum." })
      .max(50, { message: "Description should not exceed 50 characters." })
      .optional(),
    location: z
      .string({ message: "Location is required." })
      .trim()
      .min(2, { message: "Location should be 2 characters minimum." })
      .max(20, { message: "Location should not exceed 20 characters." })
      .optional(),
    categoryId: z.number({ message: "Category ID is required." }).optional(),
    spotId: z.number({ message: "Spot ID is required." }),
  })
  .refine(
    (data) => data.name || data.description || data.location || data.categoryId,
    {
      message: "Please provide data to update.",
    }
  );

export const deleteSpotValidation = z.object({
  spotId: z.number({ message: "Spot ID is required." }),
});
