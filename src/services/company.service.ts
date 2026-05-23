import { pool } from "../config/db";

export async function createCompany(name: string) {
  const [result]: any = await pool.query(
    `INSERT INTO companies (name) VALUES (?)`,
    [name],
  );

  return result.insertId;
}
