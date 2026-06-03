import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp } from "lucide-react";
import Avatar from "../components/shared/Avatar";

export default function CallPage() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const endCall = () => {
    navigate("/");
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col animate-fade-in relative overflow-hidden">
      
      {/* Main Video Area (Remote) */}
      <div className="flex-1 w-full h-full relative flex items-center justify-center">
        {/* Mock Remote Video stream (just an avatar for now) */}
        <div className="text-center animate-pulse-ring">
          <Avatar name="Alex Smith" size="2xl" />
          <h2 className="text-2xl font-semibold text-white mt-4">Alex Smith</h2>
          <p className="text-slate-400">{formatTime(duration)}</p>
        </div>
      </div>

      {/* Local Video Picture-in-Picture */}
      <div className="absolute top-6 right-6 w-48 h-64 bg-dark-800 rounded-2xl overflow-hidden border-2 border-dark-600 shadow-2xl flex items-center justify-center">
        {videoOff ? (
          <Avatar name="You" size="lg" />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs text-slate-500">Camera Active</div>
        )}
      </div>

      {/* Call Controls Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 glass px-8 py-4 rounded-full flex items-center gap-6 shadow-glow-lg">
        <button onClick={() => setMuted(!muted)} className={`p-4 rounded-full transition-all ${muted ? 'bg-secondary-500 text-white' : 'bg-dark-600 hover:bg-dark-500 text-slate-200'}`}>
          {muted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button onClick={() => setVideoOff(!videoOff)} className={`p-4 rounded-full transition-all ${videoOff ? 'bg-secondary-500 text-white' : 'bg-dark-600 hover:bg-dark-500 text-slate-200'}`}>
          {videoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>
        <button className="p-4 rounded-full bg-dark-600 hover:bg-dark-500 text-slate-200 transition-all">
          <MonitorUp size={24} />
        </button>
        <button onClick={endCall} className="p-5 rounded-full bg-secondary-600 hover:bg-secondary-500 text-white shadow-lg transition-all hover:scale-110">
          <PhoneOff size={24} />
        </button>
      </div>

    </div>
  );
}
