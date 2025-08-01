import "./config";

import express from "express";
import connectToDB from "./db";
import { signin_post, signup_post } from "./controller/authController";
import { create_content, get_content } from "./controller/contentController";
import authMiddleware from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";

const app = express();

// Parse the body to JSON
app.use(express.json());
app.use(cookieParser());

// SIGN-UP
app.post("/api/v1/signup", signup_post);

// SIGN-IN
app.post("/api/v1/signin", signin_post);

app.post("/api/v1/content", authMiddleware, create_content);

// Fetching all existing documents (no pagination)
app.get("/api/v1/content", get_content);

app.listen(3000, async () => {
  try {
    await connectToDB();
    console.log("listening on http://localhost:3000");
  } catch (err) {
    console.log(err);
  }
});
