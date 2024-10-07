/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customGreen: "rgb(6, 40, 47)",
        greenHover: "rgb(50, 120, 130)",
      },
    },
  },
  plugins: [],
};
