/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          green: "#22C55E",
          greenDark: "#16A34A",
          blue: "#38BDF8",
          blueDark: "#0EA5E9",
          bg: "#F8FAFC",
          ink: "#0F172A",
          muted: "#64748B",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(15, 23, 42, 0.12)",
        card: "0 4px 20px -4px rgba(15, 23, 42, 0.08)",
        glow: "0 20px 60px -20px rgba(34, 197, 94, 0.45)",
      },
      borderRadius: { "4xl": "2rem" },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s ease-out both",
        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
};
