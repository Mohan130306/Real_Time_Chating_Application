import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search, Plus, Users, LogOut, Settings,
  MessageSquare, X, UserPlus, Check, Bell, Image, Shield
} from "lucide-react";
import {
  fetchChats, fetchGroups, createOrGetChat,
  createGroup, searchUsers, clearSearch,
} from "../../redux/slices/chatSlice";
import { logout } from "../../redux/slices/authSlice";
import ChatList from "./ChatList";
import Avatar   from "../shared/Avatar";
import Modal    from "../shared/Modal";
import Spinner  from "../shared/Spinner";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user }   = useSelector((s) => s.auth);
  const { searchResults, searchLoading } = useSelector((s) => s.chat);

  const [filter,        setFilter]        = useState("");
  const [searchQuery,   setSearchQuery]   = useState("");
  const [showSearch,    setShowSearch]    = useState(false);
  const [showNewGroup,  setShowNewGroup]  = useState(false);
  const [groupName,     setGroupName]     = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const searchRef = useRef(null);

  // Load chats/groups on mount
  useEffect(() => {
    dispatch(fetchChats());
    dispatch(fetchGroups());
  }, [dispatch]);

  // Search debounce
  useEffect(() => {
    if (!searchQuery.trim()) { dispatch(clearSearch()); return; }
    const t = setTimeout(() => dispatch(searchUsers(searchQuery)), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleStartChat = (userId) => {
    dispatch(createOrGetChat(userId));
    setShowSearch(false);
    setSearchQuery("");
    dispatch(clearSearch());
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedUsers.length < 2) return;
    dispatch(createGroup({ groupName, members: selectedUsers.map((u) => u._id) }));
    setShowNewGroup(false);
    setGroupName("");
    setSelectedUsers([]);
  };

  const toggleUserSelect = (u) => {
    setSelectedUsers((prev) =>
      prev.find((x) => x._id === u._id)
        ? prev.filter((x) => x._id !== u._id)
        : [...prev, u]
    );
  };

  const handleLogout = () => dispatch(logout());

  return (
    <div className="flex flex-col h-full w-full bg-dark-800 flex-shrink-0">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          {/* Logo + name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow">
              <MessageSquare size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">NexChat</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              id="new-chat-btn"
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="New Chat"
            >
              <Plus size={18} />
            </button>
            <button
              id="new-group-btn"
              onClick={() => { setShowNewGroup(true); setSearchQuery(""); setSelectedUsers([]); }}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="New Group"
            >
              <Users size={18} />
            </button>
            <button
              onClick={() => navigate("/contacts")}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Contacts"
            >
              <UserPlus size={18} />
            </button>
            <button
              onClick={() => navigate("/media")}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Media Gallery"
            >
              <Image size={18} />
            </button>
            <button
              id="notifications-btn"
              onClick={() => navigate("/notifications")}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors relative"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary-500 rounded-full border-2 border-dark-800"></span>
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Filter conversations..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field py-2 pl-9 text-sm"
          />
        </div>
      </div>

      {/* ── Chat List ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-2">
        <ChatList filter={filter} />
      </div>

      {/* ── User Footer ────────────────────────────────────────── */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-2">
          <button onClick={() => navigate("/profile")} className="flex-1 flex items-center gap-3 group">
            <Avatar src={user?.profilePic} name={user?.name || "?"} size="sm" />
            <div className="min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                {user?.name}
              </p>
              <p className="text-xs text-primary-400">● Online</p>
            </div>
          </button>
          <div className="flex gap-1">
            <button
              id="settings-btn"
              onClick={() => navigate("/settings")}
              className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors"
              title="Settings"
            >
              <Settings size={16} />
            </button>
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-secondary-500/10 text-slate-500 hover:text-secondary-400 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── New Chat Search Modal ───────────────────────────────── */}
      <Modal isOpen={showSearch} onClose={() => { setShowSearch(false); dispatch(clearSearch()); setSearchQuery(""); }} title="New Conversation">
        <div className="space-y-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="user-search-input"
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 py-2.5 text-sm"
              autoFocus
            />
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {searchLoading && <div className="flex justify-center py-4"><Spinner size="sm" /></div>}
            {!searchLoading && searchResults.map((u) => (
              <button
                key={u._id}
                onClick={() => handleStartChat(u._id)}
                className="sidebar-item group w-full"
              >
                <Avatar src={u.profilePic} name={u.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
              </button>
            ))}
            {!searchLoading && searchQuery && searchResults.length === 0 && (
              <p className="text-center text-slate-500 text-sm py-4">No users found</p>
            )}
            {!searchQuery && (
              <p className="text-center text-slate-600 text-sm py-4">Type to search users</p>
            )}
          </div>
        </div>
      </Modal>

      {/* ── New Group Modal ─────────────────────────────────────── */}
      <Modal isOpen={showNewGroup} onClose={() => setShowNewGroup(false)} title="Create Group" size="md">
        <div className="space-y-4">
          <input
            id="group-name-input"
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="input-field"
          />

          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="group-search-input"
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 py-2.5 text-sm"
            />
          </div>

          {/* Selected users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((u) => (
                <div key={u._id} className="flex items-center gap-1.5 bg-primary-600/20 border border-primary-500/30 rounded-full px-3 py-1">
                  <span className="text-xs text-primary-300">{u.name}</span>
                  <button onClick={() => toggleUserSelect(u)} className="text-primary-400 hover:text-white">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search results */}
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {searchLoading && <div className="flex justify-center py-3"><Spinner size="sm" /></div>}
            {searchResults.map((u) => {
              const selected = selectedUsers.find((x) => x._id === u._id);
              return (
                <button key={u._id} onClick={() => toggleUserSelect(u)} className="sidebar-item w-full">
                  <Avatar src={u.profilePic} name={u.name} size="sm" />
                  <div className="flex-1 text-left">
                    <p className="text-sm text-white">{u.name}</p>
                  </div>
                  {selected && <Check size={16} className="text-primary-400" />}
                </button>
              );
            })}
          </div>

          <button
            id="create-group-submit-btn"
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedUsers.length < 2}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <UserPlus size={16} />
            Create Group ({selectedUsers.length} members)
          </button>
        </div>
      </Modal>
    </div>
  );
}
