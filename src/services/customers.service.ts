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

export async function getCustomerByIdService(id: number, companyId: number) {
  const [rows]: any = await pool.query(
    "SELECT * FROM customers WHERE id = ? AND company_id = ?",
    [id, companyId],
  );

  return rows;
}

export async function toggleImportantService(
  customerId: number,
  companyId: number,
) {
  await pool.query(
    `UPDATE customers
    SET is_important = NOT is_important
    WHERE id = ? AND company_id = ?`,
    [customerId, companyId],
  );
}
