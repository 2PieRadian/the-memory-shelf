import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

userSchema.pre<IUser>("save", async function (next) {
  // If the password is the same as before, don't hash it
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = mongoose.model<IUser>("user", userSchema);
export default User;
