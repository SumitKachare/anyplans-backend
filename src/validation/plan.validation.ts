import { z } from "zod";
import { CustomError } from "../utils/error";

export const PlanDurationUnit = z.enum(["hours", "days", "weeks"]);

export const getPlansValidation = z
  .object({
    city: z.string({ message: "City is required and must be a string." }),
    search: z.string({ message: "Search query must be a string." }).optional(),
    date: z.string({ message: "Date must be a string." }).optional(),
    planCategory: z
      .string({ message: "Plan category must be a string." })
      .optional(),
    isFree: z
      .string({ message: "isFree must be a string ('true' or 'false')." })
      .optional(),
  })
  .strict();

export const getPlanDetailsValidation = z
  .object({
    planId: z.string({ message: "Plan ID is required and must be a string." }),
  })
  .strict()
  .transform((val) => {
    const parsed = parseInt(val.planId);
    if (isNaN(parsed)) {
      throw new CustomError("Invalid Plan ID.", 400);
    }
    return { planId: parsed };
  });

export const createPlanValidation = z
  .object({
    title: z
      .string({ message: "Title is required and must be a string." })
      .trim()
      .min(5, { message: "Title should be  characters minimum." })
      .max(40, { message: "Title should not exceed 40 characters." }),
    description: z
      .string({ message: "Description is required and must be a string." })
      .trim()
      .min(50, { message: "Description should be 100 characters minimum." })
      .max(3000, { message: "Description should not exceed 3000 characters." }),
    imageUrl: z
      .string({ message: "Image URL and must be a string." })
      .trim()
      .url({ message: "Invalid URL format" })
      .min(5, { message: "Image URL should be 5 characters minimum." })
      .max(500, { message: "Image URL should not exceed 500 characters." })
      .optional(),
    planDate: z
      .string({
        message:
          "Plan date must be a valid ISO date string (YYYY-MM-DD HH:MI:SS).",
      })
      .trim()
      .refine((val) => !isNaN(Date.parse(val)), {
        message:
          "Plan date must be a valid ISO date string (YYYY-MM-DD HH:MI:SS).",
      }),
    durationValue: z
      .number({
        message: "Duration value is required and must be number.",
      })
      .positive({ message: "Duration value cannot be negative number." }),
    durationUnit: PlanDurationUnit,
    meetupPointAddress: z
      .string({
        message: "Meetup point address is reuired and must be string.",
      })
      .trim()
      .min(10)
      .max(500, "Meetup address must be 255 characters or less"),
    city: z
      .string({
        message: "Meetup point city is reuired and must be a string",
      })
      .trim()
      .min(3)
      .max(255, "Meetup city must be 255 characters or less"),
    meetupPointLink: z
      .string({ message: "Meetup point link is reuired and must be a string." })
      .trim()
      .url({ message: "Invalid URL format" })
      .min(5, { message: "Meetup point link should be 5 characters minimum." })
      .max(500, {
        message: "Meetup point link should not exceed 500 characters.",
      })
      .optional(),
    planCategoryId: z.number({
      message: "Plan category ID is reuired and should be a number.",
    }),
    capacity: z.number({
      message: "Plan capacity is reuired and should be a number.",
    }),
    isFree: z.boolean({
      message: "Plan free or paid in reuired",
    }),
    amount: z
      .number({ message: "Amount must be a number." })
      .positive({ message: "Amount cannot be less than 10" })
      .min(1, { message: "Amount should be minimum of 1 INR" })
      .max(50000, { message: "Amount cannot exceed 50,000 INR" })
      .optional(),
  })
  .strict()
  // apply condition to duration value and duration unit
  .refine(
    (data) => {
      switch (data.durationUnit) {
        case "hours":
          return data.durationValue <= 24;
        case "days":
          return data.durationValue <= 7;
        case "weeks":
          return data.durationValue <= 3;
        default:
          return false;
      }
    },
    {
      message:
        "Duration for plan should not exceed 24  for hours, 7 for days and 3 for weeks.",
      path: ["duration_value"], // Specify the path for better error messages
    }
  )
  // handle the case where if plan is free then amount should be null and vice-versa
  .refine(
    (data) => {
      if (data.isFree) {
        return data.amount === null || data.amount === undefined;
      }

      return (
        data.amount !== null &&
        data.amount !== undefined &&
        data.amount >= 1 &&
        data.amount <= 50000
      );
    },
    {
      message: "Paid plans must have an amount between 1 and 50,000 rupees",
      path: ["amount"],
    }
  );

export const updatePlanValidation = z
  .object({
    planId: z.number({ message: "Plan ID is required and must be a number." }),
    title: z
      .string({ message: "Title must be a string." })
      .trim()
      .min(5, { message: "Title should be 5 characters minimum." })
      .max(40, { message: "Title should not exceed 40 characters." })
      .optional(),
    description: z
      .string({ message: "Description must be a string." })
      .trim()
      .min(50, { message: "Description should be 50 characters minimum." })
      .max(3000, { message: "Description should not exceed 3000 characters." })
      .optional(),
    imageUrl: z
      .string({ message: "Image URL must be a string." })
      .trim()
      .url({ message: "Invalid URL format" })
      .min(5, { message: "Image URL should be 5 characters minimum." })
      .max(500, { message: "Image URL should not exceed 500 characters." })
      .optional(),
    capacity: z
      .number({
        message: "Plan capacity must be a number.",
      })
      .optional(),
  })
  .strict()
  .refine(
    (data) => data.title || data.description || data.imageUrl || data.capacity,
    {
      message: "Please provide data to update.",
    }
  );

export const deletePlanValidation = z
  .object({
    planId: z.number({ message: "Plan Id is required." }),
    softDelete: z
      .boolean({ message: "softDelete should be boolean" })
      .default(true),
  })
  .strict();

export type createPlanType = z.infer<typeof createPlanValidation>;

export type updatePlanType = z.infer<typeof updatePlanValidation>;

export type deletePlanType = z.infer<typeof deletePlanValidation>;
