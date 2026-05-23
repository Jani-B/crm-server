import crypto from "crypto";
import { pool } from "../config/db";

export async function createCompanyAdmin(email: string, companyId: number) {
  const inviteToken = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await pool.query(
    `INSERT INTO users (email, company_id, role, status, invite_token, invite_token_expires)
    VALUES (?,?,?,?,?,?)`,
    [email, companyId, "admin", "pending", inviteToken, expiresAt],
  );

  return inviteToken;
}
