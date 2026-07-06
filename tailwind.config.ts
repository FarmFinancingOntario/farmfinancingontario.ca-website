import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bark: "#4F3827",
        clay: "#A25D3C",
        cream: "#FBF7EF",
        field: "#496B35",
        meadow: "#769A4A",
        moss: "#2F5138",
        oat: "#E7D7B7",
        soil: "#6F5135",
        wheat: "#C79A3B",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(62, 48, 33, 0.12)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
