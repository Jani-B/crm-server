"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersService = getUsersService;
exports.createUserService = createUserService;
const db_1 = require("../config/db");
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
