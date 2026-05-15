import { pool } from "../config/db";

export async function getUsersService(companyId: number) {
  const [rows]: any = await pool.query(
    `
    SELECT id, name, email, role
    FROM users
    WHERE company_id = ?
    ORDER BY id ASC
    `,
    [companyId],
  );

  return rows;
}

export async function createUserService(
  email: string,
  companyId: number,
  inviteToken: string,
  expiresAt: Date,
) {
  await pool.query(
    `
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
    `,
    [email, companyId, "user", "pending", inviteToken, expiresAt],
  );
}
