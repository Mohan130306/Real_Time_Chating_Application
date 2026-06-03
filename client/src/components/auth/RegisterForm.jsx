import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Mail, Lock, User, Zap, Camera } from "lucide-react";
import { register, clearError } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

export default function RegisterForm({ onSwitch }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", profilePic: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setForm((f) => ({ ...f, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return toast.error("Invalid email format");

    dispatch(register({ name: form.name, email: form.email, password: form.password, profilePic: form.profilePic }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      {/* Profile Picture Upload */}
      <div className="flex justify-center mb-4">
        <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
          <div className={`w-20 h-20 rounded-full border-2 border-dashed ${preview ? 'border-primary-500' : 'border-slate-500'} flex items-center justify-center overflow-hidden bg-dark-600 group-hover:bg-dark-500 transition-colors`}>
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera size={24} className="text-slate-400 group-hover:text-primary-400" />
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
      </div>
      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="register-name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field pl-10"
            required
            autoComplete="name"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="register-email"
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
            id="register-password"
            type={showPass ? "text" : "password"}
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field pl-10 pr-11"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {/* Password strength */}
        <div className="flex gap-1 mt-1">
          {[1,2,3].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                form.password.length >= i * 4
                  ? i === 1 ? "bg-secondary-500" : i === 2 ? "bg-accent-500" : "bg-primary-500"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Confirm Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="register-confirm-password"
            type={showConfirmPass ? "text" : "password"}
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className={`input-field pl-10 pr-11 ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-secondary-500/50 focus:border-secondary-500/50' : ''}`}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {form.confirmPassword && form.password !== form.confirmPassword && (
          <p className="text-xs text-secondary-400 mt-1">Passwords do not match</p>
        )}
      </div>

      <button
        id="register-submit-btn"
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <><Zap size={16} /> Create Account</>
        )}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
