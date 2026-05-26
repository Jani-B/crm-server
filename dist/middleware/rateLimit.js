"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompanyLimiter = exports.importLimiter = exports.setPasswordLimiter = exports.loginLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        message: "Too many login attempts. Try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.setPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        message: "Too many password setup attempts",
    },
});
exports.importLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        message: "Too many imports",
    },
});
exports.createCompanyLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        message: "Too many company creations",
    },
});
