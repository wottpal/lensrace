/* eslint-disable */

const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        social: {
          twitter: '#1DA1F2',
          discord: '#EB459E',
        },
      },
      fontFamily: {
        mono: ['Inconsolata', ...defaultTheme.fontFamily.mono],
        sans: ['Public Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  daisyui: {
    logs: false,
    themes: [
      {
        lensrace: {
          primary: '#1F786C',
          secondary: '#8ec2a2',
          accent: '#37CDBE',
          neutral: '#3D4451',
          'base-100': '#E6FFE6',
          'base-content': '#000000',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
    ],
  },
  plugins: [require('daisyui'), require('@tailwindcss/forms')],
}
