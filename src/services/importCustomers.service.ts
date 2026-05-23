import { pool } from "../config/db";

import { geocodeAddress } from "../utils/geocode";

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function importCustomersService(
  customers: any[],
  companyId: number,
) {
  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of customers) {
    const [existingRows]: any = await pool.query(
      `SELECT id FROM customers WHERE company_id = ? AND name = ? AND address = ?`,
      [companyId, row.name, row.address],
    );

    //lets skip dublicates
    if (existingRows.length > 0) {
      console.log("Skipped dublicate: ", row.name);

      skipped++;

      continue;
    }

    const geo = await geocodeAddress(row.address);

    await delay(1000);

    if (!geo) {
      console.log("No coordinates for:", row.address);

      failed++;

      continue;
    }

    await pool.query(
      `
        INSERT INTO customers
        (name, address, lat, lng, company_id)
        VALUES (?,?,?,?,?)`,
      [row.name, row.address, geo.lat, geo.lng, companyId],
    );

    success++;
  }

  return {
    success,
    failed,
    skipped,
  };
}
