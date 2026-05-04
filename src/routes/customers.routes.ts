import { Router } from "express";
import {
  getCustomersController,
  getCustomerById,
} from "../controllers/customers.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getCustomersController);

router.get("/:id", authMiddleware, getCustomerById);

export default router;
