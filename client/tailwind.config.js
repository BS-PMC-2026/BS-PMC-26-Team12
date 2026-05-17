/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Light surface scale (dark-300 = page bg via body class)
        dark:   {
          50:  '#FFF2E8',
          100: '#FFFAF5',
          200: '#FFFFFF',
          300: '#FAFAF7',  // page background
          400: '#F2EDE6',
          500: '#E8E1D8',  // borders / dividers
        },
        // Text scale (warm-100 = body text via body class)
        warm:   {
          50:  '#3D2318',  // input text / secondary dark
          100: '#1C110A',  // primary body text
          200: '#3D2318',
          300: '#5A3D2B',  // secondary text
          400: '#9B7260',  // muted text
          500: '#C4A898',  // very muted
        },
        fire:   { 50: '#FFF1EC', 100: '#FFD9CC', 200: '#FFB199', 300: '#FF8866', 400: '#FF5C33', 500: '#E84420', 600: '#C23610', 700: '#9A2B0D', 800: '#72200A', 900: '#4A1507' },
        ember:  { 50: '#FFF8F0', 100: '#FFE8CC', 200: '#FFD199', 300: '#FFBA66', 400: '#FFA333', 500: '#E88C20', 600: '#C27410', 700: '#9A5C0D' },
        forest: { 50: '#F0F7EC', 100: '#D4EACC', 200: '#A8D599', 300: '#7DC066', 400: '#52AB33', 500: '#3D8A24', 600: '#2D6A1A', 700: '#1F4A12' },
        gold:   { 400: '#D4A053', 500: '#C4903D', 600: '#A87830' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        glow:      '0 0 30px rgba(194,54,16,0.12)',
        'glow-lg': '0 0 60px rgba(194,54,16,0.15)',
        warm:      '0 4px 20px rgba(28,17,10,0.08)',
        card:      '0 4px 24px rgba(28,17,10,0.07), 0 1px 4px rgba(28,17,10,0.05)',
        lift:      '0 12px 40px rgba(28,17,10,0.12), 0 2px 8px rgba(28,17,10,0.06)',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 8s ease-in-out infinite',
        'pulse-glow':  'pulseGlow 3s ease-in-out infinite',
        'slide-up':    'slideUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(194,54,16,0.08)' },
          '50%':      { boxShadow: '0 0 40px rgba(194,54,16,0.18)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
