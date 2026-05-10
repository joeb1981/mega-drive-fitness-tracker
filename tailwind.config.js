/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        void: '#050014',
        night: '#13002d',
        sonic: '#0ff4ff',
        genesis: '#6c2dff',
        magenta: '#ff38d1',
        ember: '#ff8a00',
        boot: '#3f2817',
      },
      boxShadow: {
        neon: '0 0 18px rgba(15, 244, 255, 0.65), inset 0 0 24px rgba(108, 45, 255, 0.35)',
        danger: '0 0 18px rgba(255, 56, 209, 0.65)',
      },
      animation: {
        flicker: 'flicker 2.6s infinite steps(1)',
        scan: 'scan 7s linear infinite',
        bob: 'bob 0.8s infinite steps(2)',
        victory: 'victory 0.9s infinite steps(2)',
        damage: 'damage 0.55s infinite steps(2)',
        pulseGlow: 'pulseGlow 1.8s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.98' },
          '3%': { opacity: '0.91' },
          '4%': { opacity: '0.98' },
          '8%': { opacity: '0.94' },
          '9%': { opacity: '1' },
          '72%': { opacity: '0.95' },
          '73%': { opacity: '0.99' },
        },
        scan: {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(100%)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        victory: {
          '0%, 100%': { transform: 'translateY(-7px) scale(1.03)' },
          '50%': { transform: 'translateY(0) scale(1)' },
        },
        damage: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(-2deg)' },
          '50%': { transform: 'translate(-4px, 2px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px #0ff4ff)' },
          '50%': { filter: 'drop-shadow(0 0 8px #ff38d1)' },
        },
      },
    },
  },
  plugins: [],
};
