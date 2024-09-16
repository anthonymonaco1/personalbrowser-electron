const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
        'base-grey': '#D9D9D9',
        'dark-grey': '#B4B4B4',
        'widget-purple': '#4D34F3',
        'linkedin': '#0a66c2',
        'reddit': '#ff4500',
        'spotify': '#e81746'
      },
      fontFamily: {
        'mandali': 'Mandali',
        'capriola': 'Capriola'
      },
      height: {
        '1/8': '12.5%',
        '7/8': '87.5%',
        '11/12': '91.666667%',
        '1/12': '8.333333%',
        '1/10': '10%',
        '9/10': '90%'
      },
      width: {
        '3/8': '37.5%',
        '1/10': '10%',
        '1/8': '12.5%'
      },
      minWidth: {
        '1/4': '25%',
        '1/5': '20%'
      },
      maxWidth: {
        '1/4': '25%',
        '1/5': '20%',
        '1/3': '33%'
      },
      borderColor: {
        'silver': '#BFBFBF'
      },
      zIndex: {
        'max': '100000'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};