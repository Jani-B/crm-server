"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomersController = getCustomersController;
exports.getCustomerById = getCustomerById;
exports.toggleImportantController = toggleImportantController;
const customers_service_1 = require("../services/customers.service");
async function getCustomersController(req, res) {
    try {
        const companyId = req.user.company;
        const customers = await (0, customers_service_1.getCustomers)(companyId);
        res.json(customers);
    }
    catch (err) {
        console.error("CUSTOMERS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
}
async function getCustomerById(req, res) {
    try {
        const { id } = req.params;
        const companyId = req.user.company;
        const customer = await (0, customers_service_1.getCustomerByIdService)(id, companyId);
        if (customer.length === 0) {
            return res.status(404).json({ message: "customer not Found" });
        }
        res.json(customer[0]);
    }
    catch (err) {
        console.log("GET CUSTOMER ERROR:", err);
        res.status(500).json({ message: "server error" });
    }
}
async function toggleImportantController(req, res) {
    try {
        const { customerId } = req.body;
        const companyId = req.user.company;
        await (0, customers_service_1.toggleImportantService)(customerId, companyId);
        res.json({
            message: "updated",
        });
    }
    catch (err) {
        console.error("TOGGLE IMPORTANT ERROR:", err);
        res.status(500).json({
            message: "Server error",
        });
    }
}
