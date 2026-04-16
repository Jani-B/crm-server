import { Request, Response } from "express";
import { pool } from "../config/db";
import bcrypt from "bcryptjs";
import { signJwt } from "../utils/jwt";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  const user = rows[0];

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = signJwt({
    id: user.id,
    company: user.company_id,
    role: user.role,
  });

  res.json({ token });
}
