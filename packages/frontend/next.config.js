/* eslint-env node */
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'media.lenster.xyz'],
  },
}

// eslint-disable-next-line
const withTM = require('next-transpile-modules')(['@lensrace/contracts'])

module.exports = withTM(nextConfig)
