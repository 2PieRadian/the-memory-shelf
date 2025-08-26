import mongoose, { Schema, model } from "mongoose";

const LinkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
});

const Link = model("link", LinkSchema);
export default Link;
