export default function Spinner({ fullscreen = false, size = "md" }) {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };

  const spinner = (
    <div className={`${sizes[size]} relative`}>
      <div className={`${sizes[size]} rounded-full border-2 border-white/10 border-t-primary-500 animate-spin`} />
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-white/10 border-t-primary-500 animate-spin" />
          <p className="text-slate-400 text-sm animate-pulse">Loading NexChat...</p>
        </div>
      </div>
    );
  }

  return spinner;
}
