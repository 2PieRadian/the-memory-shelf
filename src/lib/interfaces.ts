import { WebSocket } from "ws";

export interface Room {
  name: string;
  members: Map<string, WebSocket>;
}
