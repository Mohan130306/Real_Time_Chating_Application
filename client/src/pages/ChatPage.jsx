import { useSelector } from "react-redux";
import Sidebar    from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function ChatPage() {
  const { activeChat } = useSelector((s) => s.chat);

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden relative">
      {/* Sidebar - hidden on mobile when a chat is open */}
      <div className={`h-full ${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-shrink-0 border-r border-white/5`}>
        <Sidebar />
      </div>

      {/* ChatWindow - hidden on mobile when NO chat is open */}
      <div className={`flex-1 h-full min-w-0 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        <ChatWindow />
      </div>
    </div>
  );
}
