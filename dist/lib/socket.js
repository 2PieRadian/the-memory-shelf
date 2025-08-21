"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({
    port: 8080,
});
console.log("Websocket server is runnning at wss://localhost:8080");
// <ID, Room>
const rooms = new Map();
wss.on("connection", (ws) => {
    ws.on("error", console.error);
    ws.on("message", (msg) => {
        // This msg is sent as a Buffer
        const data = JSON.parse(msg.toString());
        // Joining an Existing room
        if (data.type === "join-room") {
            const roomId = data.roomId;
            const username = data.username;
            // Getting the room
            const room = rooms.get(roomId);
            // Check if the roomId exists (roomId is Valid), if not throw error
            if (!room) {
                ws.send(`Room ${roomId} does not exist.`);
                return;
            }
            // If the roomId is valid, check if the user is already in that Room
            if (room.members.has(username)) {
                ws.send(`You're already in the room ${roomId}`);
                return;
            }
            // Add the user to the room (Because the room do exists and the user is not already a memeber of that room)
            room.members.set(username, ws);
            ws.send(`You joined room ${roomId}`);
            // Notify others that a new member joined in the room
            room.members.forEach((member) => { });
        }
        // Creating a new Room
        if (data.type === "create-room") {
            const roomId = data.roomId;
            const roomName = data.roomName;
            const username = data.username;
            const members = new Map();
            members.set(username, ws);
            const room = {
                name: roomName,
                members: members,
            };
            rooms.set(roomId, room);
            console.log(`Created Room : ${roomId}`);
            console.log(`Created by ${username}`);
        }
    });
});
