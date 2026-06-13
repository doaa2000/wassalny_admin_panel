/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens driven by CSS variables (see assets/styles/main.css).
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        surface2: 'var(--c-surface-2)',
        border: 'var(--c-border)',
        text: 'var(--c-text)',
        text2: 'var(--c-text-2)',
        muted: 'var(--c-muted)',
        primary: {
          DEFAULT: 'var(--c-primary)',
          dark: 'var(--c-primary-dark)',
          soft: 'var(--c-primary-soft)',
          soft2: 'var(--c-primary-soft-2)',
        },
        sidebar: 'var(--c-sidebar)',
        topbar: 'var(--c-topbar)',
        // Fixed status palette (identical across themes — matches design PAL).
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        indigo: '#6366F1',
        violet: '#8B5CF6',
        teal: '#14B8A6',
        pink: '#EC4899',
      },
      fontFamily: {
        sans: ['Tajawal', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: 'var(--shadow)',
        lg: 'var(--shadow-lg)',
        glow: '0 4px 12px rgba(249,115,22,.35)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
      keyframes: {
        fade: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'none' } },
        pop: { from: { opacity: '0', transform: 'scale(.96)' }, to: { opacity: '1', transform: 'none' } },
        pulseDot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '.35', transform: 'scale(.85)' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        slideIn: { from: { transform: 'translateX(40px)', opacity: '.4' }, to: { transform: 'none', opacity: '1' } },
      },
      animation: {
        fade: 'fade .35s ease',
        pop: 'pop .16s ease',
        pulseDot: 'pulseDot 2s ease-in-out infinite',
        shimmer: 'shimmer 1.3s infinite linear',
        slideIn: 'slideIn .24s ease',
      },
    },
  },
  plugins: [],
}
