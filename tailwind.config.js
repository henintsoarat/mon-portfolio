export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Arial', 'sans-serif'],
        body:    ['Arial', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        core: {
          cyan:    '#00F0FF',
          red:     '#FF003C',
          bg:      '#030508',
          surface: '#0D1117',
          border:  '#27272A',
          muted:   '#A1A1AA',
        },
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        coreAlertPulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        coreCyanPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'core-alert': 'coreAlertPulse 1.5s ease-in-out infinite',
        'core-cyan':  'coreCyanPulse 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
