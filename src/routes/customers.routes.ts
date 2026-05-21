import { Router } from "express";
import {
  getCustomersController,
  getCustomerById,
  toggleImportantController,
  importCustomersController,
} from "../controllers/customers.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", authMiddleware, getCustomersController);

router.get("/:id", authMiddleware, getCustomerById);

router.post("/toggle-important", authMiddleware, toggleImportantController);
router.post(
  "/import",
  authMiddleware,
  upload.single("file"),
  importCustomersController,
);

export default router;
