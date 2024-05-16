// tailwind.config.js

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    theme: {
      extend: {
        colors: {
          'main-color-lightgreen': '#6d9773',
          'main-color-darkgreen': '#0c3b2e',
          'main-color-lightbrown': '#b46617',
          'main-color-gold': '#ffba00',
          'main-color-white': '#fffbf2',
          'main-color-beige': '#f1ecd5',
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }
  