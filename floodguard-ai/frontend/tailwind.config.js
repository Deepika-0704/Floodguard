/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        deep: {
          950: "#050B14",
          900: "#0A1420",
          800: "#0F1E2E",
          700: "#16293C",
        },
        flood: {
          teal: "#0EA5A8",
          cyan: "#22D3EE",
          amber: "#F5A623",
          coral: "#F2545B",
          moss: "#3FB37F",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.15)",
      },
    },
  },
  plugins: [],
}
