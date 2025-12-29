/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        hand: ['"Caveat"', 'cursive'],
        sans: ['"Inter Tight"', 'sans-serif'],
      },
      colors: {
        void: "#030303",
        flame: "#FF5500",
        dawn: "#3b0764",
        text: "#E2E8F0",
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out 3',
        'rise': 'rise 2s ease-out forwards',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.5)', opacity: '1' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
