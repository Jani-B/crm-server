"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./config/db");
async function test() {
    try {
        const [rows] = await db_1.pool.execute("SELECT 1");
        console.log("DB OK:", rows);
    }
    catch (err) {
        console.error("DB ERROR:", err);
    }
}
test();
