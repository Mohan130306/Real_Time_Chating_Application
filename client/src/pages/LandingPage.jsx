import { Link } from "react-router-dom";
import { MessageSquare, Zap, Lock, Users, Bell, FileImage } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Zap size={24} className="text-accent-400" />,
      title: "Real-Time Messaging",
      desc: "Experience zero-latency communication. Messages are delivered in milliseconds across the globe."
    },
    {
      icon: <Users size={24} className="text-primary-400" />,
      title: "Group Chats",
      desc: "Create groups for your teams or friends. Manage members, admins, and collaborate seamlessly."
    },
    {
      icon: <Lock size={24} className="text-primary-400" />,
      title: "Top-Tier Security",
      desc: "Your data is protected with industry-standard encryption, secure JWT authentication, and privacy controls."
    },
    {
      icon: <Bell size={24} className="text-secondary-400" />,
      title: "Smart Notifications",
      desc: "Never miss a beat with unread message badges, instant toast notifications, and typing indicators."
    },
    {
      icon: <FileImage size={24} className="text-sky-400" />,
      title: "Media Sharing",
      desc: "Share images effortlessly. Built-in image preview and cloud storage powered by Cloudinary."
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-slate-200 font-sans selection:bg-primary-500/30 overflow-x-hidden">
      
      {/* ─── Animated Background Effects ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/10 blur-[120px] animate-pulse-ring"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-600/10 blur-[120px] animate-pulse-ring" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* ─── Navigation Bar ─── */}
      <nav className="relative z-10 border-b border-white/5 bg-dark-900/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow">
              <MessageSquare size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">NexChat</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/auth" className="btn-primary text-sm px-6 py-2.5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-primary-300 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            v1.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Connect the world in <br className="hidden md:block" />
            <span className="gradient-text">Real-Time.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The next-generation messaging platform built for speed and reliability. 
            Experience instant communication, seamless group collaboration, and rich media sharing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth" className="btn-primary text-base px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-2">
              Start Chatting for Free
            </Link>
            <a href="#features" className="btn-ghost text-base px-8 py-4 w-full sm:w-auto">
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Image / Mockup Preview */}
        <div className="max-w-5xl mx-auto mt-20 relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent z-10"></div>
          <div className="glass rounded-t-2xl md:rounded-3xl border-b-0 p-2 md:p-4 shadow-2xl">
            <div className="bg-dark-800 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 shadow-inner">
              <div className="h-8 bg-dark-700/50 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-accent-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-primary-500/80"></div>
              </div>
              <div className="aspect-[16/9] md:aspect-[21/9] bg-dark-900 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Mock Chat UI */}
                <div className="w-full max-w-md mx-auto space-y-4">
                  <div className="flex items-end gap-3 opacity-80">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex-shrink-0"></div>
                    <div className="bg-dark-600 rounded-2xl rounded-bl-sm p-3 text-sm text-slate-200">
                      Hey team! Are we still on for the 3PM sync?
                    </div>
                  </div>
                  <div className="flex items-end gap-3 flex-row-reverse opacity-90">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex-shrink-0"></div>
                    <div className="bg-primary-600 rounded-2xl rounded-br-sm p-3 text-sm text-white shadow-glow">
                      Yes! I'll share the new designs there. 🎨
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-11 pt-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{animationDelay: "0.1s"}}></div>
                      <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    </div>
                    <span className="text-xs text-slate-500">Alex is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="relative z-10 py-24 bg-dark-800/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to connect</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              NexChat brings together the best messaging features in one beautifully designed, lightning-fast application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="glass p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-dark-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-10 md:p-16 text-center border border-primary-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Ready to start chatting?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto relative z-10">
            Join NexChat today and experience the future of real-time communication. It takes less than a minute to sign up.
          </p>
          <Link to="/auth" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 relative z-10">
            Create Free Account <Zap size={18} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-white/5 bg-dark-900 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
              <MessageSquare size={14} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">NexChat</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center mt-12 text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} NexChat. All rights reserved. Built with MERN Stack.
        </div>
      </footer>
    </div>
  );
}
