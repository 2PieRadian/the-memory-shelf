import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("Mongo URI is not defined in the .env file");
}

export default async function connectToDB() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("connected to db");
  } catch (err) {
    console.log(err);
  }
}
