// tailwind.config.js
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        glitch: {
          '0%, 20%, 40%, 60%, 80%, 100%': { transform: 'translate(0)' },
          '10%': { transform: 'translate(-2px, -2px)' },
          '30%': { transform: 'translate(2px, 2px)' },
          '50%': { transform: 'translate(-2px, 2px)' },
          '70%': { transform: 'translate(2px, -2px)' },
          '90%': { transform: 'translate(-2px, -2px)' },
        },
      },
      animation: {
        glitch: 'glitch 1s infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
