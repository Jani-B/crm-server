"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const scheduledVisits_controller_1 = require("../controllers/scheduledVisits.controller");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authMiddleware, scheduledVisits_controller_1.getScheduledVisitsController);
router.post("/", authMiddleware_1.authMiddleware, scheduledVisits_controller_1.createScheduledVisitController);
exports.default = router;
