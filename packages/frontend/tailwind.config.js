/* eslint-disable */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        social: {
          twitter: '#1DA1F2',
          discord: '#EB459E',
        },
        primary: '#4bc951',
        secondary: {
          1: '#cbeecc',
          2: '#8ec2a2',
          3: '#6ea680',
          4: '#006a5c',
        },
      },
      fontFamily: {
        mono: ['Inconsolata', 'Menlo', ...defaultTheme.fontFamily.mono],
      },
      animation: {
        'spin-custom': '800ms ease-in-out infinite spin',
      },
    },
  },
  plugins: [
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/line-clamp'),
  ],
}
