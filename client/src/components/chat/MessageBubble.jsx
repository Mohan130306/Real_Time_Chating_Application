import { useDispatch, useSelector } from "react-redux";
import { formatTime } from "../../utils/helpers";
import { Check, CheckCheck, Trash2, Reply, Smile } from "lucide-react";
import { reactToMessage } from "../../redux/slices/messageSlice";
import { useState } from "react";

export default function MessageBubble({ message, onDelete, onReply }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const isMine   = message.senderId?._id === user?._id || message.senderId === user?._id;
  const [showEmojis, setShowEmojis] = useState(false);

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  const handleReact = (emoji) => {
    dispatch(reactToMessage({ messageId: message._id, emoji }));
    setShowEmojis(false);
  };

  if (message.deleted) {
    return (
      <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}>
        <span className="text-xs text-slate-600 italic px-3 py-1.5 bg-dark-600/40 rounded-xl border border-white/5">
          🗑 This message was deleted
        </span>
      </div>
    );
  }

  const reactionCounts = message.reactions?.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1 group animate-fade-in relative`}>
      
      {/* ── Action Buttons (Hover) ── */}
      <div className={`absolute top-2 ${isMine ? "-left-[84px]" : "-right-[84px]"} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10`}>
        <div className="relative">
          <button onClick={() => setShowEmojis(!showEmojis)} className="p-1.5 rounded-full bg-dark-700 hover:bg-dark-600 text-slate-400 border border-white/5 shadow-sm">
            <Smile size={12} />
          </button>
          {showEmojis && (
            <div className={`absolute top-full mt-1 ${isMine ? "right-0" : "left-0"} bg-dark-800 border border-white/10 rounded-full flex gap-1 p-1.5 shadow-xl`}>
              {emojis.map(e => (
                <button key={e} onClick={() => handleReact(e)} className="hover:scale-125 transition-transform text-lg leading-none">
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={onReply} className="p-1.5 rounded-full bg-dark-700 hover:bg-dark-600 text-slate-400 border border-white/5 shadow-sm">
          <Reply size={12} />
        </button>
        {isMine && onDelete && (
          <button onClick={() => onDelete(message._id)} className="p-1.5 rounded-full bg-dark-700 hover:bg-dark-600 text-slate-400 border border-white/5 shadow-sm">
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <div className="flex flex-col max-w-xs lg:max-w-sm">
        {/* Sender name for groups */}
        {!isMine && message.senderId?.name && (
          <span className="text-xs text-primary-400 font-medium mb-1 ml-1">
            {message.senderId.name}
          </span>
        )}

        <div className={`relative ${isMine ? "bubble-sent" : "bubble-received"}`}>
          
          {/* Reply Banner */}
          {message.replyTo && (
            <div className={`mb-2 p-2 rounded-xl text-xs border ${isMine ? "bg-white/10 border-white/20" : "bg-dark-900/40 border-white/5"}`}>
              <span className="font-semibold block mb-0.5 text-primary-300">
                {message.replyTo?.senderId?.name || "Replied message"}
              </span>
              <p className="truncate opacity-80">{message.replyTo?.text || "Media attachment"}</p>
            </div>
          )}

          {/* Media */}
          {message.media && (
            <div className="mb-2 rounded-xl overflow-hidden">
              <img
                src={message.media}
                alt="attachment"
                className="max-w-full rounded-xl object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Text */}
          {message.text && (
            <p className="text-sm leading-relaxed break-words">{message.text}</p>
          )}

          {/* Footer (Time + Seen) */}
          <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
            <span className="text-[10px] opacity-60">{formatTime(message.createdAt)}</span>
            {isMine && (
              message.seen
                ? <CheckCheck size={12} className="text-sky-300 opacity-80" />
                : <Check size={12} className="opacity-60" />
            )}
          </div>
        </div>
        
        {/* Reactions underneath bubble */}
        {Object.keys(reactionCounts).length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-0.5 ${isMine ? "justify-end mr-1" : "justify-start ml-1"}`}>
            {Object.entries(reactionCounts).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className="bg-dark-700 border border-white/10 rounded-full px-1.5 py-0.5 text-[10px] flex items-center gap-1 hover:bg-dark-600 shadow-sm"
              >
                <span>{emoji}</span> <span className="opacity-70 font-medium">{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
