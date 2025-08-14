import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  total_links_saved: number;
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
