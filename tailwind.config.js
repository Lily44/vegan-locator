/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          600: '#16a34a',
          700: '#2e7d32', // Primary Brand Green
          800: '#166534',
          900: '#14532d',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f7f4ed',
          200: '#e8e2d5',
        },
        slateText: '#1e293b',
      },
    },
  },
  plugins: [],
}
