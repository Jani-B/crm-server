import { Request, Response } from "express";
import {
  getUsersService,
  createUserService,
  checkToken,
  passwordSet,
} from "../services/users.service";
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

    const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${inviteToken}`;

    res.json({
      message: "User created",
      inviteLink,
    });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function activateUserController(req: Request, res: Response) {
  try {
    const { token, password, name } = req.body;

    const result = await checkToken(token);

    if (!result.valid) {
      return res.status(400).json({
        message: result.message,
      });
    }

    await passwordSet(result.user.id, password, name);

    return res.json({
      message: "Account activated",
    });
  } catch (err) {
    console.error("ACTIVATE USER ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
}
