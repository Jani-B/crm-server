import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export function authMiddleware(req: any, res: Response, next: NextFunction) {
  console.log("COOKIES:", req.cookies); // 👈 ADD THIS
  console.log("HEADERS:", req.headers.authorization);
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = verifyJwt(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = decoded;
  next();
}
