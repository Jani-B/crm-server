"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCustomersService = importCustomersService;
const db_1 = require("../config/db");
const geocode_1 = require("../utils/geocode");
function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
}
async function importCustomersService(customers, companyId) {
    let success = 0;
    let failed = 0;
    for (const row of customers) {
        const geo = await (0, geocode_1.geocodeAddress)(row.address);
        await delay(1000);
        if (!geo) {
            console.log("No coordinates for:", row.address);
            failed++;
            continue;
        }
        await db_1.pool.query(`
        INSERT INTO customers
        (name, address, lat, lng, company_id)
        VALUES (?,?,?,?,?)`, [row.name, row.address, geo.lat, geo.lng, companyId]);
        success++;
    }
    return {
        success,
        failed,
    };
}
