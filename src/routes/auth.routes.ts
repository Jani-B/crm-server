import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";
const router = Router();

router.post("/login", login);

router.get("/me", authMiddleware, (req: any, res) => {
  res.json({ user: req.user });
});

export default router;
