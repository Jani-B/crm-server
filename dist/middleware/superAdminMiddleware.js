"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminmiddleware = superAdminmiddleware;
function superAdminmiddleware(req, res, next) {
    if (req.user.role !== "super_admin") {
        return res.status(403).json({
            message: "Forbidden",
        });
    }
    next();
}
