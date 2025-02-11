import { CustomError } from "../../utils/error";
import { query } from "../../config/db.config";
import {
  createPlanType,
  deletePlanType,
  updatePlanType,
} from "./plan.validation";
import { Plan, PlanDeleted } from "./plan.types";

export const getPlansService = async (city: string): Promise<Plan[]> => {
  const getPlansByCity = await query(
    `
    SELECT id , title from plans
    WHERE city = $1 AND is_deleted = FALSE
    `,
    [city]
  );

  return getPlansByCity.rows;
};

export const getPlanDetailService = async (planId: number): Promise<Plan> => {
  const getPlanDetail = await query(
    `
        SELECT * FROM plans
        WHERE id = $1 AND is_deleted = FALSE
        LIMIT 1 
    `,
    [planId]
  );

  if (getPlanDetail.rows.length === 0) {
    throw new CustomError("Plan not found!", 404);
  }

  return getPlanDetail.rows[0];
};

export const getPlanByUserId = async (planId: number, userId: number) => {
  const getPlanByUserData = await query(
    `
        SELECT id , title FROM plans
        WHERE id = $1 AND user_id = $2
        LIMIT 1
        `,
    [planId, userId]
  );

  if (getPlanByUserData.rows.length === 0) {
    throw new CustomError("Plan does not exist or plan not authorized", 404);
  }
  return getPlanByUserData.rows[0];
};

export const createPlanService = async (
  createPlanPayload: createPlanType,
  userId: number
): Promise<Plan> => {
  const {
    title,
    description,
    imageUrl,
    planDate,
    durationValue,
    durationUnit,
    meetupPointAddress,
    city,
    meetupPointLink,
    planCategoryId,
    capacity,
    isFree,
    amount,
  } = createPlanPayload;

  const createPlanRes = await query(
    `INSERT INTO plans (
        title, description, image_url, plan_date, duration_value, duration_unit, 
        meetup_point_address, city, meetup_point_link, plan_category_id, capacity, is_free, amount , user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 , $14)
      RETURNING * 
    `,
    [
      title,
      description,
      imageUrl,
      planDate,
      durationValue,
      durationUnit,
      meetupPointAddress,
      city,
      meetupPointLink,
      planCategoryId,
      capacity,
      isFree,
      amount,
      userId,
    ]
  );

  return createPlanRes.rows[0];
};

export const updatePlanService = async (
  updatePlanPayload: updatePlanType,
  userId: number
): Promise<Plan> => {
  const planId = updatePlanPayload.planId;

  const { capacity, title, description, imageUrl } = updatePlanPayload;

  // verify that this plan belongs to this user
  await getPlanByUserId(planId, userId);

  const updatePlanQuery = await query(
    `
        UPDATE plans 
        SET title = COALESCE($2 , title) , description = COALESCE($3 , description) , 
        image_url = COALESCE($4 , image_url) , capacity = COALESCE($5 , capacity) ,
        updated_at = CURRENT_TIMESTAMP

        WHERE id = $1
        RETURNING *;
    `,
    [planId, title, description, imageUrl, capacity]
  );

  return updatePlanQuery.rows[0];
};

export const deletePlanService = async (
  deletePlanPayload: deletePlanType,
  userId: number
): Promise<PlanDeleted> => {
  const { planId, softDelete } = deletePlanPayload;

  // verify that this plan belongs to this user
  await getPlanByUserId(planId, userId);

  if (softDelete) {
    // update is_delete to true
    const softDeletedPlan = await query(
      `
        UPDATE plans
        SET is_deleted = true
        WHERE id = $1
        RETURNING id , title , is_deleted
        `,
      [planId]
    );

    return softDeletedPlan.rows[0];
  } else {
    // remove the plan from db
    const deletePlan = await query(
      `
        DELETE FROM plans
        WHERE id = $1
        RETURNING id , title
        `,
      [planId]
    );

    return deletePlan.rows[0];
  }
};
