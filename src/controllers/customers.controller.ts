import { Request, Response } from "express";
import { getCustomers } from "../services/customers.service";

export async function getCustomersController(req: any, res: Response) {
  try {
    const companyId = req.user.company;

    const customers = await getCustomers(companyId);

    res.json(customers);
  } catch (err) {
    console.error("CUSTOMERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}
