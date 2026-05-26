"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitsService = getVisitsService;
const db_1 = require("../config/db");
async function getVisitsService(companyId) {
    const [rows] = await db_1.pool.query(`SELECT v.*, c.name as customer_name
        FROM visits v
        JOIN customers c
        on c.id = v.customer_id
        WHERE v.company_id = ?
        ORDER BY v.visited_at DESC`[companyId]);
    return rows;
}
