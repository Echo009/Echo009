/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#050510',
          deep: '#0a0a1a',
          cyan: '#00FFFF',
          pink: '#FF006E',
          yellow: '#F5FF00',
          purple: '#7B2FFF',
          grid: '#0d1f3c',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'monospace'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 3s infinite',
        'scan': 'scan 8s linear infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'border-flow': 'borderFlow 3s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)' },
          '92%': { transform: 'translate(-3px, 1px)', filter: 'hue-rotate(90deg)' },
          '94%': { transform: 'translate(3px, -1px)', filter: 'hue-rotate(-90deg)' },
          '96%': { transform: 'translate(-2px, 2px)' },
          '98%': { transform: 'translate(2px, -2px)', filter: 'hue-rotate(180deg)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF' },
          '50%': { opacity: '0.7', boxShadow: '0 0 5px #00FFFF' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 40px #00FFFF33',
        'neon-pink': '0 0 10px #FF006E, 0 0 20px #FF006E, 0 0 40px #FF006E33',
        'neon-yellow': '0 0 10px #F5FF00, 0 0 20px #F5FF00, 0 0 40px #F5FF0033',
      },
    },
  },
  plugins: [],
};
