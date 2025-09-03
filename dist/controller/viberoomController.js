"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_user_id_via_email = get_user_id_via_email;
exports.getMembersInARoom = getMembersInARoom;
exports.create_room_post = create_room_post;
exports.get_all_created_rooms_post = get_all_created_rooms_post;
exports.join_room_post = join_room_post;
const User_1 = __importDefault(require("../model/User"));
const Room_1 = __importDefault(require("../model/Room"));
const mongoose_1 = __importDefault(require("mongoose"));
function get_user_id_via_email(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const response = yield User_1.default.findOne({ email: email });
        if (!response) {
            return res.status(404).json({ message: "No user found" });
        }
        return res.status(200).json({ userId: response._id });
    });
}
function getMembersInARoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { roomId } = req.params;
        // TODO : Delete this after testing
        console.log("Room ID: ", roomId);
        // If roomId is not provided from the frontend
        if (!roomId) {
            return res.status(400).json({ message: "Room ID is required" });
        }
        const response = yield Room_1.default.findOne({ roomId: roomId }).select("members");
        // If no room is found
        if (!response) {
            return res.status(404).json({ message: "No room found" });
        }
        // TODO : Delete this after testing
        console.log(response);
        return res.status(200).json({ members: response.members });
    });
}
function create_room_post(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { createdBy, roomId, roomName } = req.body;
        if (!roomId || !createdBy) {
            return res
                .status(400)
                .json({ message: "'Room ID' and 'Created By' are required" });
        }
        // Start Transaction
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            // Create the Room
            const newRoom = yield Room_1.default.create([
                {
                    createdBy,
                    roomId,
                    roomName,
                    members: [createdBy],
                },
            ], { session });
            // Update the User
            yield User_1.default.updateOne({ _id: createdBy }, {
                $push: { rooms_created: newRoom[0]._id, joined_rooms: newRoom[0]._id },
            }, { session });
            // Commit Transaction
            yield session.commitTransaction();
            session.endSession();
        }
        catch (err) {
            // Abort the Transaction / Rollback Any Changes
            yield session.abortTransaction();
            session.endSession();
            // If the Room already exists
            if (err instanceof Error && err.code == 11000)
                return res.status(409).json({ message: "Room ID already exists" });
            console.log("Error creating room: ", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        finally {
            session.endSession();
        }
        return res.status(201).json({ message: "Room created successfully" });
    });
}
function get_all_created_rooms_post(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        try {
            const response = yield Room_1.default.find({ createdBy: userId });
            if (response.length === 0) {
                return res
                    .status(200)
                    .json({ message: "You haven't created any rooms yet." });
            }
            return res.status(200).json({ rooms: response });
        }
        catch (err) {
            return res.status(500).json({ message: "An error occured" });
        }
    });
}
function join_room_post(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { roomId, userId } = req.body;
        // TODO: Complete this function
    });
}
