import { Router } from "express";
import {
  getCustomersController,
  getCustomerById,
  toggleImportantController,
} from "../controllers/customers.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getCustomersController);

router.get("/:id", authMiddleware, getCustomerById);

router.post("/toggle-important", authMiddleware, toggleImportantController);

export default router;
