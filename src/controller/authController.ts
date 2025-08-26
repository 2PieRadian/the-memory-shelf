import { Request, Response } from "express";
import User from "../model/User";
import createToken from "../lib/Token";
import bcrypt from "bcrypt";

export async function signup_post(req: Request, res: Response) {
  const { email, password } = req.body;

  // Wrong email
  if (email.length < 3) {
    res.status(411).send({ message: "Error in inputs" });
    return;
  }

  // Bad Password
  if (password.length < 8 || password.length > 20) {
    res.status(411).send({ message: "Error in inputs" });
    return;
  }

  // Email already exists
  const userExistsAlready = await User.findOne({ email });
  if (userExistsAlready) {
    res.status(403).send({ message: "User already exists with this email" });
    return;
  }

  // Creating the user with {email, password}
  try {
    await User.create({ email, password });

    // Creating and Saving the JWT Token to the cookie named 'token'
    createToken(email, res);

    res.status(200).send({
      message: `User created with {${email}}`,
    });
  } catch (err) {
    res
      .status(500)
      .send({ mesage: "An error occurred while creating the user" });
  }
}

export async function signin_post(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // If user is not found
  if (!user) {
    return res.status(403).json({ message: "Sign up first" });
  }

  // Compare password
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(403).json({ message: "Incorrect credentials" });
  }

  createToken(email, res);

  res.status(200).json({ message: "Logged in successfully" });
}

export async function checkAuth(req: Request, res: Response) {
  return res.json(req.user);
}

export async function logout_post(req: Request, res: Response) {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Error in logout controller: ", (err as Error).message);
    return res.status(500).json({ message: "Error logging out" });
  }
}
