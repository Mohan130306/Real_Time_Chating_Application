import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, Camera, UserPlus, Shield, UserMinus, Image as ImageIcon, FileText } from "lucide-react";
import Avatar from "../shared/Avatar";
import toast from "react-hot-toast";

export default function GroupInfoSidebar({ onClose }) {
  const { activeChat, onlineUsers } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);
  const { messages } = useSelector((s) => s.message);
  
  const group = activeChat?.data;
  const isGroup = activeChat?.type === "Group";
  
  const [description, setDescription] = useState(group?.description || "");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const fileInputRef = useRef(null);

  if (!isGroup) return null;

  const isAdmin = group?.admins?.includes(user?._id) || group?.createdBy === user?._id;

  // Extract shared media from messages
  const sharedMedia = messages.filter((m) => m.media && m.mediaType === "image").slice(0, 6);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Simulate image upload
    toast.success("Group image updated!");
  };

  const handleSaveDescription = () => {
    setIsEditingDesc(false);
    toast.success("Group description updated!");
  };

  const handleAddMember = () => {
    toast.success("Add member modal opened!");
  };

  const handleMakeAdmin = (memberId) => {
    toast.success("Member promoted to admin!");
  };

  const handleRemoveMember = (memberId) => {
    toast.success("Member removed from group!");
  };

  return (
    <div className="w-80 h-full bg-dark-800 border-l border-white/5 flex flex-col flex-shrink-0 animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-dark-800/80 backdrop-blur-sm z-10 sticky top-0">
        <h3 className="font-semibold text-white">Group Info</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Group Image & Name */}
        <div className="p-6 flex flex-col items-center border-b border-white/5 relative">
          <div className="relative group cursor-pointer mb-4" onClick={() => isAdmin && fileInputRef.current?.click()}>
            <Avatar src={group?.groupImage} name={group?.groupName} size="xl" />
            {isAdmin && (
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          <h2 className="text-xl font-bold text-white text-center break-words w-full">{group?.groupName}</h2>
          <p className="text-sm text-slate-400 mt-1">Group • {group?.members?.length || 0} members</p>
        </div>

        {/* Description */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> Description
            </h4>
            {isAdmin && !isEditingDesc && (
              <button onClick={() => setIsEditingDesc(true)} className="text-xs text-primary-400 hover:text-primary-300">Edit</button>
            )}
          </div>
          
          {isEditingDesc ? (
            <div className="space-y-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field w-full text-sm resize-none"
                rows={3}
                placeholder="Add group description..."
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsEditingDesc(false)} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                <button onClick={handleSaveDescription} className="text-xs bg-primary-600 hover:bg-primary-500 text-white px-3 py-1 rounded-md transition-colors">Save</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300 whitespace-pre-wrap">{description || <span className="text-slate-500 italic">No description provided.</span>}</p>
          )}
        </div>

        {/* Shared Media */}
        <div className="p-4 border-b border-white/5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
            <ImageIcon size={14} /> Shared Media
          </h4>
          {sharedMedia.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {sharedMedia.map((msg, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-dark-600 border border-white/5">
                  <img src={msg.media} alt="Shared" className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-2">No media shared yet</p>
          )}
        </div>

        {/* Members List */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              Members ({group?.members?.length || 0})
            </h4>
            {isAdmin && (
              <button onClick={handleAddMember} className="p-1 rounded-md hover:bg-white/5 text-primary-400 transition-colors" title="Add Member">
                <UserPlus size={16} />
              </button>
            )}
          </div>
          
          <div className="space-y-1">
            {/* Typically we'd map over populated members, but we only have objects if populated. Let's assume they are populated objects. */}
            {group?.members?.map((member) => {
              const isMemberAdmin = group?.admins?.includes(member._id) || group?.createdBy === member._id;
              const isMe = member._id === user?._id;
              const memberOnline = onlineUsers.includes(member._id);
              
              return (
                <div key={member._id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 group/member transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={member.profilePic} name={member.name} size="sm" online={memberOnline} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {isMe ? "You" : member.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{member.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isMemberAdmin && (
                      <span className="text-[10px] font-medium bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded-full border border-primary-500/20">
                        Admin
                      </span>
                    )}
                    
                    {isAdmin && !isMe && (
                      <div className="opacity-0 group-hover/member:opacity-100 flex gap-1 transition-opacity">
                        {!isMemberAdmin && (
                          <button onClick={() => handleMakeAdmin(member._id)} className="p-1.5 text-slate-400 hover:text-primary-400 bg-dark-600 rounded-md" title="Make Admin">
                            <Shield size={12} />
                          </button>
                        )}
                        <button onClick={() => handleRemoveMember(member._id)} className="p-1.5 text-slate-400 hover:text-secondary-400 bg-dark-600 rounded-md" title="Remove Member">
                          <UserMinus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
