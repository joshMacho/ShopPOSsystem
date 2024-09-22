/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        myshadow: {
          100: "#ececed",
          200: "#748b96",
        },
        mygreen: "#16a34a",
      },
    },
  },
  plugins: [],
};
