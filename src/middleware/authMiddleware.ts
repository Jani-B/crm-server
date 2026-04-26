import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export function authMiddleware(req: any, res: Response, next: NextFunction) {
  const token = req.cookies.token;

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
