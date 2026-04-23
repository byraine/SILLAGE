/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F5F3EE',
        surface: '#EDEAE3',
        'surface-2': '#E4E1DA',
        'surface-3': '#DBDAD2',
        accent: '#1A1916',
        'accent-dim': '#3D3C39',
        'accent-soft': '#F0EDE6',
        violet: '#6B6A65',
        'violet-dim': '#575652',
        plum: '#E4E1DA',
        lilac: '#9C9B97',
        lavender: '#7C7B77',
        blush: '#F0EDE6',
        text: '#1A1916',
        muted: '#726F6A',
        faint: '#A8A5A0',
        border: '#D8D5CE',
        'border-bright': '#B0ADA6',
        burgundy: '#C41E3A',
      },
      fontFamily: {
        sans: ['IBM Plex Mono', 'Courier New', 'monospace'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        typewriter: ['Special Elite', 'Courier New', 'monospace'],
        poiret: ['Poiret One', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '0.5rem',
        '3xl': '0.625rem',
        '4xl': '0.75rem',
      },
      boxShadow: {
        glass: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        'glass-pink': '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.7)',
        'glass-violet': '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.75)',
        'glow-pink': '0 2px 8px rgba(0,0,0,0.08)',
        'glow-violet': '0 2px 8px rgba(0,0,0,0.06)',
        'glow-sm': '0 1px 4px rgba(0,0,0,0.10)',
        btn: '0 1px 3px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.12)',
        'btn-ghost': '0 1px 3px rgba(0,0,0,0.06)',
        metric: '0 1px 3px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
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
          '0%, 100%': { boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
          '50%': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
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
