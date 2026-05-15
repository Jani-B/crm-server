import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import customersRoutes from "./routes/customers.routes";
import visitsRoutes from "./routes/visits.routes";
import usersRoutes from "./routes/users.routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());
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

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/visits", visitsRoutes);
app.use("/api/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
