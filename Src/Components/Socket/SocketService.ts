import { io, Socket } from "socket.io-client";
import { AppState } from "react-native";
import { chatBaseUrl } from "../../Constants/ApiUrls";



const SOCKET_URL = chatBaseUrl;

class SocketService {
  private socket: Socket | null = null;

  initializeSocket = async (token: string) => {
    if (!token) {
      console.error("❌ Token is missing. Cannot initialize socket.");
      return;
    }
  
    if (this.socket && this.socket.connected) {
      console.log("⚠️ Socket already connected");
      return;
    }
  
    console.log("🔌 Initializing socket...");
  
    this.socket = io(SOCKET_URL, {
        transports: ["polling", "websocket"], // Start with polling, then upgrade
        query: { token },
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 3000,
      });
      
  
    this.socket.on("connect", () => {
      console.log("globalThis.userId",globalThis.userId)
      if (globalThis.userId) {
        this.socket?.emit("join", { user_id: globalThis.userId });
      }
      console.log("✅ Connected to socket server");
    });
  
    this.socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from socket server, Reason:", reason);
    });
  
    this.socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });
  
    AppState.addEventListener("change", this.handleAppStateChange);
  };

  private handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === "active") {
      if (this.socket && !this.socket.connected) {
        console.log("🔄 Reconnecting socket...");
        this.socket.connect();
      } else {
        console.log("✅ Socket already connected.");
      }
    }
  };

  getSocket = () => {
    return this.socket;
  };

  joinRoom = (userId: string, friendId: string) => {
    if (this.socket) {
      this.socket.emit("joinRoom", { user_1: userId, user_2: friendId });
      console.log(`📩 Emitted joinRoom with user_1: ${userId}, user_2: ${friendId}`);
    } else {
      console.error("❌ Socket not initialized. Cannot join room.");
    }
  };


  sendTextMessage = (obj : object)=>{
    if (this.socket) {
      this.socket.emit("message", obj);
      console.log(`msg sent`);
    } else {
      console.error("❌ Socket not initialized. Cannot send message.");
    }
  }

  sendFileMessage = (obj : object)=>{
    if (this.socket) {
      this.socket.emit("message", obj);
      console.log(`msg sent`);
    } else {
      console.error("❌ Socket not initialized. Cannot send message.");
    }
  }
  disconnectSocket = () => {
    if (this.socket) {
      console.log("🚪 Disconnecting socket...");
      this.socket.disconnect();
    }
  };
}

export default new SocketService();
