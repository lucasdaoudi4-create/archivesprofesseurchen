/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pokeball: {
          red: "#ee1515",
          dark: "#1a1a1a",
          white: "#fafafa",
          shadow: "#222224",
        },
        pikachu: {
          yellow: "#ffcb05",
          dark: "#3d7dca",
        },
        lab: {
          50: "#f7f7fb",
          100: "#eef0f7",
          200: "#dde1ec",
          300: "#c0c6d8",
          400: "#9aa2bd",
          500: "#7a85a4",
          600: "#5c6783",
          700: "#454e66",
          800: "#2e3548",
          900: "#181c2a",
          950: "#0c0e18",
        },
        accent: {
          electric: "#facc15",
          fire: "#f97316",
          water: "#3b82f6",
          grass: "#22c55e",
          psychic: "#ec4899",
        },
      },
      fontFamily: {
        display: ['"Russo One"', "Impact", "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        pokeball: "0 10px 30px -10px rgba(238, 21, 21, 0.5)",
        glow: "0 0 40px rgba(255, 203, 5, 0.4)",
        cardhover: "0 25px 60px -20px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "pokeball-pattern":
          "radial-gradient(circle at 20% 20%, rgba(238,21,21,0.08) 0, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,203,5,0.08) 0, transparent 40%)",
        "lab-grid":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        spin_slow: "spin 12s linear infinite",
        shine: "shine 3s linear infinite",
        ping_slow: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};
