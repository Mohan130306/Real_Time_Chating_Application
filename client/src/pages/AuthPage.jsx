import { useState } from "react";
import { MessageSquare } from "lucide-react";
import LoginForm    from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* ── Left Panel (branding) ─────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-dark-800 to-secondary-900/30" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow">
            <MessageSquare size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">NexChat</span>
        </div>

        {/* Center content */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold leading-tight">
              <span className="text-white">Chat in</span>
              <br />
              <span className="gradient-text">Real-Time.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Connect instantly with friends and teams. Messages delivered in milliseconds, not seconds.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {["⚡ Instant delivery", "🔒 End-to-end secure", "👥 Group chats", "📎 Media sharing"].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300">
                {f}
              </span>
            ))}
          </div>

          {/* Mock chat preview */}
          <div className="glass rounded-2xl p-4 space-y-3 max-w-xs">
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex-shrink-0" />
              <div className="bubble-received text-sm py-2 px-3">Hey! Just sent you the files 📎</div>
            </div>
            <div className="flex items-end gap-2 flex-row-reverse">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex-shrink-0" />
              <div className="bubble-sent text-sm py-2 px-3">Got them! Thanks 🙌</div>
            </div>
            <div className="flex items-center gap-1.5 pl-9">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
              <span className="text-xs text-slate-500 ml-1">Sarah is typing...</span>
            </div>
          </div>
        </div>

        <p className="relative text-slate-600 text-sm">
          © 2024 NexChat. Built with MERN + Socket.IO
        </p>
      </div>

      {/* ── Right Panel (auth forms) ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow">
              <MessageSquare size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">NexChat</span>
          </div>

          {/* Card */}
          <div className="glass rounded-3xl p-8 shadow-2xl">
            {/* Tab switcher */}
            <div className="flex bg-dark-900/60 rounded-2xl p-1 mb-8">
              <button
                id="tab-login"
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  mode === "login"
                    ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-glow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                id="tab-register"
                onClick={() => setMode("register")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  mode === "register"
                    ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-glow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                {mode === "login" ? "Welcome back 👋" : "Create account ✨"}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {mode === "login"
                  ? "Sign in to continue to NexChat"
                  : "Join thousands of users on NexChat"}
              </p>
            </div>

            {/* Form */}
            {mode === "login"
              ? <LoginForm    onSwitch={() => setMode("register")} />
              : <RegisterForm onSwitch={() => setMode("login")} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
