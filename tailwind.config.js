/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#FFEA75',
          DEFAULT: '#F9B642', 
          dark: '#9D5316'
        }
      }
    },
  },
  plugins: [],
};
