import { Request, Response } from "express";
import User from "../model/User";
import createToken from "../lib/Token";
import bcrypt from "bcrypt";

export async function signup_post(req: Request, res: Response) {
  const { username, password } = req.body;

  // Bad Username
  if (username.length < 3 || username.length > 10) {
    res.status(411).send({ message: "Error in inputs" });
    return;
  }

  // Bad Password
  if (password.length < 8 || password.length > 20) {
    res.status(411).send({ message: "Error in inputs" });
    return;
  }

  // User already exists
  const userExistsAlready = await User.findOne({ username });
  if (userExistsAlready) {
    res.status(403).send({ message: "User already exists with this username" });
    return;
  }

  // Creating the user with {username, password}
  try {
    await User.create({ username, password });

    // Creating and Saving the JWT Token to the "Cookie"
    createToken(username, res);

    res.status(200).send({
      message: `User created with {${username}, ${password}}`,
    });
  } catch (err) {
    res
      .status(500)
      .send({ mesage: "An error occurred while creating the user" });
  }
}

export async function signin_post(req: Request, res: Response) {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  // If user is not found
  if (!user) {
    return res.status(403).json({ message: "Sign up first" });
  }

  // Compare password
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(403).json({ message: "Incorrect credentials" });
  }

  createToken(username, res);

  res.status(200).json({ message: "Logged in successfully" });
}
