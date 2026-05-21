"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersService = getUsersService;
exports.createUserService = createUserService;
exports.checkToken = checkToken;
exports.passwordSet = passwordSet;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function getUsersService(companyId) {
    const [rows] = await db_1.pool.query(`
    SELECT id, name, email, role
    FROM users
    WHERE company_id = ?
    ORDER BY id ASC
    `, [companyId]);
    return rows;
}
async function createUserService(email, companyId, inviteToken, expiresAt) {
    await db_1.pool.query(`
    INSERT INTO users
    (
      email,
      password,
      company_id,
      role,
      status,
      invite_token,
      invite_token_expires
    )
    VALUES (?, NULL, ?, ?, ?, ?, ?)
    `, [email, companyId, "user", "pending", inviteToken, expiresAt]);
}
async function checkToken(inviteToken) {
    const [rows] = await db_1.pool.query(`
    SELECT *
    FROM users
    WHERE invite_token = ?
    `, [inviteToken]);
    const user = rows[0];
    if (!user) {
        return {
            valid: false,
            message: "Invalid token",
        };
    }
    if (user.invite_token_expires) {
        if (new Date(user.invite_token_expires) < new Date()) {
            return {
                valid: false,
                message: "Token expired",
            };
        }
    }
    return {
        valid: true,
        user,
    };
}
async function passwordSet(userId, password, name) {
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    await db_1.pool.query(`
    UPDATE users
    SET
      name = ?,
      password = ?,
      invite_token = NULL,
      invite_token_expires = NULL,
      status = 'active'
    WHERE id = ?
    `, [name, hashedPassword, userId]);
}
