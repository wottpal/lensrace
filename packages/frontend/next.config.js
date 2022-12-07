/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
let nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

const withTwin = require('./withTwin.js')
nextConfig = withTwin(nextConfig)

const withTM = require('next-transpile-modules')(['@lensrace/contracts'])
nextConfig = withTM(nextConfig)

module.exports = nextConfig
