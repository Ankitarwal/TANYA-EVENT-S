/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          950: '#26050C',
          900: '#430814',
          850: '#54091A',
          800: '#6B0E23',
          700: '#871630',
          600: '#A72441',
          500: '#C73656',
        },
        gold: {
          900: '#4E3A10',
          800: '#6E5218',
          700: '#8E6B20',
          600: '#B2882C',
          500: '#D4AF37',
          400: '#DFBF5B',
          300: '#EBD186',
          200: '#F4E4B5',
          100: '#FBF5DF',
          50: '#FDFBF5',
        },
        ivory: {
          50: '#FCFAF6',
          100: '#F7F2E8',
          200: '#EFE6D6',
          300: '#DDD0B8',
          400: '#C4B296',
          900: '#1C1712',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
        'maroon-glow': '0 0 30px -5px rgba(107, 14, 35, 0.4)',
        'card-lux': '0 10px 30px -10px rgba(67, 8, 20, 0.15)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FBF5DF 0%, #D4AF37 50%, #B2882C 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #430814 0%, #6B0E23 50%, #26050C 100%)',
        'royal-gradient': 'linear-gradient(180deg, rgba(38, 5, 12, 0.85) 0%, rgba(67, 8, 20, 0.95) 100%)',
      }
    },
  },
  plugins: [],
}
