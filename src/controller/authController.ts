import { Request, Response } from "express";
import User from "../model/User";
import createToken from "../lib/Token";

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
    if (err instanceof Error) {
      console.log(err.message);

      res
        .status(500)
        .send({ mesage: "An error occurred while creating the user" });
    } else {
      console.log("An unknown error occurred");
      res
        .status(500)
        .send({ mesage: "An error occurred while creating the user" });
    }
  }
}

export async function signin_post(req: Request, res: Response) {}
