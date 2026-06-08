"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomers = getCustomers;
exports.getCustomerByIdService = getCustomerByIdService;
exports.toggleImportantService = toggleImportantService;
exports.createCustomerService = createCustomerService;
exports.updateCustomerService = updateCustomerService;
const db_1 = require("../config/db");
const geocode_1 = require("../utils/geocode");
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
async function createCustomerService(name, address, companyId) {
    const geo = await (0, geocode_1.geocodeAddress)(address);
    if (!geo) {
        throw new Error("Address could not be geocoded");
    }
    await db_1.pool.execute(`INSERT INTO customers
    (name, address, lat, lng, company_id) VALUES (?,?,?,?,?)`, [name, address, geo.lat, geo.lng, companyId]);
}
async function updateCustomerService(name, address, customerId, companyId) {
    const geo = await (0, geocode_1.geocodeAddress)(address);
    if (!geo) {
        throw new Error("Address could not be geocoded");
    }
    const [result] = await db_1.pool.execute(`UPDATE customers
    SET name = ?, address = ?, lat = ?, lng = ? WHERE id = ? AND company_id = ?`, [name, address, geo.lat, geo.lng, customerId, companyId]);
    if (result.affectedRows === 0) {
        throw new Error("Customer not found");
    }
}
