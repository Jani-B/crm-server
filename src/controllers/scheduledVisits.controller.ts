import { Response } from "express";

import {
  createScheduledVisitService,
  getScheduledVisitsService,
} from "../services/scheduledVisits.service";

export async function createScheduledVisitController(
  req: any,
  res: Response,
) {
  try {
    const companyId = req.user.company;
    const userId = req.user.id;

    const {
      customerId,
      scheduledAt,
      durationMin,
      visitOrder,
      notes,
    } = req.body;

    await createScheduledVisitService(
      companyId,
      userId,
      customerId,
      scheduledAt,
      durationMin,
      visitOrder,
      notes,
    );

    return res.json({
      message: "Scheduled visit created",
    });
  } catch (err) {
    console.error("CREATE SCHEDULED VISIT ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function getScheduledVisitsController(
  req: any,
  res: Response,
) {
  try {
    const companyId = req.user.company;
    const userId = req.user.id;

    const visits = await getScheduledVisitsService(
      companyId,
      userId,
    );

    return res.json(visits);
  } catch (err) {
    console.error("GET SCHEDULED VISITS ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
}