"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScheduledVisitController = createScheduledVisitController;
exports.getScheduledVisitsController = getScheduledVisitsController;
const scheduledVisits_service_1 = require("../services/scheduledVisits.service");
async function createScheduledVisitController(req, res) {
    try {
        const companyId = req.user.company;
        const userId = req.user.id;
        const { customerId, scheduledAt, durationMin, notes } = req.body;
        await (0, scheduledVisits_service_1.createScheduledVisitService)(companyId, userId, customerId, scheduledAt, durationMin, notes);
        return res.json({
            message: "Scheduled visit created",
        });
    }
    catch (err) {
        console.error("CREATE SCHEDULED VISIT ERROR:", err);
        return res.status(500).json({
            message: "Server error",
        });
    }
}
async function getScheduledVisitsController(req, res) {
    try {
        const companyId = req.user.company;
        const userId = req.user.id;
        const visits = await (0, scheduledVisits_service_1.getScheduledVisitsService)(companyId, userId);
        return res.json(visits);
    }
    catch (err) {
        console.error("GET SCHEDULED VISITS ERROR:", err);
        return res.status(500).json({
            message: "Server error",
        });
    }
}
