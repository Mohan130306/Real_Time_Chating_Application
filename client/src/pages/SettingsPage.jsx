import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Bell, Lock, Globe, Shield, UserX, ChevronRight, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState({
    darkMode: true,
    pushNotifications: true,
    emailNotifications: false,
    readReceipts: true,
    onlineStatus: true,
    language: "en",
  });

  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (!preferences.darkMode) {
      
    } else {
      
    }
  }, [preferences.darkMode]);

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success(`Theme updated!`);
    // In a real app, dispatch an action to save to MongoDB here
  };

  const handleLanguageChange = (e) => {
    setPreferences((prev) => ({ ...prev, language: e.target.value }));
    toast.success(`Language updated!`);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col md:flex-row animate-fade-in">
      {/* Sidebar for Settings */}
      <div className="w-full md:w-80 border-r border-white/5 bg-dark-800 flex-shrink-0 flex flex-col h-screen overflow-y-auto">
        <div className="p-6 border-b border-white/5 sticky top-0 bg-dark-800 z-10 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="p-2 bg-dark-600 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>
        
        <div className="p-4 space-y-1">
          <button onClick={() => setActiveTab("general")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === "general" ? "bg-primary-600/20 text-primary-400" : "hover:bg-white/5 text-slate-400"}`}>
            <Globe size={18} />
            <span className="font-medium text-sm">General</span>
            <ChevronRight size={16} className="ml-auto opacity-50" />
          </button>
          <button onClick={() => setActiveTab("notifications")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === "notifications" ? "bg-primary-600/20 text-primary-400" : "hover:bg-white/5 text-slate-400"}`}>
            <Bell size={18} />
            <span className="font-medium text-sm">Notifications</span>
            <ChevronRight size={16} className="ml-auto opacity-50" />
          </button>
          <button onClick={() => setActiveTab("privacy")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === "privacy" ? "bg-primary-600/20 text-primary-400" : "hover:bg-white/5 text-slate-400"}`}>
            <Lock size={18} />
            <span className="font-medium text-sm">Privacy & Security</span>
            <ChevronRight size={16} className="ml-auto opacity-50" />
          </button>
          <button onClick={() => setActiveTab("blocked")} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === "blocked" ? "bg-secondary-500/10 text-secondary-400" : "hover:bg-white/5 text-slate-400"}`}>
            <UserX size={18} />
            <span className="font-medium text-sm">Blocked Users</span>
            <ChevronRight size={16} className="ml-auto opacity-50" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto h-screen bg-dark-900">
        <div className="max-w-2xl mx-auto space-y-8 animate-slide-up">
          
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">General Settings</h2>
                <p className="text-slate-400 text-sm">Manage your app appearance and language preferences.</p>
              </div>
              
              <div className="glass rounded-2xl p-6 space-y-6 border border-white/5">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center text-primary-400">
                      {preferences.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Dark Mode</h4>
                      <p className="text-xs text-slate-400">Toggle dark/light theme</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={preferences.darkMode} onChange={() => handleToggle("darkMode")} />
                    <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                {/* Language Select */}
                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center text-sky-400">
                      <Globe size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Language</h4>
                      <p className="text-xs text-slate-400">Select your preferred language</p>
                    </div>
                  </div>
                  <select 
                    value={preferences.language} 
                    onChange={handleLanguageChange}
                    className="bg-dark-600 border border-white/10 text-white text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-2.5 outline-none"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Notifications</h2>
                <p className="text-slate-400 text-sm">Choose how and when you want to be notified.</p>
              </div>
              
              <div className="glass rounded-2xl p-6 space-y-6 border border-white/5">
                {/* Push Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">Push Notifications</h4>
                    <p className="text-xs text-slate-400">Receive notifications for new messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={preferences.pushNotifications} onChange={() => handleToggle("pushNotifications")} />
                    <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                {/* Email Notifications Toggle */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">Email Notifications</h4>
                    <p className="text-xs text-slate-400">Receive daily summaries via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={preferences.emailNotifications} onChange={() => handleToggle("emailNotifications")} />
                    <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Privacy & Security</h2>
                <p className="text-slate-400 text-sm">Manage who sees your activity and secure your account.</p>
              </div>
              
              <div className="glass rounded-2xl p-6 space-y-6 border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <Shield size={24} className="text-primary-400" />
                  <div>
                    <h3 className="text-white font-medium">Account Security</h3>
                    <p className="text-xs text-slate-400">Your account is secured with JWT encryption.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div>
                    <h4 className="text-sm font-medium text-white">Read Receipts</h4>
                    <p className="text-xs text-slate-400">Let others know when you've read their messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={preferences.readReceipts} onChange={() => handleToggle("readReceipts")} />
                    <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white">Online Status</h4>
                    <p className="text-xs text-slate-400">Show when you are active on NexChat</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={preferences.onlineStatus} onChange={() => handleToggle("onlineStatus")} />
                    <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Blocked Users Tab */}
          {activeTab === "blocked" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Blocked Users</h2>
                <p className="text-slate-400 text-sm">Manage contacts you've blocked.</p>
              </div>
              
              <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-dark-600/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-bold">JD</div>
                    <div>
                      <p className="text-sm font-medium text-white">John Doe</p>
                      <p className="text-[10px] text-slate-400">Blocked on May 12, 2026</p>
                    </div>
                  </div>
                  <button onClick={() => toast.success("User unblocked")} className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-white transition-colors">
                    Unblock
                  </button>
                </div>
                <div className="p-8 text-center text-slate-500 text-sm">
                  No other blocked users.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
