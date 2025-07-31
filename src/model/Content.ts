import mongoose, { mongo } from "mongoose";

const ContentSchema = new mongoose.Schema({
  link: {
    type: String,
  },
});

const Content = mongoose.model("content", ContentSchema);
export default Content;
