/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        raise: 'var(--bg-raise)',
        sunken: 'var(--bg-sunken)',
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
        ink: 'var(--text)',
        dim: 'var(--text-dim)',
        mute: 'var(--text-mute)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        live: 'var(--live)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        pill: 'var(--r-pill)',
      },
      maxWidth: {
        shell: '1180px',
      },
    },
  },
  plugins: [],
};