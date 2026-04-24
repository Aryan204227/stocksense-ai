/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg:    '#030712',
          card:  '#0d1424',
          hover: '#1e293b',
          border:'#1e2a3a',
        },
        neon: {
          blue:   '#0ea5e9',
          purple: '#8b5cf6',
          green:  '#10b981',
          red:    '#ef4444',
          amber:  '#f59e0b',
          cyan:   '#06b6d4',
          violet: '#8b5cf6',
          emerald: '#10b981',
          rose:   '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'neon-blue':   '0 0 25px rgba(14,165,233,0.25)',
        'neon-purple': '0 0 25px rgba(139,92,246,0.25)',
        'neon-green':  '0 0 25px rgba(16,185,129,0.25)',
        'neon-red':    '0 0 25px rgba(239,68,68,0.25)',
        'glass':       '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
    },
  },
  plugins: [],
}
