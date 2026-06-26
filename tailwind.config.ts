import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07142d",
        "ink-soft": "#183154",
        gold: "#d7a12b",
        "gold-soft": "#f4d481",
        mist: "#f8fafc",
        civic: "#0e4d92",
        fern: "#2f6f5e"
      },
      boxShadow: {
        glow: "0 24px 70px rgba(14, 77, 146, 0.18)",
        gold: "0 18px 52px rgba(215, 161, 43, 0.22)"
      },
      backgroundImage: {
        "civic-gradient":
          "linear-gradient(135deg, #07142d 0%, #0e4d92 50%, #d7a12b 100%)",
        "soft-grid":
          "linear-gradient(rgba(14, 77, 146, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 77, 146, 0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
