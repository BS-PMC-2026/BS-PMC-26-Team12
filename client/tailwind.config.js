/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark:   { 50: '#2A2220', 100: '#231C1A', 200: '#1C1614', 300: '#16110F', 400: '#110D0B', 500: '#0D0A08' },
        warm:   { 50: '#F8F0E8', 100: '#F0E4D8', 200: '#E8D6C4', 300: '#D4BCA0', 400: '#B89B78', 500: '#9C7D5C' },
        fire:   { 50: '#FFF1EC', 100: '#FFD9CC', 200: '#FFB199', 300: '#FF8866', 400: '#FF5C33', 500: '#E84420', 600: '#C23610', 700: '#9A2B0D', 800: '#72200A', 900: '#4A1507' },
        ember:  { 50: '#FFF8F0', 100: '#FFE8CC', 200: '#FFD199', 300: '#FFBA66', 400: '#FFA333', 500: '#E88C20', 600: '#C27410', 700: '#9A5C0D' },
        forest: { 50: '#F0F7EC', 100: '#D4EACC', 200: '#A8D599', 300: '#7DC066', 400: '#52AB33', 500: '#3D8A24', 600: '#2D6A1A', 700: '#1F4A12' },
        gold:   { 400: '#D4A053', 500: '#C4903D', 600: '#A87830' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        glow:    '0 0 30px rgba(232,68,32,0.15)',
        'glow-lg': '0 0 60px rgba(232,68,32,0.2)',
        warm:    '0 4px 20px rgba(0,0,0,0.3)',
        card:    '0 8px 32px rgba(0,0,0,0.25)',
        lift:    '0 16px 48px rgba(0,0,0,0.35)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(232,68,32,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(232,68,32,0.25)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
