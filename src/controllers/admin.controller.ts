import { Request, Response } from "express";
import { createCompany } from "../services/company.service";
import { createCompanyAdmin } from "../services/admin.service";

export async function createCompanyController(req: Request, res: Response) {
  try {
    const { companyName, adminEmail } = req.body;

    if (!companyName || !adminEmail) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const companyId = await createCompany(companyName);

    const inviteToken = await createCompanyAdmin(adminEmail, companyId);

    const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${inviteToken}`;

    return res.json({
      message: "Company created",
      inviteLink,
    });
  } catch (err) {
    console.error("CREATE COMPANY ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
