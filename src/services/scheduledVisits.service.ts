import { pool } from "../config/db";

export async function createScheduledVisitService(
  companyId: number,
  userId: number,
  customerId: number,
  scheduledAt: string,
  durationMin: number = 60,
  visitOrder: number = 0,
  notes?: string,
) {
  // Security:
  // Make sure customer belongs to this company

  const [customerRows]: any = await pool.execute(
    `
    SELECT id
    FROM customers
    WHERE id = ?
    AND company_id = ?
    AND is_active = 1
    `,
    [customerId, companyId],
  );

  if (customerRows.length === 0) {
    throw new Error("Customer not found");
  }

  await pool.execute(
    `
    INSERT INTO scheduled_visits
    (
      company_id,
      customer_id,
      user_id,
      scheduled_at,
      duration_min,
      visit_order,
      notes
    )
    VALUES (?,?,?,?,?,?,?)
    `,
    [
      companyId,
      customerId,
      userId,
      scheduledAt,
      durationMin,
      visitOrder,
      notes || null,
    ],
  );
}

export async function getScheduledVisitsService(
  companyId: number,
  userId: number,
) {
  const [rows]: any = await pool.execute(
    `
    SELECT
      sv.*,
      c.name AS customer_name,
      c.address

    FROM scheduled_visits sv

    JOIN customers c
      ON c.id = sv.customer_id

    WHERE
      sv.company_id = ?
      AND sv.user_id = ?
      AND sv.status = 'planned'

    ORDER BY
      DATE(sv.scheduled_at),
      sv.visit_order,
      sv.scheduled_at
    `,
    [companyId, userId],
  );

  return rows;
}
