import express from "express";
import {
  createPlan,
  getPlans,
  getPlansById,
  updatePlan,
  deletePlan,
} from "../controller/plan.controller";
import { authCheck } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/get-plans", getPlans);
router.get("/plan-id/:planId", getPlansById);
router.post("/create-plan", authCheck, createPlan);
router.put("/update-plan", authCheck, updatePlan);
router.delete("/delete-plan", authCheck, deletePlan);

export default router;
