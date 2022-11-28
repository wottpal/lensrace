/* eslint-disable */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        social: {
          twitter: '#1DA1F2',
          discord: '#EB459E',
        },
        // primary: '#4bc951',
        secondary: {
          // 1: '#cbeecc',
          // 2: '#8ec2a2',
          // 3: '#6ea680',
          4: '#006a5c',
        },
      },
      fontFamily: {
        sans: ['Public Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  daisyui: {
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
  plugins: [require('daisyui')],
}
