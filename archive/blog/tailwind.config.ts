import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#2E1165', // Dark purple background
          dark: '#1f0b45',
        },
        figma: {
          bg: '#2E1165', // Dark purple background
          text: '#ffffff', // White text
          textLight: '#e5e5e5',
          border: '#4a2d8f',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        sans: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '720px',
            color: '#ffffff',
            lineHeight: '1.7',
            fontSize: '1.125rem',
            h2: {
              fontWeight: '700',
              fontSize: '2rem',
              marginTop: '3rem',
              marginBottom: '1.25rem',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            },
            h3: {
              fontWeight: '600',
              fontSize: '1.5rem',
              marginTop: '2.5rem',
              marginBottom: '1rem',
              color: '#ffffff',
              letterSpacing: '-0.01em',
            },
            p: {
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            a: {
              color: '#ffffff',
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                opacity: '0.7',
              },
            },
            strong: {
              color: '#ffffff',
              fontWeight: '600',
            },
            blockquote: {
              fontStyle: 'normal',
              borderLeft: 'none',
              paddingLeft: '0',
              paddingRight: '0',
              marginLeft: '0',
              marginRight: '0',
              textAlign: 'center',
              fontSize: '1.5rem',
              lineHeight: '1.4',
              fontWeight: '500',
              color: '#ffffff',
              paddingTop: '2rem',
              paddingBottom: '2rem',
              marginTop: '3rem',
              marginBottom: '3rem',
            },
            'blockquote p': {
              marginTop: '0',
              marginBottom: '0',
            },
            code: {
              backgroundColor: '#5a63f9',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.9375rem',
              fontWeight: '400',
              color: '#ffffff',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
