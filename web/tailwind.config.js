/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EAF3E5',
          100: '#D1E8C8',
          200: '#C6DEC0',
          300: '#8BBF8E',
          400: '#44AB4C',
          500: '#2D8B35',
          600: '#1D5E24',
          700: '#163E1B',
          800: '#0E2A12',
          900: '#081A0A',
        },
        pos: {
          bg:          '#0F172A',
          card:        '#1E293B',
          border:      '#334155',
          accent:      '#2D8B35',
          accentHover: '#1D5E24',
          text:        '#FFFFFF',
          muted:       '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
