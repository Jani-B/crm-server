"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitsByCustomerController = getVisitsByCustomerController;
const db_1 = require("../config/db");
async function getVisitsByCustomerController(req, res) {
    try {
        const customerId = req.params.id;
        const [rows] = await db_1.pool.execute(`
      SELECT *
      FROM visits
      WHERE customer_id = ?
      ORDER BY visited_at DESC
      `, [customerId]);
        res.json(rows);
    }
    catch (err) {
        console.error("GET VISITS ERROR:", err);
        res.status(500).json({
            message: "Server error",
        });
    }
}
