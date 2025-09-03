import mongoose, { Document, mongo } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  total_links_saved: number;
  rooms_created: mongoose.Types.ObjectId[];
  joined_rooms: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  username: {
    type: String,
    default: "",
  },
  total_links_saved: {
    type: Number,
    default: 0,
  },
  rooms_created: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: [] },
  ],
  joined_rooms: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: [] },
  ],
});

userSchema.pre<IUser>("save", async function (next) {
  // If the password is the same as before, don't hash it
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
