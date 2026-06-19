import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Bell, MessageSquare, Users, UserPlus, AtSign, Info, Check, Trash2 } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import {
  fetchNotifications,
  markNotificationsAsRead,
  clearNotifications,
} from "../redux/slices/notificationSlice";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const { items: notifications, loading } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      toast.success(notification.message || "New notification", { position: "top-right" });
    };

    socket.on("notification", handleNewNotification);
    return () => socket.off("notification", handleNewNotification);
  }, [socket]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    const result = await dispatch(markNotificationsAsRead());
    if (markNotificationsAsRead.fulfilled.match(result)) {
      toast.success("All notifications marked as read");
    }
  };

  const clearAll = async () => {
    const result = await dispatch(clearNotifications());
    if (clearNotifications.fulfilled.match(result)) {
      toast.success("Notifications cleared");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "message": return <MessageSquare size={16} className="text-blue-400" />;
      case "group": return <Users size={16} className="text-secondary-400" />;
      case "friend": return <UserPlus size={16} className="text-primary-400" />;
      case "mention": return <AtSign size={16} className="text-accent-400" />;
      case "system": return <Info size={16} className="text-slate-400" />;
      default: return <Bell size={16} className="text-slate-400" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "message": return "bg-blue-500/10 border-blue-500/20";
      case "group": return "bg-secondary-500/10 border-secondary-500/20";
      case "friend": return "bg-primary-500/10 border-primary-500/20";
      case "mention": return "bg-accent-500/10 border-accent-500/20";
      case "system": return "bg-slate-500/10 border-slate-500/20";
      default: return "bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex justify-center p-6 md:p-12 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-2 bg-dark-800 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-secondary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={markAllAsRead} className="p-2 rounded-xl bg-dark-800 hover:bg-white/5 text-slate-400 hover:text-primary-400 transition-colors" title="Mark all as read">
              <Check size={18} />
            </button>
            <button onClick={clearAll} className="p-2 rounded-xl bg-dark-800 hover:bg-white/5 text-slate-400 hover:text-secondary-400 transition-colors" title="Clear all">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-slate-500 py-8 text-sm">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center border border-white/5">
              <div className="w-16 h-16 bg-dark-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell size={24} className="text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">You're all caught up!</h3>
              <p className="text-slate-400 text-sm">No new notifications at the moment.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`glass p-4 rounded-2xl border transition-all cursor-pointer hover:bg-white/5 flex gap-4 items-start ${!notif.read ? "border-primary-500/30 bg-primary-500/5" : "border-white/5"}`}
              >
                <div className={`p-3 rounded-xl border flex-shrink-0 ${getBgColor(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-semibold ${!notif.read ? "text-white" : "text-slate-300"}`}>
                      {notif.message}
                    </h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{new Date(notif.createdAt).toLocaleString()}</span>
                  </div>
                  <p className={`text-sm ${!notif.read ? "text-slate-300" : "text-slate-500"}`}>
                    {notif.sender?.name ? `From ${notif.sender.name}` : notif.type}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
