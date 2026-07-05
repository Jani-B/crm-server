import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware";

import {
  createScheduledVisitController,
  getScheduledVisitsController,
} from "../controllers/scheduledVisits.controller";

const router = Router();

router.get("/", authMiddleware, getScheduledVisitsController);

router.post("/", authMiddleware, createScheduledVisitController);

export default router;
