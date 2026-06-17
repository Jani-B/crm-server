import { Request, Response } from "express";
import { parse } from "csv-parse/sync";
import {
  getCustomers,
  getCustomerByIdService,
  toggleImportantService,
  createCustomerService,
  updateCustomerService,
  deactivateCustomerService,
} from "../services/customers.service";
import { importCustomersService } from "../services/importCustomers.service";

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

export async function toggleImportantController(req: any, res: Response) {
  try {
    const { customerId } = req.body;
    const companyId = req.user.company;

    await toggleImportantService(customerId, companyId);

    res.json({
      message: "updated",
    });
  } catch (err) {
    console.error("TOGGLE IMPORTANT ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function importCustomersController(req: any, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }
    const csvText = req.file.buffer.toString("utf-8");
    const records = parse(csvText, {
      columns: (header: string[]) => header.map((h) => h.trim()),
      skip_empty_lines: true,
      delimiter: ";",
    });

    const result = await importCustomersService(records, req.user.company);

    return res.json({
      message: "Import finished",
      success: result.success,
      skipped: result.skipped,
      failed: result.failed,
    });
  } catch (err) {
    console.error("IMPORT ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function createCustomerController(req: any, res: Response) {
  try {
    const { name, address } = req.body;
    const companyId = req.user.company;

    await createCustomerService(name, address, companyId);

    return res.json({
      message: "Customer Created",
    });
  } catch (err) {
    console.error("CREATE CUSTOMER ERROR:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function updateCustomerController(req: any, res: Response) {
  try {
    const customerId = req.params.id;
    const companyId = req.user.company;
    const { name, address } = req.body;

    await updateCustomerService(name, address, customerId, companyId);
    return res.json({
      message: "customer updated",
    });
  } catch (err) {
    console.error("UPDATE CUSTOMER ERROR:", err);
    return res.status(500).json({
      message: "server error",
    });
  }
}

export async function deactivateCustomerController(req: any, res: Response) {
  try {
    const customerId = req.params.id;
    const companyId = req.user.company;

    await deactivateCustomerService(customerId, companyId);
    return res.json({
      message: "Customer Deactivated",
    });
  } catch (err) {
    console.error("DEACTIVATE CUSTOMER ERROR:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}
