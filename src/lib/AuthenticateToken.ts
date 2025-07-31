import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../model/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  username: string;
  iat?: number;
  exp?: number;
}

export default async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  // If there is no token in the cookie
  if (!token) {
    res.status(401).json({ message: "No token found in cookies!" });
    return;
  }

  try {
    // decoded = {username: 'some username'} / payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Search the decoded "username" in the DB
    const user = await User.findOne({ username: decoded.username });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Adding the user to the request
    req.user = user;
    next();
  } catch (err) {
    console.log("Error in authenticating JWT");
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
