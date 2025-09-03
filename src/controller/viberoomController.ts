import { Request, Response } from "express";
import User from "../model/User";
import Room from "../model/Room";
import mongoose from "mongoose";

export async function get_user_id_via_email(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const response = await User.findOne({ email: email });

  if (!response) {
    return res.status(404).json({ message: "No user found" });
  }

  return res.status(200).json({ userId: response._id });
}

export async function getMembersInARoom(req: Request, res: Response) {
  const { roomId } = req.params;

  // TODO : Delete this after testing
  console.log("Room ID: ", roomId);

  // If roomId is not provided from the frontend
  if (!roomId) {
    return res.status(400).json({ message: "Room ID is required" });
  }

  const response = await Room.findOne({ roomId: roomId }).select("members");

  // If no room is found
  if (!response) {
    return res.status(404).json({ message: "No room found" });
  }

  // TODO : Delete this after testing
  console.log(response);

  return res.status(200).json({ members: response.members });
}

export async function create_room_post(req: Request, res: Response) {
  const { createdBy, roomId, roomName } = req.body;

  if (!roomId || !createdBy) {
    return res
      .status(400)
      .json({ message: "'Room ID' and 'Created By' are required" });
  }

  // Start Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the Room
    const newRoom = await Room.create(
      [
        {
          createdBy,
          roomId,
          roomName,
          members: [createdBy],
        },
      ],
      { session }
    );

    // Update the User
    await User.updateOne(
      { _id: createdBy },
      {
        $push: { rooms_created: newRoom[0]._id, joined_rooms: newRoom[0]._id },
      },
      { session }
    );

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    // Abort the Transaction / Rollback Any Changes
    await session.abortTransaction();
    session.endSession();

    // If the Room already exists
    if (err instanceof Error && (err as any).code == 11000)
      return res.status(409).json({ message: "Room ID already exists" });

    console.log("Error creating room: ", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }

  return res.status(201).json({ message: "Room created successfully" });
}

export async function get_all_created_rooms_post(req: Request, res: Response) {
  const { userId } = req.body;

  try {
    const response = await Room.find({ createdBy: userId });
    if (response.length === 0) {
      return res
        .status(200)
        .json({ message: "You haven't created any rooms yet." });
    }

    return res.status(200).json({ rooms: response });
  } catch (err) {
    return res.status(500).json({ message: "An error occured" });
  }
}

export async function join_room_post(req: Request, res: Response) {
  const { roomId, userId } = req.body;

  // TODO: Complete this function
}
