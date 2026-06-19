import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MessageSquare } from "lucide-react";
import Avatar from "../components/shared/Avatar";
import { searchUsers, createOrGetChat, clearSearch } from "../redux/slices/chatSlice";

export default function SearchUsersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults, searchLoading } = useSelector((state) => state.chat);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearSearch());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(searchUsers(query.trim()));
    }, 400);
    return () => clearTimeout(timer);
  }, [query, dispatch]);

  const handleOpenChat = async (user) => {
    const result = await dispatch(createOrGetChat(user._id));
    if (createOrGetChat.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex justify-center p-6 md:p-12 animate-fade-in">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="p-2 bg-dark-800 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-white">Search Users</h1>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field pl-11 py-3 text-sm w-full"
          />
        </div>

        <div className="space-y-3">
          {searchLoading ? (
            <div className="text-center text-slate-500 py-8 text-sm">Searching...</div>
          ) : query.trim() && searchResults.length === 0 ? (
            <div className="text-center text-slate-500 py-8 text-sm">No users found for "{query}"</div>
          ) : (
            searchResults.map((user) => (
              <button
                key={user._id}
                onClick={() => handleOpenChat(user)}
                className="glass p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <Avatar src={user.profilePic} name={user.name} online={user.isOnline} />
                  <div>
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <MessageSquare size={16} className="text-primary-400" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
