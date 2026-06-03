export default function Avatar({ src, name = "?", size = "md", online = false, className = "" }) {
  const sizes = {
    xs:  "w-7 h-7 text-xs",
    sm:  "w-8 h-8 text-xs",
    md:  "w-10 h-10 text-sm",
    lg:  "w-12 h-12 text-base",
    xl:  "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Generate a deterministic gradient from name
  const colors = [
    "from-primary-500 to-secondary-500",
    "from-primary-500 to-secondary-500",
    "from-secondary-500 to-pink-500",
    "from-accent-500 to-orange-500",
    "from-cyan-500 to-blue-500",
    "from-fuchsia-500 to-purple-500",
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} avatar object-cover`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-gradient-to-br ${colors[colorIndex]}
            flex items-center justify-center font-semibold text-white select-none`}
        >
          {initials}
        </div>
      )}
      {online && (
        <span className="online-dot" />
      )}
    </div>
  );
}
