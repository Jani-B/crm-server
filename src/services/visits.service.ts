import { pool } from "../config/db";

export async function getVisitsService(companyId: number) {
  const [rows]: any = await pool.query(
    `SELECT v.*, c.name as customer_name
        FROM visits v
        JOIN customers c
        on c.id = v.customer_id
        WHERE v.company_id = ?
        ORDER BY v.visited_at DESC`[companyId],
  );

  return rows;
}
