/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Ventis-inspired palette: a clean white canvas, near-black ink text,
      // a bright teal brand accent and a red reserved for sale/promo.
      colors: {
        ink: "#1a1a1a",
        brand: "#18d0b2",
        "brand-dark": "#024f54",
        "brand-light": "#6aefcc",
        sale: "#cd2d25",
        line: "#dbdbdb",
        paper: "#f5f5f5",
        muted: "#666666",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Helvetica Neue",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
