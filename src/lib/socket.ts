import { WebSocket, WebSocketServer } from "ws";
import { Room } from "./interfaces";

const wss = new WebSocketServer({
  port: 8081,
});

console.log("Websocket server is runnning...");

// <ID, Room>
const rooms = new Map<string, Room>();

// Tracking no. of Clients
let clients = 0;

wss.on("connection", (ws) => {
  clients++;

  console.log("A Client Connected");
  console.log("[ Number of Clients: " + clients + " ]");

  ws.on("error", console.error);

  ws.on("message", (msg) => {
    // This msg is received as a Buffer
    const data = JSON.parse(msg.toString());

    // Joining an Existing room
    if (data.type === "join-room") {
      console.log("someone is trying to join a room");
      const roomId = data.roomId;
      const email = data.email;

      // Getting the room
      const room = rooms.get(roomId);

      // Check if the roomId exists (roomId is Valid), if not throw error
      if (!room) {
        ws.send(`Room [${roomId}] does not exist.`);
        return;
      }

      // If the roomId is valid, check if the user is already in that Room
      if (room.members.has(email)) {
        ws.send(`You're already in the room ${roomId}`);
        return;
      }

      // Add the user to the room (Because the room do exists and the user is not already a memeber of that room)
      room.members.set(email, ws);
      ws.send(`You joined room ${roomId}`);

      // Notify others that a new member joined in the room
      // TODO
      room.members.forEach((member) => {});
    }

    // Creating a new Room
    if (data.type === "create-room") {
      const roomId = data.roomId;
      const roomName = data.roomName;
      const email = data.email;

      const members = new Map<string, WebSocket>();
      members.set(email, ws);

      const room: Room = {
        name: roomName,
        members: members,
      };

      rooms.set(roomId, room);

      console.log(`Created Room : ${roomId}`);
      console.log(`Created by ${email}`);
    }
  });

  ws.on("close", () => {
    console.log("A Client Disconnected");
    clients--;
    console.log("Number of Clients: " + clients);
  });
});
