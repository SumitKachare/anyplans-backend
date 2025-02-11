import express from "express";
import { login, logout, register } from "./auth.controller";
import { authCheck } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authCheck, logout);

export default router;
