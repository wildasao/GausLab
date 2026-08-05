import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        navy: {
          50: "#F1F4FA",
          100: "#DCE3F1",
          200: "#B5C3E1",
          300: "#8296C7",
          400: "#4C67A2",
          500: "#243F7B",
          600: "#152C5E",
          700: "#0B1E3F",
          800: "#08172F",
          900: "#050E1F",
        },
        sky: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        },
        orange: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        ink: "#0B1E3F",
        mist: "#F6F9FE",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,30,63,0.04), 0 8px 24px -12px rgba(11,30,63,0.12)",
        lift: "0 10px 30px -12px rgba(11,30,63,0.25)",
        ring: "0 0 0 4px rgba(14,165,233,0.15)",
      },
      backgroundImage: {
        "grid-navy":
          "linear-gradient(rgba(11,30,63,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(11,30,63,0.06) 1px, transparent 1px)",
        "radial-sky":
          "radial-gradient(1200px 500px at 50% -10%, rgba(14,165,233,0.18), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 400ms ease-out both",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
