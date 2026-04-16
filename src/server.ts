import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import customersRoutes from "./routes/customers.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // your Next.js dev
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
