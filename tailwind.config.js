/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        "3/10": "30%",
        "7/10": "70%",
      },
    },
  },
  plugins: [],
};
