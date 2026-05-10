import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./actions/**/*.{ts,tsx}",
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
        "2xl": "1180px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-noto-serif)", "Noto Serif", "serif"],
        devanagari: ["var(--font-devanagari)", "Noto Sans Devanagari", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 70px -45px rgba(31, 41, 55, 0.45)",
        calm: "0 24px 80px -58px rgba(31, 41, 55, 0.56)",
        glow: "0 18px 70px -48px rgba(244, 180, 0, 0.72)",
        "inner-calm": "inset 0 1px 0 rgba(255, 255, 255, 0.45)",
      },
      transitionTimingFunction: {
        premium: "var(--ease-premium)",
        soft: "var(--ease-soft)",
      },
      backgroundImage: {
        "wisdom-radial":
          "radial-gradient(circle at 30% 20%, rgba(244, 180, 0, 0.1), transparent 34%), radial-gradient(circle at 78% 8%, rgba(230, 57, 70, 0.045), transparent 24%)",
        "wisdom-layered":
          "radial-gradient(circle at 22% 12%, rgba(244, 180, 0, 0.07), transparent 28rem), radial-gradient(circle at 82% 22%, rgba(230, 57, 70, 0.03), transparent 24rem), linear-gradient(180deg, hsl(var(--background)), hsl(var(--card) / 0.76))",
      },
    },
  },
  plugins: [typography],
};

export default config;
