import { useNavigate } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-dark-900 flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-md">
        <div className="w-24 h-24 bg-dark-800 rounded-3xl flex items-center justify-center mx-auto shadow-glow border border-white/10 animate-bounce">
          <AlertCircle size={48} className="text-secondary-500" />
        </div>
        
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        
        <p className="text-slate-400 text-sm leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Check the URL or navigate back to the safe zone.
        </p>

        <button 
          onClick={() => navigate("/")}
          className="btn-primary inline-flex items-center gap-2 mt-4"
        >
          <Home size={18} /> Back to Homepage
        </button>
      </div>
      
    </div>
  );
}
