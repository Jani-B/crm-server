import { Router } from "express";
import {
  getUsersController,
  createUserController,
} from "../controllers/users.controller";

import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getUsersController);
router.post("/", authMiddleware, createUserController);

export default router;
