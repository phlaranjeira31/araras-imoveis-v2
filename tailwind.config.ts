// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        leaf: "rgb(var(--leaf) / <alpha-value>)",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 8, 23, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;





