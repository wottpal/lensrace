module.exports = {
  ...require('../../.prettierrc.js'),
  overrides: [
    {
      files: ['*.sol'],
      options: {
        tabWidth: 4,
        semi: false,
        singleQuote: false,
      },
    },
  ],
}
