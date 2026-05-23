"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompany = createCompany;
const db_1 = require("../config/db");
async function createCompany(name) {
    const [result] = await db_1.pool.query(`INSERT INTO companies (name) VALUES (?)`, [name]);
    return result.insertId;
}
