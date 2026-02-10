/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          primary: '#F8E8E8',
          secondary: '#E8D5D5',
          accent: '#D4A5A5',
          gold: '#D4AF37',
          rose: '#FFB6C1',
        }
      },
      fontFamily: {
        wedding: ['Noto Serif KR', 'serif'],
      }
    },
  },
  plugins: [],
}
