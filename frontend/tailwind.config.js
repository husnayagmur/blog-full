/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#555936',
        secondary: '#8C7A64',
        bg: '#F2F2F2',
        'gray-100': '#EEEEEE',
        paragraf: '#262610',
      },
    },
  },
  plugins: [],
};
