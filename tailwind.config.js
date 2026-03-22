/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#080A07',
        surface: '#0D110C',
        'surface-2': '#141A12',
        'surface-3': '#1C2419',
        accent: '#8BA870',
        'accent-dim': '#627D4A',
        'accent-soft': '#111A0D',
        violet: '#C8DFA8',
        'violet-dim': '#9BBF7E',
        plum: '#2A3A1E',
        lilac: '#B8CDA0',
        lavender: '#94AF78',
        blush: '#D8ECC8',
        text: '#F0F2ED',
        muted: '#7A8E6A',
        faint: '#2E3D25',
        border: '#1C2419',
        'border-bright': '#2E3D25',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['BitcountGridDoubleInk', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 4px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)',
        'glass-pink': '0 4px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(139,168,112,0.1), 0 0 40px rgba(139,168,112,0.1)',
        'glass-violet': '0 4px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(200,223,168,0.08), 0 0 40px rgba(200,223,168,0.07)',
        'glow-pink': '0 0 60px rgba(139,168,112,0.22), 0 0 120px rgba(139,168,112,0.08)',
        'glow-violet': '0 0 60px rgba(200,223,168,0.18), 0 0 120px rgba(200,223,168,0.06)',
        'glow-sm': '0 0 24px rgba(139,168,112,0.35)',
        btn: '0 0 32px rgba(139,168,112,0.4), 0 4px 20px rgba(0,0,0,0.7)',
        'btn-ghost': '0 2px 12px rgba(0,0,0,0.4)',
        metric: '0 2px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'fade-up': 'fadeUp 0.7s ease forwards',
        'scan-line': 'scanLine 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'page-enter': 'pageEnter 0.45s cubic-bezier(0.22,1,0.36,1) forwards',
        'modal-enter': 'modalEnter 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanLine: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '1' },
          '50%': { transform: 'translateY(100%)', opacity: '0.4' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 24px rgba(139,168,112,0.25)' },
          '50%': { boxShadow: '0 0 48px rgba(139,168,112,0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pageEnter: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        modalEnter: {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
