import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectToDB from "./db";
import {
  checkAuth,
  logout_post,
  signin_post,
  signup_post,
} from "./controller/authController";
import {
  create_content,
  delete_sharable_link,
  get_content,
  create_sharable_link,
  get_sharable_link_content,
  delete_content,
} from "./controller/contentController";
import authMiddleware from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./lib/socket";
import { get_user_id_via_email } from "./controller/viberoomController";

const app = express();

// Parse the body to JSON
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Check-auth
app.get("/api/v1/checkauth", authMiddleware, checkAuth);

// Sign-up
app.post("/api/v1/signup", signup_post);

// Sign-in
app.post("/api/v1/signin", signin_post);

// Logout
app.post("/api/v1/logout", authMiddleware, logout_post);

// Creating new content
app.post("/api/v1/content", authMiddleware, create_content);

// Fetching all existing content
app.get("/api/v1/content", authMiddleware, get_content);

app.delete("/api/v1/content", authMiddleware, delete_content);

// Create a sharable link
app.post("/api/v1/share", authMiddleware, create_sharable_link);

// Show users the content at the sharable link
app.get("/share/:unique_string", authMiddleware, get_sharable_link_content);

// Delete the sharable link
app.delete("/api/v1/share", authMiddleware, delete_sharable_link);

// Get userId via email
app.post("/api/v1/user", authMiddleware, get_user_id_via_email);

// Get all the users in the room
app.get("/api/v1/room/:roomId/users", authMiddleware, (req, res) => {
  // TODO
});

// Create a room
app.post("/api/v1/room", authMiddleware, (req, res) => {
  // TODO
});

app.listen(3000, async () => {
  try {
    await connectToDB();
    console.log("listening on http://localhost:3000");
  } catch (err) {
    console.log(err);
  }
});
