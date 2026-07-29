"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScheduledVisitService = createScheduledVisitService;
exports.getScheduledVisitsService = getScheduledVisitsService;
const db_1 = require("../config/db");
async function createScheduledVisitService(companyId, userId, customerId, scheduledAt, durationMin = 60, visitOrder = 0, notes) {
    // Security:
    // Make sure customer belongs to this company
    const [customerRows] = await db_1.pool.execute(`
    SELECT id
    FROM customers
    WHERE id = ?
    AND company_id = ?
    AND is_active = 1
    `, [customerId, companyId]);
    if (customerRows.length === 0) {
        throw new Error("Customer not found");
    }
    await db_1.pool.execute(`
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
    `, [
        companyId,
        customerId,
        userId,
        scheduledAt,
        durationMin,
        visitOrder,
        notes || null,
    ]);
}
async function getScheduledVisitsService(companyId, userId) {
    const [rows] = await db_1.pool.execute(`
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
    `, [companyId, userId]);
    return rows;
}
