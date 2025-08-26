import { Request, Response } from "express";
import User from "../model/User";

export async function get_user_id_via_email(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const response = await User.findOne({ email: email });

  if (!response) {
    return res.status(404).json({ message: "No user found" });
  }

  return res.status(200).json({ userId: response._id });
}
