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
          DEFAULT: "var(--primary)",
          lighter: "var(--primary-lighter)",
          light: "var(--primary-light)",
          "light-hover": "var(--primary-light-hover)",
          "light-active": "var(--primary-light-active)",
          hover: "var(--primary-hover)",
          active: "var(--primary-active)",
          dark: "var(--primary-dark)",
          "dark-hover": "var(--primary-dark-hover)",
          "dark-active": "var(--primary-dark-active)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          lighter: "var(--secondary-lighter)",
          light: "var(--secondary-light)",
          "light-hover": "var(--secondary-light-hover)",
          "light-active": "var(--secondary-light-active)",
          hover: "var(--secondary-hover)",
          active: "var(--secondary-active)",
          dark: "var(--secondary-dark)",
          "dark-hover": "var(--secondary-dark-hover)",
          "dark-active": "var(--secondary-dark-active)",
        },
        analogous: {
          DEFAULT: "var(--analogous)",
          lighter: "var(--analogous-lighter)",
          light: "var(--analogous-light)",
          "light-hover": "var(--analogous-light-hover)",
          "light-active": "var(--analogous-light-active)",
          hover: "var(--analogous-hover)",
          active: "var(--analogous-active)",
          dark: "var(--analogous-dark)",
          "dark-hover": "var(--analogous-dark-hover)",
          "dark-active": "var(--analogous-dark-active)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        neutral: {
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          900: "var(--neutral-900)",
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