"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomers = getCustomers;
exports.getCustomerByIdService = getCustomerByIdService;
exports.toggleImportantService = toggleImportantService;
const db_1 = require("../config/db");
async function getCustomers(companyId) {
    const [rows] = await db_1.pool.query(`
    SELECT id, name, address, lat, lng, is_important
    FROM customers
    WHERE company_id = ?
    `, [companyId]);
    return rows;
}
async function getCustomerByIdService(id, companyId) {
    const [rows] = await db_1.pool.query("SELECT * FROM customers WHERE id = ? AND company_id = ?", [id, companyId]);
    return rows;
}
async function toggleImportantService(customerId, companyId) {
    await db_1.pool.query(`UPDATE customers
    SET is_important = NOT is important
    WHERE id = ? AND company_id = ?`, [customerId, companyId]);
}
