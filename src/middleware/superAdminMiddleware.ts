import { Response } from "express";

export function superAdminmiddleware(req: any, res: Response, next: any) {
  if (req.user.role !== "super_admin") {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
  next();
}
