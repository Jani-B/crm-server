"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
async function login(req, res) {
    const { email, password } = req.body;
    const [rows] = await db_1.pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = (0, jwt_1.signJwt)({
        id: user.id,
        company: user.company_id,
        role: user.role,
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // change to true in production (HTTPS)
        sameSite: "lax",
        maxAge: 1000 * 60 * 60, // 1 hour
    });
    return res.json({ message: "Login successful" });
}
