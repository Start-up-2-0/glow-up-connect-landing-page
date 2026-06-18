import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        urbanist: ['Urbanist', 'Inter', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        glow: {
          gold: 'var(--glow-gold)',
          'gold-dark': 'var(--glow-gold-dark)',
          'gold-soft': 'var(--glow-gold-soft)',
          text: 'var(--glow-text)',
          'text-muted': 'var(--glow-text-muted)',
          'text-soft': 'var(--glow-text-soft)',
          'text-subtle': 'var(--glow-text-subtle)',
          surface: 'var(--glow-surface)',
          canvas: 'var(--glow-canvas)',
          primary: 'var(--glow-primary)',
          purple: 'var(--glow-purple)',
          'purple-soft': 'var(--glow-purple-soft)',
          'gold-cta': 'var(--glow-gold-cta)',
          secondary: 'var(--glow-secondary)',
          'border-soft': 'var(--glow-border-soft)',
        },
      },
    },
  },
  plugins: [forms],
}
