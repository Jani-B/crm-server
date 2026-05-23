"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const superAdminMiddleware_1 = require("../middleware/superAdminMiddleware");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
router.post("/create-company", authMiddleware_1.authMiddleware, superAdminMiddleware_1.superAdminmiddleware, admin_controller_1.createCompanyController);
exports.default = router;
