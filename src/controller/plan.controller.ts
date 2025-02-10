import { Request, Response } from "express-serve-static-core";
import {
  getPlansService,
  getPlanDetailService,
  createPlanService,
  deletePlanService,
  updatePlanService,
} from "../service/plan.service";
import {
  createPlanValidation,
  deletePlanValidation,
  getPlanDetailsValidation,
  getPlansValidation,
  updatePlanValidation,
} from "../validation/plan.validation";
import { asyncHandler } from "../utils/error";
import { successResponse } from "../utils/utils";

export const getPlans = asyncHandler(async (req: Request, res: Response) => {
  const { city } = getPlansValidation.parse(req.query);

  const data = await getPlansService(city);

  const response = successResponse(data, "Plans fetched successfully");

  res.status(200).json(response);
});

export const getPlansById = asyncHandler(
  async (req: Request, res: Response) => {
    const { planId } = getPlanDetailsValidation.parse(req.params);

    const data = await getPlanDetailService(planId);

    const response = successResponse(data, "Plan data fetched successfully");

    res.status(200).json(response);
  }
);

export const createPlan = asyncHandler(async (req: Request, res: Response) => {
  const createPlanPayload = createPlanValidation.parse(req.body);

  const { userId } = req.user;

  const data = await createPlanService(createPlanPayload, userId);

  const response = successResponse(data, "Plan created successfully");

  res.status(200).json(response);
});

export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
  const updatePlanPayload = updatePlanValidation.parse(req.body);

  const { userId } = req.user;

  const data = await updatePlanService(updatePlanPayload, userId);

  const response = successResponse(data, "Plan updated successfully");

  res.status(200).json(response);
});

export const deletePlan = asyncHandler(async (req: Request, res: Response) => {
  const deletePlanPayload = deletePlanValidation.parse(req.body);

  const { userId } = req.user;

  const data = await deletePlanService(deletePlanPayload, userId);

  const response = successResponse(data, "Plan deleted successfully");

  res.status(200).json(response);
});
