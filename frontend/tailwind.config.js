/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customGreen: "rgb(6, 40, 47)",
        greenHover: "rgb(50, 120, 130)",
      },
      animation: {
        ripple: "ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite",
        pulse: "pulse var(--duration) ease-out infinite",
      },
      keyframes: {
        ripple: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(0.9)",
          },
        },
        pulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 var(--pulse-color)" },
          "50%": { boxShadow: "0 0 0 8px var(--pulse-color)" },
        },
      },
    },
  },
  plugins: [],
};
