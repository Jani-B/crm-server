"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomers = getCustomers;
exports.getCustomerByIdService = getCustomerByIdService;
exports.toggleImportantService = toggleImportantService;
const db_1 = require("../config/db");
async function getCustomers(companyId) {
    const [rows] = await db_1.pool.query(`
    SELECT
      c.id,
      c.name,
      c.address,
      c.lat,
      c.lng,
      c.is_important,
      MAX(v.visited_at) as last_visit
    FROM customers c
    LEFT JOIN visits v
      ON v.customer_id = c.id
    WHERE c.company_id = ?
    GROUP BY c.id
    `, [companyId]);
    return rows;
}
async function getCustomerByIdService(id, companyId) {
    const [rows] = await db_1.pool.query("SELECT * FROM customers WHERE id = ? AND company_id = ?", [id, companyId]);
    return rows;
}
async function toggleImportantService(customerId, companyId) {
    await db_1.pool.query(`UPDATE customers
    SET is_important = NOT is_important
    WHERE id = ? AND company_id = ?`, [customerId, companyId]);
}
