"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitsByCustomerController = getVisitsByCustomerController;
exports.createVisitController = createVisitController;
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
async function createVisitController(req, res) {
    try {
        const { customerId, comment, visitedAt } = req.body;
        const companyId = req.user.company;
        const dateToUse = visitedAt && visitedAt !== ""
            ? new Date(visitedAt + "T00:00:00")
            : new Date();
        await db_1.pool.execute(`INSERT INTO visits
      (customer_id, company_id, visited_at, comment)
      VALUES (?,?,?,?)`, [customerId, companyId, dateToUse, comment || null]);
        res.json({
            message: "Visit added",
        });
    }
    catch (err) {
        console.error("CREATE VISIT ERROR", err);
        res.status(500).json({
            message: "Server error",
        });
    }
}
