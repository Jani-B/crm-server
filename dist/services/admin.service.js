"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompanyAdmin = createCompanyAdmin;
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../config/db");
async function createCompanyAdmin(email, companyId) {
    const inviteToken = crypto_1.default.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await db_1.pool.query(`INSERT INTO users (email, company_id, role, status, invite_token, invite_token_expires)
    VALUES (?,?,?,?,?,?)`, [email, companyId, "admin", "pending", inviteToken, expiresAt]);
    return inviteToken;
}
