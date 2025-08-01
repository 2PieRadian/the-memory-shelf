import mongoose, { Schema, model } from "mongoose";

const LinkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Link = model("link", LinkSchema);
export default Link;
