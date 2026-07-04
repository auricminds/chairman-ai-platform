import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0c0c0e",
          900: "#111114",
          800: "#1a1a1f",
          700: "#24242b",
          600: "#2e2e38",
        },
        ivory: {
          50: "#faf8f4",
          100: "#f5f0e8",
          200: "#ede4d0",
        },
        gold: {
          400: "#d4a853",
          500: "#c49435",
          600: "#a87c20",
        },
      },
      fontFamily: {
        sans: [
          "system-ui", "-apple-system", "BlinkMacSystemFont",
          "Segoe UI", "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
