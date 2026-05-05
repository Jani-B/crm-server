"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_1 = require("../utils/jwt");
function authMiddleware(req, res, next) {
    console.log("COOKIES:", req.cookies); // 👈 ADD THIS
    console.log("HEADERS:", req.headers.authorization);
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = (0, jwt_1.verifyJwt)(token);
    if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
}
