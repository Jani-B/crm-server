import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function signJwt(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
