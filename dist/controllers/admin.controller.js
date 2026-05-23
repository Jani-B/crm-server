"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompanyController = createCompanyController;
const company_service_1 = require("../services/company.service");
const admin_service_1 = require("../services/admin.service");
async function createCompanyController(req, res) {
    try {
        const { companyName, adminEmail } = req.body;
        if (!companyName || !adminEmail) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }
        const companyId = await (0, company_service_1.createCompany)(companyName);
        const inviteToken = await (0, admin_service_1.createCompanyAdmin)(adminEmail, companyId);
        const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${inviteToken}`;
        return res.json({
            message: "Company created",
            inviteLink,
        });
    }
    catch (err) {
        console.error("CREATE COMPANY ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
}
