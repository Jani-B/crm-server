import { pool } from "../config/db";
import { geocodeAddress } from "../utils/geocode";

export async function getCustomers(companyId: number) {
  const [rows]: any = await pool.query(
    `
    SELECT
      c.id,
      c.name,
      c.address,
      c.lat,
      c.lng,
      c.is_important,
      c.is_active,
      MAX(v.visited_at) as last_visit
    FROM customers c
    LEFT JOIN visits v
      ON v.customer_id = c.id
    WHERE c.company_id = ?
    GROUP BY c.id
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

export async function createCustomerService(
  name: string,
  address: string,
  companyId: number,
) {
  const geo = await geocodeAddress(address);

  if (!geo) {
    throw new Error("Address could not be geocoded");
  }

  await pool.execute(
    `INSERT INTO customers
    (name, address, lat, lng, company_id) VALUES (?,?,?,?,?)`,
    [name, address, geo.lat, geo.lng, companyId],
  );
}

export async function updateCustomerService(
  name: string,
  address: string,
  customerId: number,
  companyId: number,
) {
  const geo = await geocodeAddress(address);

  if (!geo) {
    throw new Error("Address could not be geocoded");
  }

  const [result]: any = await pool.execute(
    `UPDATE customers
    SET name = ?, address = ?, lat = ?, lng = ? WHERE id = ? AND company_id = ?`,
    [name, address, geo.lat, geo.lng, customerId, companyId],
  );

  if (result.affectedRows === 0) {
    throw new Error("Customer not found");
  }
}

export async function deactivateCustomerService(
  customerId: number,
  companyId: number,
) {
  const [result]: any = await pool.execute(
    `UPDATE customers
    SET is_active = 0
    WHERE id = ?
    AND company_id = ?`,
    [customerId, companyId],
  );

  if (result.affectedRows === 0) {
    throw new Error("Customer not found");
  }
}
