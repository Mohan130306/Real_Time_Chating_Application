import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Video, File, Download, Search } from "lucide-react";

export default function MediaGalleryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const mediaFiles = [
    { id: 1, type: "image", url: "https://images.unsplash.com/photo-1506744269153-f06a19f074be?w=500", name: "nature.jpg" },
    { id: 2, type: "image", url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500", name: "scenery.png" },
    { id: 3, type: "video", url: "", name: "demo_record.mp4" },
    { id: 4, type: "file", url: "", name: "project_specs.pdf" },
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col p-6 md:p-12 animate-fade-in">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-2 bg-dark-800 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold text-white">Media Gallery</h1>
          </div>
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-3 text-slate-500" />
            <input type="text" placeholder="Search files..." className="input-field pl-9 py-2 text-sm" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 border-b border-white/5 pb-4 overflow-x-auto">
          {["all", "images", "videos", "files"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${filter === cat ? 'bg-primary-600 text-white' : 'bg-dark-800 text-slate-400 hover:bg-dark-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaFiles.map((file) => (
            <div key={file.id} className="glass rounded-2xl overflow-hidden group relative aspect-square flex flex-col justify-end bg-dark-800">
              {file.type === "image" ? (
                <img src={file.url} alt={file.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : file.type === "video" ? (
                <div className="absolute inset-0 flex items-center justify-center"><Video size={32} className="text-slate-500" /></div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center"><File size={32} className="text-slate-500" /></div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-xs font-medium truncate mb-2">{file.name}</p>
                <button className="bg-white/20 hover:bg-primary-600 text-white text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 backdrop-blur-sm transition-colors">
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
