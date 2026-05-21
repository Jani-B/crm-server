import { Router } from "express";
import {
  getUsersController,
  createUserController,
  activateUserController,
} from "../controllers/users.controller";

import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getUsersController);
router.post("/", authMiddleware, createUserController);
router.post("/activate", activateUserController);
export default router;
