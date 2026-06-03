import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, X, Image } from "lucide-react";
import { useSelector } from "react-redux";
import EmojiPicker from 'emoji-picker-react';

export default function MessageInput({ onSend, onTyping, onStopTyping, disabled, replyingTo, onCancelReply }) {
  const { sending } = useSelector((s) => s.message);
  const [text,        setText]        = useState("");
  const [preview,     setPreview]     = useState(null); // base64
  const [showEmoji,   setShowEmoji]   = useState(false);
  const typingTimer   = useRef(null);
  const isTyping      = useRef(false);
  const fileInputRef  = useRef(null);
  const textareaRef   = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  const handleChange = (e) => {
    setText(e.target.value);

    if (!isTyping.current) {
      isTyping.current = true;
      onTyping?.();
    }
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      isTyping.current = false;
      onStopTyping?.();
    }, 1500);
  };

  const handleSend = () => {
    if ((!text.trim() && !preview) || disabled || sending) return;
    onSend({ text: text.trim(), media: preview || "" });
    setText("");
    setPreview(null);
    setShowEmoji(false);
    clearTimeout(typingTimer.current);
    isTyping.current = false;
    onStopTyping?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="p-3 border-t border-white/5 bg-dark-800/80 backdrop-blur-sm">
      {/* Reply Banner */}
      {replyingTo && (
        <div className="mb-2 bg-dark-600/50 border border-white/10 rounded-xl p-2 flex justify-between items-center text-sm">
          <div className="min-w-0 overflow-hidden">
            <span className="text-primary-400 font-semibold block text-xs">Replying to {replyingTo.senderId?.name || 'Someone'}</span>
            <span className="text-slate-400 truncate block max-w-xs">{replyingTo.text || 'Media'}</span>
          </div>
          <button onClick={onCancelReply} className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Image preview */}
      {preview && (
        <div className="mb-3 relative inline-block">
          <img src={preview} alt="preview" className="h-24 rounded-xl object-cover border border-white/10" />
          <button
            onClick={() => setPreview(null)}
            className="absolute -top-2 -right-2 p-1 bg-dark-600 border border-white/10 rounded-full text-slate-400 hover:text-white"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Emoji picker */}
      {showEmoji && (
        <div className="absolute bottom-[80px] left-3 z-50 animate-slide-up shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-dark-800">
          <EmojiPicker 
            theme="dark" 
            onEmojiClick={(emojiData) => {
              setText((t) => t + emojiData.emoji);
              textareaRef.current?.focus();
            }} 
            searchDisabled={false}
            skinTonesDisabled={true}
            height={350}
            width={300}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Emoji button */}
        <button
          id="emoji-btn"
          onClick={() => setShowEmoji((v) => !v)}
          className="p-2.5 rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
        >
          <Smile size={20} />
        </button>

        {/* File attach */}
        <button
          id="attach-btn"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
        >
          <Paperclip size={20} />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            id="message-input"
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            disabled={disabled}
            rows={1}
            className="input-field resize-none py-2.5 pr-4 text-sm leading-relaxed min-h-[42px] max-h-[120px] overflow-y-auto"
          />
        </div>

        {/* Send button */}
        <button
          id="send-btn"
          onClick={handleSend}
          disabled={(!text.trim() && !preview) || disabled || sending}
          className={`p-2.5 rounded-xl flex-shrink-0 transition-all duration-200 ${
            (text.trim() || preview) && !disabled && !sending
              ? "bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-glow scale-100 active:scale-90"
              : "bg-dark-500 text-slate-600 cursor-not-allowed"
          }`}
        >
          {sending
            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Send size={20} />
          }
        </button>
      </div>
    </div>
  );
}
