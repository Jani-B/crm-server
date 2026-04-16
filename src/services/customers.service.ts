import { pool } from "../config/db";

export async function getCustomers(companyId: number) {
  const [rows]: any = await pool.query(
    `
    SELECT id, name, address, lat, lng, is_important
    FROM customers
    WHERE company_id = ?
    `,
    [companyId],
  );

  return rows;
}
