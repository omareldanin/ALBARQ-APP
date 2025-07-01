// socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://api.albarqiq.net", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Connected to socket.io");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket.io");
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
