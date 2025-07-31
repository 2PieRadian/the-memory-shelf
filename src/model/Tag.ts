import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  title: String,
});

const Tag = mongoose.model("tag", TagSchema);
export default Tag;
