/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFDAD9',
        'text-dark': '#2D1F0F',
        'text-secondary': '#1E2939',
        'shelf-top': '#8B7355',
        'shelf-bottom': '#6B5644',
        'shelf-mid': '#A0826D',
      },
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
      },
      screens: {
        '2xl': '1600px',
      },
    },
  },
  plugins: [],
}
