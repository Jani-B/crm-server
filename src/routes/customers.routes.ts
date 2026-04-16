import { Router } from "express";
import { getCustomersController } from "../controllers/customers.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getCustomersController);

export default router;
