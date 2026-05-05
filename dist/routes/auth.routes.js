"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.login);
router.get("/me", authMiddleware_1.authMiddleware, (req, res) => {
    res.json({ user: req.user });
});
exports.default = router;
