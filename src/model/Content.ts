import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  link: String,
  title: String,
  type: String,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Content = mongoose.model("content", ContentSchema);
export default Content;
