import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class", "dark"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        alan: ['var(--font-alan)'],
        omnes: ['var(--font-omnes)'],
      },
      colors: {
        primary: {
          DEFAULT: "#3373cc",
          lighter: "#a3c0e8",
          light: "#91b3e3",
          "light-hover": "#91b3e3",
          "light-active": "#7aa4de",
          hover: "#2b62ad",
          active: "#255495",
          dark: "#122847",
          "dark-hover": "#0d1d33",
          "dark-active": "#060d16",
        },
        secondary: {
          DEFAULT: "#92f189",
          lighter: "#cef9ca",
          light: "#c4f7bf",
          "light-hover": "#c4f7bf",
          "light-active": "#b8f6b2",
          hover: "#7ccd74",
          active: "#6bb064",
          dark: "#335430",
          "dark-hover": "#253c22",
          "dark-active": "#101b0f",
        },
        analogous: {
          DEFAULT: "#68d5ff",
          lighter: "#bbecff",
          light: "#ade8ff",
          "light-hover": "#ade8ff",
          "light-active": "#9de4ff",
          hover: "#58b5d9",
          active: "#4c9bba",
          dark: "#244b59",
          "dark-hover": "#1a3540",
          "dark-active": "#0b171c",
        },
        success: "#95b548",
        warning: "#d78f26",
        error: "#c43535",
        neutral: {
          50: "#e6e6e8",
          100: "#b0b0b8",
          200: "#8a8a96",
          300: "#545466",
          400: "#333349",
          500: "#00001b",
          600: "#000019",
          700: "#000013",
          800: "#00000f",
          900: "#00000b",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;