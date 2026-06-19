import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages, sendMessage as sendMsgThunk, deleteMessage,
  clearMessages, markAsSeen,
} from "../../redux/slices/messageSlice";
import { updateChatLastMessage, clearActiveChat } from "../../redux/slices/chatSlice";
import { useSocket } from "../../context/SocketContext";
import MessageBubble from "./MessageBubble";
import MessageInput  from "./MessageInput";
import Avatar        from "../shared/Avatar";
import Spinner       from "../shared/Spinner";
import GroupInfoSidebar from "./GroupInfoSidebar";
import { Phone, Video, Info, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatWindow() {
  const dispatch   = useDispatch();
  const socket     = useSocket();
  const { user }   = useSelector((s) => s.auth);
  const { activeChat, onlineUsers } = useSelector((s) => s.chat);
  const { messages, loading, typingUsers } = useSelector((s) => s.message);
  const bottomRef  = useRef(null);
  const joinedRef  = useRef(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const navigate = useNavigate();

  // Derive peer / group info
  const isGroup = activeChat?.type === "Group";
  const peer    = !isGroup
    ? activeChat?.data?.participants?.find((p) => p._id !== user?._id)
    : null;
  const displayName = isGroup ? activeChat?.data?.groupName : peer?.name || "Unknown";
  const displayPic  = isGroup ? activeChat?.data?.groupImage : peer?.profilePic;
  const isOnline    = peer ? onlineUsers.includes(peer._id) : false;

  const typingList  = typingUsers[activeChat?.id] || [];
  const isTyping    = typingList.length > 0;

  // Join socket room + fetch messages when activeChat changes
  useEffect(() => {
    if (!activeChat?.id) return;
    if (joinedRef.current === activeChat.id) return;
    joinedRef.current = activeChat.id;

    dispatch(clearMessages());
    dispatch(fetchMessages({ chatId: activeChat.id, type: activeChat.type }));

    if (socket) {
      if (isGroup) socket.emit("joinGroupRoom", { groupId: activeChat.id });
      else         socket.emit("joinRoom", { chatId: activeChat.id });

      // Mark seen
      socket.emit("markSeen", { chatId: activeChat.id });
      dispatch(markAsSeen(activeChat.id));
    }

    return () => { joinedRef.current = null; };
  }, [activeChat?.id, socket]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  const handleSend = useCallback(async ({ text, media }) => {
    if (!activeChat?.id) return;

    const msgData = {
      chatId: activeChat.id,
      chatType: activeChat.type,
      text,
      media,
      mediaType: media ? "image" : "",
      replyTo: replyingTo?._id,
    };

    setReplyingTo(null);
    const result = await dispatch(sendMsgThunk(msgData));

    if (sendMsgThunk.fulfilled.match(result)) {
      const msg = result.payload;
      // Emit via socket so receiver gets it in real-time
      socket?.emit("sendMessage", msg);
      if (activeChat.type === "Chat") {
        const receiverId = activeChat.data.participants?.find((p) => p._id !== user._id)?._id;
        if (receiverId) {
          socket?.emit("sendNotification", {
            receiverId,
            notification: {
              type: "message",
              chatId: activeChat.id,
              message: text || "Sent a message",
            },
          });
        }
      } else {
        activeChat.data.members?.forEach((member) => {
          if (member._id !== user._id) {
            socket?.emit("sendNotification", {
              receiverId: member._id,
              notification: {
                type: "message",
                chatId: activeChat.id,
                message: `${user.name} sent a new message`,
              },
            });
          }
        });
      }
      dispatch(updateChatLastMessage({ chatId: activeChat.id, message: msg, type: activeChat.type }));
    }
  }, [activeChat, socket, dispatch]);

  const handleDelete = (messageId) => {
    dispatch(deleteMessage(messageId));
  };
  
  const handleReply = (msg) => {
    setReplyingTo(msg);
  };

  const handleTyping = useCallback(() => {
    socket?.emit("typing", { chatId: activeChat?.id, userId: user?._id });
  }, [socket, activeChat?.id, user?._id]);

  const handleStopTyping = useCallback(() => {
    socket?.emit("stopTyping", { chatId: activeChat?.id, userId: user?._id });
  }, [socket, activeChat?.id, user?._id]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-dark-900 space-y-4">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-600/20 to-secondary-600/20 border border-white/5 flex items-center justify-center">
          <span className="text-5xl">💬</span>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Start Chatting</h3>
          <p className="text-slate-400 text-sm max-w-xs">
            Select a conversation from the sidebar or start a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-dark-900 min-w-0">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-dark-800/60 backdrop-blur-sm flex-shrink-0">
        {/* Back (mobile) */}
        <button
          onClick={() => dispatch(clearActiveChat())}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400"
        >
          <ArrowLeft size={18} />
        </button>

        <Avatar
          src={displayPic}
          name={displayName}
          size="md"
          online={!isGroup && isOnline}
        />

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-white truncate">{displayName}</h2>
          <p className={`text-xs ${isTyping ? "text-primary-400" : isOnline ? "text-primary-400" : "text-slate-500"}`}>
            {isTyping
              ? "typing..."
              : isGroup
              ? `${activeChat.data?.members?.length || 0} members`
              : isOnline
              ? "Online"
              : "Offline"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button id="voice-call-btn" onClick={() => navigate("/call")} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <Phone size={18} />
          </button>
          <button id="video-call-btn" onClick={() => navigate("/call")} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <Video size={18} />
          </button>
          {isGroup && (
            <button 
              id="chat-info-btn" 
              onClick={() => setShowGroupInfo(!showGroupInfo)}
              className={`p-2 rounded-xl transition-colors ${showGroupInfo ? 'bg-primary-600/20 text-primary-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
            >
              <Info size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* ── Messages ─────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="md" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mb-3">
              <span className="text-3xl">👋</span>
            </div>
            <p className="text-slate-400 text-sm">
              Say hello to <span className="text-white font-medium">{displayName}</span>!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              onDelete={handleDelete}
              onReply={() => handleReply(msg)}
            />
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 animate-fade-in">
            <div className="bubble-received flex items-center gap-1 py-3 px-4">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

          {/* ── Message Input ────────────────────────────────────────── */}
          <MessageInput
            onSend={handleSend}
            onTyping={handleTyping}
            onStopTyping={handleStopTyping}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
          />
        </div>

        {/* Group Info Sidebar */}
        {showGroupInfo && isGroup && (
          <GroupInfoSidebar onClose={() => setShowGroupInfo(false)} />
        )}
      </div>
    </div>
  );
}
