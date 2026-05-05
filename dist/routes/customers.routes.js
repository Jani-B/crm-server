"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customers_controller_1 = require("../controllers/customers.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authMiddleware, customers_controller_1.getCustomersController);
router.get("/:id", authMiddleware_1.authMiddleware, customers_controller_1.getCustomerById);
exports.default = router;
