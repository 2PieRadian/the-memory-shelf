import { Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const maxAgeInMS = 1000 * 60 * 60 * 24 * 7; // 7 days

export default function createToken(username: string, res: Response) {
  const token = jwt.sign({ username }, JWT_SECRET!, { expiresIn: "7d" });

  res.cookie("jwt-token", token, { maxAge: maxAgeInMS, httpOnly: true });
}
