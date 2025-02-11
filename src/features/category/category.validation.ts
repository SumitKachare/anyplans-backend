import { z } from "zod";
import { CustomError } from "../../utils/error";

export const getCategoryByIdValidation = z
  .object({
    categoryId: z.string({ message: "Category ID is required." }),
  })
  .strict()
  .transform((val) => {
    const parsed = parseInt(val.categoryId);
    if (isNaN(parsed)) {
      throw new CustomError("Invalid category ID.", 400);
    }
    return parsed;
  });

export const createCategoryValidation = z
  .object({
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
  })
  .strict();

export const updateCategoryValidation = z
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
    categoryId: z.number({ message: "Category ID is required." }),
  })
  .strict()
  .refine((data) => data.name || data.description, {
    message: "Please provide data to update.",
  });

export const deleteCategoryValidation = z
  .object({
    categoryId: z.number({ message: "Category ID is required." }),
  })
  .strict();
