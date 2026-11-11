import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: "#09090b",
        cardDark: "#141417",
        borderDark: "#27272a",
        volt: "#d4ff00",
        crimson: "#ff334b",
      },
      fontFamily: {
        space: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      letterSpacing: {
        widestx: "0.25em",
      },
    },
  },
  plugins: [],
};
export default config;
