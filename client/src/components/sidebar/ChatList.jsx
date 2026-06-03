import { useDispatch, useSelector } from "react-redux";
import { setActiveChat, clearUnread } from "../../redux/slices/chatSlice";
import { clearMessages } from "../../redux/slices/messageSlice";
import UserItem from "./UserItem";
import Spinner from "../shared/Spinner";

export default function ChatList({ filter }) {
  const dispatch = useDispatch();
  const { chats, groups, activeChat, loading } = useSelector((s) => s.chat);

  const combined = [
    ...chats.map((c)  => ({ ...c, _type: "Chat" })),
    ...groups.map((g) => ({ ...g, _type: "Group" })),
  ].sort((a, b) => {
    const aTime = a.lastMessage?.createdAt || a.updatedAt || a.createdAt;
    const bTime = b.lastMessage?.createdAt || b.updatedAt || b.createdAt;
    return new Date(bTime) - new Date(aTime);
  });

  const filtered = filter
    ? combined.filter((c) => {
        const name = c._type === "Chat"
          ? (c.participants?.find((p) => p._id !== activeChat?.data?.participants?.[0]?._id)?.name || "")
          : c.groupName;
        return name.toLowerCase().includes(filter.toLowerCase());
      })
    : combined;

  const handleSelect = (item) => {
    dispatch(clearMessages());
    dispatch(setActiveChat({ id: item._id, type: item._type, data: item }));
    dispatch(clearUnread({ chatId: item._id, type: item._type }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="md" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-dark-500 flex items-center justify-center mb-4">
          <span className="text-3xl">💬</span>
        </div>
        <p className="text-slate-400 text-sm">
          {filter ? "No results found" : "No conversations yet"}
        </p>
        <p className="text-slate-600 text-xs mt-1">
          {filter ? "Try a different name" : "Search for someone to start chatting"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 px-2">
      {filtered.map((item) => (
        <UserItem
          key={item._id}
          chat={item}
          type={item._type}
          active={activeChat?.id === item._id}
          onClick={() => handleSelect(item)}
        />
      ))}
    </div>
  );
}
