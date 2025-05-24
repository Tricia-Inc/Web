/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sidebar': 'rgb(245, 245, 245)',
        'sidebar-foreground': 'rgb(43, 43, 43)'
      }
    },
  },
  plugins: [],
} 