import "./config";

import express from "express";
import connectToDB from "./db";
import { signin_post, signup_post } from "./controller/authController";
import {
  create_content,
  delete_sharable_link,
  get_content,
  create_sharable_link,
  get_sharable_link_content,
} from "./controller/contentController";
import authMiddleware from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";
import { get } from "mongoose";

const app = express();

// Parse the body to JSON
app.use(express.json());
app.use(cookieParser());

// SIGN-UP
app.post("/api/v1/signup", signup_post);

// SIGN-IN
app.post("/api/v1/signin", signin_post);

// Creating new content
app.post("/api/v1/content", authMiddleware, create_content);

// Fetching all existing content
app.get("/api/v1/content", authMiddleware, get_content);

// Create a sharable link
app.post("/api/v1/share", authMiddleware, create_sharable_link);

// Show users the content at the sharable link
app.get("/share/:unique_string", authMiddleware, get_sharable_link_content);

// Delete the sharable link
app.delete("api/v1/share", authMiddleware, delete_sharable_link);

app.listen(3000, async () => {
  try {
    await connectToDB();
    console.log("listening on http://localhost:3000");
  } catch (err) {
    console.log(err);
  }
});
