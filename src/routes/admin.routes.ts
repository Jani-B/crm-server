import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createCompanyLimiter } from "../middleware/rateLimit";
import { superAdminmiddleware } from "../middleware/superAdminMiddleware";
import { createCompanyController } from "../controllers/admin.controller";

const router = Router();

router.post(
  "/create-company",
  authMiddleware,
  createCompanyLimiter,
  superAdminmiddleware,
  createCompanyController,
);

export default router;
