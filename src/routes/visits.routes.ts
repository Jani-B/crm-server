import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import {
  getVisitsByCustomerController,
  createVisitController,
} from "../controllers/visits.controller";

const router = Router();

router.get("/customer/:id", authMiddleware, getVisitsByCustomerController);
router.post("/", authMiddleware, createVisitController);

export default router;
