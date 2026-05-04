import { Request, Response } from "express";
import {
  getCustomers,
  getCustomerByIdService,
} from "../services/customers.service";

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

export async function getCustomerById(req: any, res: Response) {
  try {
    const { id } = req.params;
    const companyId = req.user.company;

    const customer = await getCustomerByIdService(id, companyId);

    if (customer.length === 0) {
      return res.status(404).json({ message: "customer not Found" });
    }

    res.json(customer[0]);
  } catch (err) {
    console.log("GET CUSTOMER ERROR:", err);
    res.status(500).json({ message: "server error" });
  }
}
