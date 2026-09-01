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
  // daisyUI added only for the framework-comparison preview at /mma/map/compare —
  // remove before merging anything from this branch back to main.
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
  },
}
