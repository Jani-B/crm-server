import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import {
  getVisitsByCustomerController,
} from "../controllers/visits.controller";

const router = Router();

router.get(
  "/customer/:id",
  authMiddleware,
  getVisitsByCustomerController
);

export default router;