import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  roomId: {
    type: String,
    unique: true,
  },

  roomName: {
    type: String,
    default: "",
  },
});

const Room = mongoose.model("Room", RoomSchema);
export default Room;
