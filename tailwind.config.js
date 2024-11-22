/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts, scss}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        'gray-900-important': 'rgb(26, 32, 44)', // Приоритетная версия
      },
    },
  
  plugins: [],
  }
}
