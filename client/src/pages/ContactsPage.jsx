import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Search, MoreVertical, MessageCircle } from "lucide-react";
import Avatar from "../components/shared/Avatar";

export default function ContactsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const contacts = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", online: true, fav: true },
    { id: 2, name: "Bob Smith", email: "bob@example.com", online: false, fav: false },
    { id: 3, name: "Charlie Davis", email: "charlie@example.com", online: true, fav: true },
  ];

  return (
    <div className="min-h-screen bg-dark-900 p-6 md:p-12 animate-fade-in flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-2 bg-dark-800 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold text-white">Contacts</h1>
          </div>
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-3 text-slate-500" />
            <input type="text" placeholder="Search contacts..." value={search} onChange={(e)=>setSearch(e.target.value)} className="input-field pl-9 py-2 text-sm" />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Star size={16} className="text-accent-400" /> Favorites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {contacts.filter(c => c.fav).map(c => (
              <div key={c.id} className="glass p-4 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} online={c.online} size="md" />
                  <div>
                    <h4 className="text-white text-sm font-semibold">{c.name}</h4>
                    <p className="text-xs text-slate-400">{c.online ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
                <button className="text-primary-400 hover:text-primary-300 p-2"><MessageCircle size={18} /></button>
              </div>
            ))}
          </div>

          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">All Contacts</h2>
          <div className="space-y-2">
            {contacts.map(c => (
              <div key={c.id} className="glass p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar name={c.name} online={c.online} size="sm" />
                  <div className="w-48">
                    <h4 className="text-white text-sm font-semibold">{c.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 hidden md:block">{c.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-slate-400 hover:text-primary-400 p-2"><MessageCircle size={16} /></button>
                  <button className="text-slate-400 hover:text-white p-2"><MoreVertical size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
