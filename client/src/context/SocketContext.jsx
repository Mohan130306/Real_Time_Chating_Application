import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initSocket, disconnectSocket } from "../socket/socket";
import {
  addMessage,
  setTyping,
  clearTyping,
  updateMessage,
  softDeleteMessage,
} from "../redux/slices/messageSlice";
import {
  setOnlineUsers,
  updateChatLastMessage,
  incrementUnread,
} from "../redux/slices/chatSlice";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { activeChat } = useSelector((state) => state.chat);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user || !token) return;

    const socket = initSocket(token);
    socketRef.current = socket;

    // ── Online users ──────────────────────────────────────────────────────
    socket.on("onlineUsers", (userIds) => {
      dispatch(setOnlineUsers(userIds));
    });

    // ── Incoming message ──────────────────────────────────────────────────
    socket.on("receiveMessage", (message) => {
      dispatch(addMessage(message));

      const chatId  = message.chatId;
      const type    = message.chatType || "Chat";
      const isActive = activeChat?.id === chatId;

      dispatch(updateChatLastMessage({ chatId, message, type }));

      if (!isActive) {
        dispatch(incrementUnread({ chatId, type }));
        toast.custom((t) => (
          <div
            className={`${t.visible ? "animate-slide-up" : "opacity-0"}
              flex items-center gap-3 bg-dark-600 border border-white/10
              rounded-2xl px-4 py-3 shadow-xl cursor-pointer max-w-xs`}
            onClick={() => toast.dismiss(t.id)}
          >
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {message.senderId?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{message.senderId?.name}</p>
              <p className="text-xs text-slate-400 truncate">{message.text || "📎 Media"}</p>
            </div>
          </div>
        ), { duration: 3000, position: "top-right" });
      }
    });

    // ── Typing ────────────────────────────────────────────────────────────
    socket.on("typing", ({ chatId, userId }) => {
      dispatch(setTyping({ chatId, userId }));
    });

    socket.on("stopTyping", ({ chatId, userId }) => {
      dispatch(clearTyping({ chatId, userId: userId || "" }));
    });

    // ── Seen ──────────────────────────────────────────────────────────────
    socket.on("messageSeen", ({ chatId }) => {
      // Could update seen status here
    });

    socket.on("messageReaction", ({ chatId, message }) => {
      if (activeChat?.id === chatId) {
        dispatch(updateMessage(message));
      }
    });

    socket.on("messageDeleted", ({ chatId, messageId }) => {
      if (activeChat?.id === chatId) {
        dispatch(softDeleteMessage(messageId));
      }
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageSeen");
      socket.off("messageReaction");
      socket.off("messageDeleted");
    };
  }, [user, token]);

  // Cleanup on logout
  useEffect(() => {
    if (!user) disconnectSocket();
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
