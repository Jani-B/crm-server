"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersController = getUsersController;
exports.createUserController = createUserController;
exports.activateUserController = activateUserController;
const users_service_1 = require("../services/users.service");
const crypto_1 = __importDefault(require("crypto"));
async function getUsersController(req, res) {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Forbidden",
            });
        }
        const users = await (0, users_service_1.getUsersService)(req.user.company);
        res.json(users);
    }
    catch (err) {
        console.error("GET USERS ERROR:", err);
        res.status(500).json({
            message: "Server error",
        });
    }
}
async function createUserController(req, res) {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Forbidden",
            });
        }
        const { email } = req.body;
        const inviteToken = crypto_1.default.randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
        await (0, users_service_1.createUserService)(email, req.user.company, inviteToken, expiresAt);
        const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${inviteToken}`;
        res.json({
            message: "User created",
            inviteLink,
        });
    }
    catch (err) {
        console.error("CREATE USER ERROR:", err);
        res.status(500).json({
            message: "Server error",
        });
    }
}
async function activateUserController(req, res) {
    try {
        const { token, password, name } = req.body;
        const result = await (0, users_service_1.checkToken)(token);
        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
            });
        }
        await (0, users_service_1.passwordSet)(result.user.id, password, name);
        return res.json({
            message: "Account activated",
        });
    }
    catch (err) {
        console.error("ACTIVATE USER ERROR:", err);
        return res.status(500).json({
            message: "Server error",
        });
    }
}
