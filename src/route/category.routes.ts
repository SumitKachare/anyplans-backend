import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controller/category.controller";
import { authCheck } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/get-categories", authCheck, getCategories);
router.get("/get-category/:categoryId", authCheck, getCategoryById);
router.post("/create-category", authCheck, createCategory);
router.put("/update-category", authCheck, updateCategory);
router.delete("/delete-category", authCheck, deleteCategory);

export default router;
