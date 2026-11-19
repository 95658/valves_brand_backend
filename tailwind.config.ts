import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    borderRadius: {
      none: "0px",
      DEFAULT: "0px",
      sm: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "0px",
    },
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          elevated: "var(--bg-elevated)",
        },
        ink: {
          primary: "var(--ink-primary)",
          secondary: "var(--ink-secondary)",
        },
        border: {
          hairline: "var(--border-hairline)",
        },
        accent: "var(--accent)",
        status: {
          success: "var(--status-success)",
          danger: "var(--status-danger)",
        },
      },
      fontFamily: {
        heading: ["'Syne'", "'Space Grotesk'", "sans-serif"],
        syne: ["'Syne'", "sans-serif"],
        space: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        arabic: ["'IBM Plex Sans Arabic'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      letterSpacing: {
        widestx: "0.25em",
      },
    },
  },
  plugins: [],
};
export default config;
