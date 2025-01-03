import { Request, Response } from "express-serve-static-core";
import {
  createSpotService,
  deleteSpotService,
  getAllSpotsByCategoryService,
  updateSpotService,
} from "../service/spot.service";
import {
  createSpotValidation,
  deleteSpotValidation,
  updateSpotValidation,
  getSpotByCategoryValidation,
} from "../validation/spot.validation";
import { asyncHandler } from "../utils/error";
import { successResponse } from "../utils/utils";

export const getSpots = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = getSpotByCategoryValidation.parse(req.params);

  const { userId } = req.user;

  const data = await getAllSpotsByCategoryService(userId, categoryId);

  const response = successResponse(data, "Spots fetched successfully");

  res.status(200).json(response);
});

export const createSpot = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, categoryId, location } =
    createSpotValidation.parse(req.body);

  const { userId } = req.user;

  const data = await createSpotService(
    userId,
    name,
    categoryId,
    location,
    description
  );

  const response = successResponse(data, "Spot created successfully");

  res.status(201).json(response);
});

export const updateSpot = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, categoryId, spotId, location } =
    updateSpotValidation.parse(req.body);

  const { userId } = req.user;

  const data = await updateSpotService(
    userId,
    spotId,
    name,
    description,
    categoryId,
    location
  );

  const response = successResponse(data, "Spot updated successfully");

  res.status(200).json(response);
});

export const deleteSpot = asyncHandler(async (req: Request, res: Response) => {
  const { spotId } = deleteSpotValidation.parse(req.body);
  const { userId } = req.user;

  const data = await deleteSpotService(spotId, userId);

  const response = successResponse(data, "Spot deleted successfully");

  res.status(200).json(response);
});
