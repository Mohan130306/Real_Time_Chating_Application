import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, UserPlus, MessageSquare } from "lucide-react";
import Avatar from "../components/shared/Avatar";

export default function SearchUsersPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  // Mock debounced search
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      // Mock data
      setResults([
        { _id: "1", name: "Alice Johnson", email: "alice@example.com", profilePic: "", isOnline: true },
        { _id: "2", name: "Alex Smith", email: "alex@example.com", profilePic: "", isOnline: false },
      ]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen bg-dark-900 flex justify-center p-6 md:p-12 animate-fade-in">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="p-2 bg-dark-800 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-white">Search Users</h1>
        </div>

        {/* Search Bar */}
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

        {/* Results */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-slate-500 py-8 text-sm">Searching...</div>
          ) : query && results.length === 0 ? (
            <div className="text-center text-slate-500 py-8 text-sm">No users found for "{query}"</div>
          ) : (
            results.map((user) => (
              <div key={user._id} className="glass p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar src={user.profilePic} name={user.name} online={user.isOnline} />
                  <div>
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-primary-600/20 text-primary-400 hover:bg-primary-600 hover:text-white rounded-xl transition-colors" title="Message">
                    <MessageSquare size={16} />
                  </button>
                  <button className="p-2 bg-dark-600 text-slate-300 hover:bg-primary-500 hover:text-white rounded-xl transition-colors" title="Add Friend">
                    <UserPlus size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
