import { Request, Response } from "express";
import { pool } from "../config/db";
import { getVisitsService } from "../services/visits.service";

export async function getVisitsByCustomerController(req: any, res: Response) {
  try {
    const customerId = req.params.id;
    const companyId = req.user.company;

    const [rows]: any = await pool.execute(
      `
      SELECT *
      FROM visits
      WHERE customer_id = ?
      AND company_id = ?
      ORDER BY visited_at DESC
      `,
      [customerId, companyId],
    );

    res.json(rows);
  } catch (err) {
    console.error("GET VISITS ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function createVisitController(req: any, res: Response) {
  try {
    const { customerId, comment, visitedAt } = req.body;

    const companyId = req.user.company;

    const dateToUse =
      visitedAt && visitedAt !== ""
        ? new Date(visitedAt + "T00:00:00")
        : new Date();

    const [customerRows]: any = await pool.execute(
      `SELECT id 
      FROM customers
      WHERE id = ?
      AND company_id = ?`,
      [customerId, companyId],
    );

    if (customerRows.length === 0) {
      return res.status(403).json({
        message: "Customer not found",
      });
    }

    await pool.execute(
      `INSERT INTO visits
      (customer_id, company_id, visited_at, comment)
      VALUES (?,?,?,?)`,
      [customerId, companyId, dateToUse, comment || null],
    );

    res.json({
      message: "Visit added",
    });
  } catch (err) {
    console.error("CREATE VISIT ERROR", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function getVisitsController(req: any, res: Response) {
  try {
    const visits = await getVisitsService(req.user.company);
    return res.json(visits);
  } catch (err) {
    console.error("GET VISITS ERROR:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}
