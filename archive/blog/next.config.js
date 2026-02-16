/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    turbopack: {
      root: '/Users/jon/git/brand/blog',
    },
  },
}

module.exports = nextConfig
