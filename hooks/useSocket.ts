import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://api.albarqiq.net"; // Replace with your server URL

interface Handlers {
  onOrderUpdate?: () => void;
  // Add more as needed
}

export const useSocket = (handlers: Handlers = {}, userId: string) => {
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"], // Recommended for React Native
      // Add auth if needed
      // auth: { token: "YOUR_TOKEN" }
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to socket.io server");
      // Emit saveUserId when connected
      socketRef.current?.emit("saveUserId", { userId });
      console.log("📤 saveUserId emitted:", userId);
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Disconnected from socket.io server");
    });

    // Example: listening to custom event
    if (handlers.onOrderUpdate) {
      socketRef.current.on("newUpdate", handlers.onOrderUpdate);
    }

    // // Clean up on unmount
    // return () => {
    //   socketRef.current?.disconnect();
    // };
  }, []);

  return socketRef;
};
