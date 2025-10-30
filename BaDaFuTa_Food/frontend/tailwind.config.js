/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // bật dark mode bằng class, không auto theo OS
  theme: {
    extend: {
      colors: {
        accent: "#38bdf8", // màu xanh nhẹ
        "accent-foreground": "#ffffff", // chữ trắng khi hover
      },
      fontFamily: {
        sans: ["Nunito", "Poppins", "Quicksand", "sans-serif"],
      },
    },
  },
  plugins: [],
};

module.exports = {
  darkMode: "class", // bật dark mode bằng class, không auto theo OS
  theme: {
    extend: {},
  },
  plugins: [],
};
