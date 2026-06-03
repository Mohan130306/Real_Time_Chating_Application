/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#e0fdff",
          100: "#b3f9ff",
          200: "#80f5ff",
          300: "#4df1ff",
          400: "#26eeff",
          500: "#00f5ff", // Neon Cyan
          600: "#00c4cc",
          700: "#009399",
          800: "#006266",
          900: "#003133",
        },
        secondary: {
          50:  "#ffe0ff",
          100: "#ffb3ff",
          200: "#ff80ff",
          300: "#ff4dff",
          400: "#ff26ff",
          500: "#ff00ff", // Neon Pink
          600: "#cc00cc",
          700: "#990099",
          800: "#660066",
          900: "#330033",
        },
        accent: {
          purple: "#8A2BE2",
          violet: "#9400D3",
          indigo: "#4B0082",
        },
        dark: {
          900: "#050505",
          800: "#0a0a0a",
          700: "#141414",
          600: "#1a1a1a",
          500: "#242424",
          400: "#2e2e2e",
          300: "#383838",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":    "fadeIn 0.3s ease-in-out",
        "slide-up":   "slideUp 0.3s ease-out",
        "slide-in":   "slideIn 0.3s ease-out",
        "bounce-dot": "bounceDot 1.4s infinite ease-in-out both",
        "pulse-ring": "pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        "glitch":     "glitch 2s linear infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        slideIn:   { from: { opacity: 0, transform: "translateX(-20px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        bounceDot: { "0%, 80%, 100%": { transform: "scale(0)" }, "40%": { transform: "scale(1)", filter: "drop-shadow(0 0 5px #00F5FF)" } },
        pulseRing: { "0%": { transform: "scale(0.8)", opacity: 0.5 }, "80%, 100%": { opacity: 0, transform: "scale(1.5)" } },
      },
      boxShadow: {
        "neon-cyan": "0 0 10px rgba(0, 245, 255, 0.5), 0 0 20px rgba(0, 245, 255, 0.3)",
        "neon-pink": "0 0 10px rgba(255, 0, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.3)",
        "neon-purple": "0 0 10px rgba(138, 43, 226, 0.5), 0 0 20px rgba(138, 43, 226, 0.3)",
        "glass": "0 4px 30px rgba(0, 0, 0, 0.5)",
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
