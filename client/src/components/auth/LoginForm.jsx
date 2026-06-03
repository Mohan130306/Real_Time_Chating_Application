import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { login, clearError } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

export default function LoginForm({ onSwitch }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="login-email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field pl-10"
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="login-password"
            type={showPass ? "text" : "password"}
            placeholder="Your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field pl-10 pr-11"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Remember me & Forgot Password */}
      <div className="flex items-center justify-between mt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-dark-600 text-primary-500 focus:ring-primary-500/50 cursor-pointer" />
          <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors">
          Forgot password?
        </Link>
      </div>

      <button
        id="login-submit-btn"
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <><LogIn size={16} /> Sign In</>
        )}
      </button>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          Create one
        </button>
      </p>
    </form>
  );
}
