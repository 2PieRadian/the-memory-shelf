import { Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const maxAgeInMS = 1000 * 60 * 60 * 24 * 7; // 7 days

export default function createToken(email: string, res: Response) {
  const token = jwt.sign({ email }, JWT_SECRET!, { expiresIn: "7d" });

  res.cookie("token", token, {
    maxAge: maxAgeInMS,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
}
