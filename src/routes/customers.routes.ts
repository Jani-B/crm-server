import { Router } from "express";
import {
  getCustomersController,
  getCustomerById,
  toggleImportantController,
  importCustomersController,
  createCustomerController,
} from "../controllers/customers.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { importLimiter } from "../middleware/rateLimit";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", authMiddleware, getCustomersController);

router.get("/:id", authMiddleware, getCustomerById);

router.post("/toggle-important", authMiddleware, toggleImportantController);
router.post(
  "/import",
  authMiddleware,
  importLimiter,
  upload.single("file"),
  importCustomersController,
);
router.post("/", authMiddleware, createCustomerController);

export default router;
