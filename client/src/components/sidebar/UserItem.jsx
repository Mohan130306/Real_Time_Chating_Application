import { useSelector } from "react-redux";
import Avatar from "../shared/Avatar";
import { formatDistanceToNow } from "../../utils/helpers";

export default function UserItem({ chat, type = "Chat", onClick, active }) {
  const { user } = useSelector((s) => s.auth);
  const { onlineUsers } = useSelector((s) => s.chat);

  // Resolve display info
  let name, pic, lastMsg, isOnline;

  if (type === "Chat") {
    const other = chat.participants?.find((p) => p._id !== user?._id);
    name     = other?.name || "Unknown";
    pic      = other?.profilePic;
    isOnline = onlineUsers.includes(other?._id);
  } else {
    name     = chat.groupName;
    pic      = chat.groupImage;
    isOnline = false;
  }

  const lastMessage = chat.lastMessage;
  const unread      = chat.unreadCount || 0;

  const lastText = lastMessage
    ? lastMessage.media
      ? "📎 Media"
      : lastMessage.text?.length > 35
      ? lastMessage.text.slice(0, 35) + "…"
      : lastMessage.text || ""
    : "No messages yet";

  const lastTime = lastMessage?.createdAt
    ? formatDistanceToNow(lastMessage.createdAt)
    : "";

  return (
    <button
      onClick={onClick}
      className={`sidebar-item group w-full text-left ${active ? "sidebar-item-active" : ""}`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar
          src={pic}
          name={name}
          size="md"
          online={isOnline}
        />
        {type === "Group" && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-secondary-600 rounded-full flex items-center justify-center text-[8px] text-white border border-dark-800">
            G
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-medium text-sm text-white truncate">{name}</span>
          <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{lastTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 truncate pr-2">{lastText}</p>
          {unread > 0 && (
            <span className="flex-shrink-0 min-w-[18px] h-[18px] bg-primary-600 rounded-full text-[10px] text-white flex items-center justify-center px-1 font-medium">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
