import express from "express";

import { authCheck } from "../middleware/auth.middleware";
import {
  getSpots,
  createSpot,
  deleteSpot,
  updateSpot,
} from "../controller/spot.controller";

const router = express.Router();

router.get("/get-spots/:categoryId", authCheck, getSpots);
router.post("/create-spot", authCheck, createSpot);
router.put("/update-spot", authCheck, updateSpot);
router.delete("/delete-spot", authCheck, deleteSpot);

export default router;
