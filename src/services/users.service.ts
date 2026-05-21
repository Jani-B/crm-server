import { pool } from "../config/db";
import bcrypt from "bcryptjs";

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

export async function checkToken(inviteToken: string) {
  const [rows]: any = await pool.query(
    `
    SELECT *
    FROM users
    WHERE invite_token = ?
    `,
    [inviteToken],
  );

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

export async function passwordSet(
  userId: number,
  password: string,
  name: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    `
    UPDATE users
    SET
      name = ?,
      password = ?,
      invite_token = NULL,
      invite_token_expires = NULL,
      status = 'active'
    WHERE id = ?
    `,
    [name, hashedPassword, userId],
  );
}
