import { Router } from "express";
import {
  getUsersController,
  createUserController,
  activateUserController,
} from "../controllers/users.controller";

import { authMiddleware } from "../middleware/authMiddleware";
import { setPasswordLimiter } from "../middleware/rateLimit";

const router = Router();

router.get("/", authMiddleware, getUsersController);
router.post("/", authMiddleware, createUserController);
router.post("/activate", setPasswordLimiter, activateUserController);
export default router;
