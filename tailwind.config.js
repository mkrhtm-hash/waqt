/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: { 950: '#050507', 900: '#0a0a0f', 800: '#111118', 700: '#1a1a24', 600: '#262633' },
        gold: { 50: '#fbf6ea', 100: '#f4e9cc', 200: '#ead7a4', 300: '#dfc283', 400: '#d4ad62', 500: '#c19549', 600: '#a67a39', 700: '#87602e', 800: '#6b4b26' },
        canvas: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        ivory: { 50: '#fdfbf6', 100: '#f8f4ea', 200: '#efe8d8' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Tajawal', 'serif'],
        sans: ['Inter', 'Tajawal', 'system-ui', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
      letterSpacing: { luxe: '0.35em', wide2: '0.2em' },
      boxShadow: {
        gold: '0 0 0 1px rgba(212,173,98,0.25), 0 20px 50px -20px rgba(0,0,0,0.6)',
        glow: '0 0 40px -5px rgba(212,173,98,0.35)',
      },
      keyframes: {
        shimmer: { '0%': { transform: 'translateX(-120%) skewX(-20deg)' }, '100%': { transform: 'translateX(220%) skewX(-20deg)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: '0.6' }, '100%': { transform: 'scale(1.8)', opacity: '0' } },
      },
      animation: {
        shimmer: 'shimmer 2.8s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        pulseRing: 'pulseRing 2s ease-out infinite',
      },
    },
  },
  plugins: [],
}
