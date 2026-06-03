import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../redux/slices/authSlice";
import Avatar from "../components/shared/Avatar";
import { ArrowLeft, Camera, Save, User, Mail, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user, loading } = useSelector((s) => s.auth);

  const [form, setForm]   = useState({ name: user?.name || "", bio: user?.bio || "", profilePic: user?.profilePic || "" });
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [showPassSection, setShowPassSection] = useState(false);
  const [preview, setPreview] = useState(user?.profilePic || "");
  const fileRef = useRef(null);

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

  const handleSave = async () => {
    if (showPassSection) {
      if (passForm.newPassword.length < 6) return toast.error("New password must be at least 6 characters.");
      if (passForm.newPassword !== passForm.confirmNewPassword) return toast.error("New passwords do not match.");
      if (!passForm.currentPassword) return toast.error("Current password is required to set a new password.");
    }
    
    // We send form data, and if passForm has values, we merge them
    const updateData = {
      ...form,
      ...(showPassSection && passForm.newPassword ? passForm : {})
    };

    const result = await dispatch(updateProfile(updateData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully!");
      setPassForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setShowPassSection(false);
    } else {
      toast.error(result.payload || "Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 animate-slide-up">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to chats</span>
        </button>

        {/* Card */}
        <div className="glass rounded-3xl p-8 space-y-6">
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>

          {/* Avatar upload */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar src={preview} name={form.name || "?"} size="2xl" />
              <button
                id="upload-avatar-btn"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full shadow-glow hover:bg-primary-500 transition-colors"
              >
                <Camera size={14} className="text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User size={12} /> Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={12} /> Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="input-field opacity-50 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={12} /> Bio
              </label>
              <textarea
                id="profile-bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="input-field resize-none"
                placeholder="Tell something about yourself..."
                rows={3}
                maxLength={150}
              />
              <p className="text-xs text-slate-600 text-right">{form.bio.length}/150</p>
            </div>
            
            {/* Change Password Toggle */}
            <div className="pt-2 border-t border-white/5">
              <button 
                onClick={() => setShowPassSection(!showPassSection)} 
                className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                {showPassSection ? "- Cancel Password Change" : "+ Change Password"}
              </button>
              
              {showPassSection && (
                <div className="mt-4 space-y-4 animate-slide-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Password</label>
                    <input
                      type="password"
                      value={passForm.currentPassword}
                      onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                      className="input-field"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">New Password</label>
                    <input
                      type="password"
                      value={passForm.newPassword}
                      onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                      className="input-field"
                      placeholder="Min. 6 characters"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                    <input
                      type="password"
                      value={passForm.confirmNewPassword}
                      onChange={(e) => setPassForm({ ...passForm, confirmNewPassword: e.target.value })}
                      className={`input-field ${passForm.confirmNewPassword && passForm.newPassword !== passForm.confirmNewPassword ? 'border-secondary-500' : ''}`}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            id="save-profile-btn"
            onClick={handleSave}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Save size={16} /> Save Changes</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
