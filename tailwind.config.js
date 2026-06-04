/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Charte — Les Archives du Professeur Chen (Édition 2026)
        // Encre : near-black chaud, texte principal & sections sombres
        encre: {
          DEFAULT: "#16130D",
          950: "#16130D",
          900: "#1E1A12",
          800: "#29231A",
          700: "#3A3328",
          600: "#544A3A",
          500: "#6B5E47",
          400: "#8A7C63",
          300: "#B6A782",
        },
        // Surfaces claires
        creme: "#FAF4E7",
        parchemin: {
          DEFAULT: "#F0E6CC",
          600: "#E4D8BD", // hairlines / bordures chaudes
          700: "#D8C9A6",
        },
        // Accent primaire — Rouge Sceau
        rouge: {
          DEFAULT: "#C73B2B",
          700: "#A02E20",
          600: "#B33324",
          500: "#C73B2B",
          400: "#D75B4C",
          50: "#FAEBE8",
        },
        // Accent secondaire — Vert Herbier (pont avec CMAY)
        vert: {
          DEFAULT: "#5E7A48",
          700: "#4A6238",
          600: "#547040",
          400: "#7C9764",
          50: "#EDF1E7",
        },
        // Accent tertiaire — Laiton
        laiton: {
          DEFAULT: "#C2922F",
          700: "#9E7623",
          600: "#B0832A",
          400: "#D4AB55",
          50: "#F8F0DD",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"DM Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Échelle typographique de la charte (px / line-height)
        display: ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800" }],
        h1: ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["1.875rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "700" }],
      },
      letterSpacing: {
        label: "0.22em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,19,13,0.04), 0 14px 34px -22px rgba(58,42,24,0.30)",
        lift: "0 22px 48px -24px rgba(22,19,13,0.40)",
        seal: "0 14px 34px -14px rgba(199,59,43,0.40)",
        inset: "inset 0 0 0 1px rgba(22,19,13,0.06)",
      },
      borderColor: {
        hair: "rgba(22,19,13,0.12)",
      },
      backgroundImage: {
        // Dégradé parchemin très doux pour les fonds clairs
        "creme-veil":
          "radial-gradient(120% 80% at 50% -10%, rgba(194,146,47,0.07) 0, transparent 55%), radial-gradient(90% 70% at 100% 0%, rgba(199,59,43,0.05) 0, transparent 50%)",
      },
      animation: {
        "spin-slow": "spin 22s linear infinite",
        "float-slow": "float 7s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
