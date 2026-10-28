/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        accent: {
          500: '#f97316',
          600: '#ea580c',
        },
      },
      keyframes: {
        // Infinite horizontal scrolling photo strip
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // Gradient text shimmer
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        // Floating bob
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-10px)' },
        },
        // Slow breathing pulse
        pulseSlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':       { opacity: '1',   transform: 'scale(1.08)' },
        },
      },
      animation: {
        marquee:      'marquee 28s linear infinite',
        shimmer:      'shimmer 3s linear infinite',
        float:        'float 3s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
