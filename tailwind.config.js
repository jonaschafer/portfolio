/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'desktop': '1200px',
      },
    },
  },
  // daisyUI powers the /mma/map recovery app. base:false keeps its global
  // html/body/native-element resets from bleeding into the rest of the
  // portfolio, which doesn't otherwise use daisyUI.
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
    base: false,
  },
}
