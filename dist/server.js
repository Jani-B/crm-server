"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const customers_routes_1 = __importDefault(require("./routes/customers.routes"));
const visits_routes_1 = __importDefault(require("./routes/visits.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    if (req.url.startsWith("/crmserver")) {
        req.url = req.url.replace("/crmserver", "") || "/";
    }
    next();
});
const allowedOrigins = [
    "http://localhost:3000",
    "https://fastvisitor.vercel.app",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/customers", customers_routes_1.default);
app.use("/api/visits", visits_routes_1.default);
app.get("/", (req, res) => {
    res.send("API running");
});
app.listen(3001, () => {
    console.log("Server running on port 3001");
});
