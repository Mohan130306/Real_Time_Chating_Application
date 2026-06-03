/**
 * Format a date to a short time string: "2:34 PM"
 */
export const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/**
 * Format a date to relative time: "just now", "5m", "2h", "Mon", "Jan 5"
 */
export const formatDistanceToNow = (date) => {
  if (!date) return "";
  const now  = Date.now();
  const diff = now - new Date(date).getTime();
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(secs / 60);
  const hrs  = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (secs < 60)  return "now";
  if (mins < 60)  return `${mins}m`;
  if (hrs < 24)   return `${hrs}h`;
  if (days < 7)   return new Date(date).toLocaleDateString([], { weekday: "short" });
  return new Date(date).toLocaleDateString([], { month: "short", day: "numeric" });
};

/**
 * Truncate text to maxLen characters
 */
export const truncate = (text = "", maxLen = 50) =>
  text.length > maxLen ? text.slice(0, maxLen) + "…" : text;

/**
 * Generate initials from a name
 */
export const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

/**
 * Format bytes to human-readable size
 */
export const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
};
