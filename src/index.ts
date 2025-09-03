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
import {
  create_room_post,
  get_all_created_rooms_post,
  get_user_id_via_email,
  getMembersInARoom,
} from "./controller/viberoomController";

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

// ---- viberoom API's ----
// Create a room
app.post("/api/v1/create-room", authMiddleware, create_room_post);

// Get all the rooms Created by the Current user
app.post("/api/v1/rooms", authMiddleware, get_all_created_rooms_post);

// TODO: Join a room
app.post("/api/v1/join-room", authMiddleware, (req, res) => {});

// TODO: Get all the users in the room
app.get("/api/v1/room/:roomId/members", authMiddleware, getMembersInARoom);

app.listen(3000, async () => {
  try {
    await connectToDB();
    console.log("listening on http://localhost:3000");
  } catch (err) {
    console.log(err);
  }
});
