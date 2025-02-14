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

          'main-green-100':'#C9EBCD',
          'main-green-200':'#B1D5B6',
          'main-green-300':'#9AC09F',
          'main-green-400':'#83AB89',
          'main-green-500':'#6D9773',
          'main-green-600':'#507656',
          'main-green-700':'#35563A',
          'main-green-800':'#1B3820',
          'main-green-900':'#001D02',

          'main-grey-100':'#E3E3E3',
          'main-grey-200':'#A3A3A3',
          'main-grey-300':'#8A8A8A',
          'main-grey-400':'#5C5C5C',
          'main-grey-500':'#474747',

          'main-white':'#FFFFFF',
          'main-cream':'#FFFBF2',
          'main-black':'#000000'
        },
        fontFamily: {
          kulim: ['Kulim Park'],
          source: ['Source-Serif-4']
        }
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }
  