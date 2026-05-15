import { Request, Response } from "express";
import { getUsersService, createUserService } from "../services/users.service";
import crypto from "crypto";

export async function getUsersController(req: any, res: Response) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const users = await getUsersService(req.user.company);

    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function createUserController(req: any, res: Response) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const { email } = req.body;

    const inviteToken = crypto.randomUUID();

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await createUserService(email, req.user.company, inviteToken, expiresAt);

    res.json({
      message: "User created",
    });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}
