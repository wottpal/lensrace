/* eslint-env node */
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

// eslint-disable-next-line
const withTM = require('next-transpile-modules')(['@lensrace/contracts'])

module.exports = withTM(nextConfig)
