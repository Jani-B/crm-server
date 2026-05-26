import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import {
  getVisitsByCustomerController,
  createVisitController,
  getVisitsController,
} from "../controllers/visits.controller";

const router = Router();

router.get("/customer/:id", authMiddleware, getVisitsByCustomerController);
router.get("/", authMiddleware, getVisitsController);
router.post("/", authMiddleware, createVisitController);

export default router;
