import { Request, Response } from "express";
import { pool } from "../config/db";
import {
  getVisitsService,
  createVisitService,
} from "../services/visits.service";

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
    const { customerId, comment, visitedAt, scheduledVisitId } = req.body;

    const companyId = req.user.company;

    await createVisitService(
      companyId,
      customerId,
      comment,
      visitedAt,
      scheduledVisitId,
    );

    res.json({
      message: "Visit added",
    });
  } catch (err: any) {
    if (
      [
        "Customer not found",
        "Scheduled visit not found",
        "Scheduled visit customer mismatch",
        "Scheduled visit is not planned",
        "Invalid visit date",
      ].includes(err.message)
    ) {
      return res.status(403).json({ message: err.message });
    }

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
