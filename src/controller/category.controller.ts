import { Request, Response } from "express-serve-static-core";
import {
  createCategorieService,
  deleteCategoryService,
  getCategoryByIdService,
  getAllCategoriesByUserService,
  updateCategoryService,
} from "../service/category.service";
import {
  createCategoryValidation,
  deleteCategoryValidation,
  getCategoryByIdValidation,
  updateCategoryValidation,
} from "../validation/category.validation";
import { asyncHandler } from "../utils/error";
import { successResponse } from "../utils/utils";

export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.user;

    const data = await getAllCategoriesByUserService(userId);

    const response = successResponse(data, "Categories fetched successfully");

    res.status(200).json(response);
  }
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryId = getCategoryByIdValidation.parse(req.params);

    const { userId } = req.user;

    const data = await getCategoryByIdService(categoryId, userId);

    const response = successResponse(data, "Category fetched successfully");

    res.status(200).json(response);
  }
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description } = createCategoryValidation.parse(req.body);

    const { userId } = req.user;

    const data = await createCategorieService(name, userId, description);

    const response = successResponse(data, "Category created successfully");

    res.status(201).json(response);
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, categoryId } = updateCategoryValidation.parse(
      req.body
    );

    const { userId } = req.user;

    const data = await updateCategoryService(
      categoryId,
      userId,
      name,
      description
    );

    const response = successResponse(data, "Category updated successfully");

    res.status(200).json(response);
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = deleteCategoryValidation.parse(req.body);

    const { userId } = req.user;

    const data = await deleteCategoryService(categoryId, userId);

    const response = successResponse(data, "Category deleted successfully");

    res.status(200).json(response);
  }
);
