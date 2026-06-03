import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, KeyRound, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  // Timer for OTP
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    // Simulate sending OTP
    toast.success("OTP sent to your email!");
    setStep(2);
    setTimeLeft(120);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.length < 4) return toast.error("Please enter a valid OTP");
    // Simulate OTP verification
    toast.success("OTP verified successfully");
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    // Simulate password reset
    toast.success("Password reset successfully!");
    setStep(4);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <KeyRound size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Reset Password"}
              {step === 4 && "All Done!"}
            </h1>
            <p className="text-slate-400 text-sm">
              {step === 1 && "Enter your email address to receive a verification code."}
              {step === 2 && `We sent a code to ${email}`}
              {step === 3 && "Enter your new password below."}
              {step === 4 && "Your password has been reset successfully."}
            </p>
          </div>

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6 animate-slide-in">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-base">Send Verification Code</button>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6 animate-slide-in">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Enter OTP</label>
                  <span className={`text-xs font-medium ${timeLeft < 30 ? 'text-secondary-400' : 'text-slate-400'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="relative flex justify-center gap-3">
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="input-field text-center text-xl tracking-widest font-mono"
                    required
                  />
                </div>
              </div>
              
              <button type="submit" disabled={timeLeft === 0} className="btn-primary w-full py-3 text-base">
                Verify OTP
              </button>
              
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={handleSendOTP}
                  disabled={timeLeft > 0}
                  className={`text-sm font-medium ${timeLeft > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-primary-400 hover:text-primary-300 transition-colors'}`}
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-slide-in">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="input-field pl-11 pr-11"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={`input-field pl-11 pr-11 ${confirmPassword && password !== confirmPassword ? 'border-secondary-500' : ''}`}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-base mt-2">Reset Password</button>
            </form>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="text-center animate-slide-in">
              <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-primary-400" />
              </div>
              <Link to="/auth" className="btn-primary inline-flex items-center justify-center w-full py-3 text-base">
                Back to Login
              </Link>
            </div>
          )}

        </div>
        
        {/* Back link */}
        {step !== 4 && (
          <div className="mt-8 text-center">
            <Link to="/auth" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
