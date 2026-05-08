import { Request, Response } from "express";
import { pool } from "../config/db";

export async function getVisitsByCustomerController(
  req: Request,
  res: Response,
) {
  try {
    const customerId = req.params.id;

    const [rows]: any = await pool.execute(
      `
      SELECT *
      FROM visits
      WHERE customer_id = ?
      ORDER BY visited_at DESC
      `,
      [customerId],
    );

    res.json(rows);
  } catch (err) {
    console.error("GET VISITS ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}
