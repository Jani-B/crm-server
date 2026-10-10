"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitsByCustomerController = getVisitsByCustomerController;
exports.createVisitController = createVisitController;
exports.getVisitsController = getVisitsController;
const db_1 = require("../config/db");
const visits_service_1 = require("../services/visits.service");
async function getVisitsByCustomerController(req, res) {
    try {
        const customerId = req.params.id;
        const companyId = req.user.company;
        const [rows] = await db_1.pool.execute(`
      SELECT *
      FROM visits
      WHERE customer_id = ?
      AND company_id = ?
      ORDER BY visited_at DESC
      `, [customerId, companyId]);
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
        const { customerId, comment, visitedAt, scheduledVisitId } = req.body;
        const companyId = req.user.company;
        await (0, visits_service_1.createVisitService)(companyId, customerId, comment, visitedAt, scheduledVisitId);
        res.json({
            message: "Visit added",
        });
    }
    catch (err) {
        if ([
            "Customer not found",
            "Scheduled visit not found",
            "Scheduled visit customer mismatch",
            "Scheduled visit is not planned",
            "Invalid visit date",
        ].includes(err.message)) {
            return res.status(403).json({ message: err.message });
        }
        console.error("CREATE VISIT ERROR", err);
        res.status(500).json({
            message: "Server error",
        });
    }
}
async function getVisitsController(req, res) {
    try {
        const visits = await (0, visits_service_1.getVisitsService)(req.user.company);
        return res.json(visits);
    }
    catch (err) {
        console.error("GET VISITS ERROR:", err);
        return res.status(500).json({
            message: "Server error",
        });
    }
}
