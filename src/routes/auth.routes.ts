import { Router } from "express";
import { login, logout } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { loginLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/login", loginLimiter, login);
router.post("/logout", logout);

router.get("/me", authMiddleware, (req: any, res) => {
  res.json({ user: req.user });
});

export default router;
