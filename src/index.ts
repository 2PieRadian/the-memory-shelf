import "./config";

import express from "express";
import User from "./model/User";
import connectToDB from "./db";
import createToken from "./lib/Token";
import { signin_post, signup_post } from "./controller/authController";

const app = express();
app.use(express.json());

// SIGN-UP
app.post("/api/v1/signup", signup_post);

// SIGN-IN
app.post("/api/v1/signin", signin_post);

app.post("/api/v1/content", (req, res) => {});

// Fetching all existing documents (no pagination)
app.get("/api/v1/content", (req, res) => {});

app.listen(3000, async () => {
  try {
    await connectToDB();
    console.log("listening on http://localhost:3000");
  } catch (err) {
    console.log(err);
  }
});
