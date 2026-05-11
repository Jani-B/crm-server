"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const visits_controller_1 = require("../controllers/visits.controller");
const router = (0, express_1.Router)();
router.get("/customer/:id", authMiddleware_1.authMiddleware, visits_controller_1.getVisitsByCustomerController);
router.post("/", authMiddleware_1.authMiddleware, visits_controller_1.createVisitController);
exports.default = router;
