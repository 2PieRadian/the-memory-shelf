import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  link: String,
  title: String,
  type: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const Content = mongoose.model("content", ContentSchema);
export default Content;
