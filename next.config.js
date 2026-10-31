/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep parallel webpack builds when a custom webpack hook is present (Next 14 warning)
    webpackBuildWorker: true,
  },
  // Dev (webpack path only): disable persistent cache so stale chunk refs don't survive
  // Dropbox/sync or multiple dev processes touching .next.
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false
    }
    return config
  },
  async redirects() {
    return [
      // The MMA story + recovery map are retired in favor of /mma/food. Code kept in app/mma and components/.
      { source: '/mma', destination: '/mma/food', permanent: false },
      { source: '/mma/map', destination: '/mma/food', permanent: false },
      { source: '/mma/map/:path*', destination: '/mma/food', permanent: false },
      { source: '/bio', destination: '/about', permanent: true },
      // Work is the homepage now; project pages were folded into it.
      { source: '/work', destination: '/', permanent: false },
      { source: '/work/:slug', destination: '/', permanent: false },
      { source: '/v2', destination: '/', permanent: true },
      { source: '/v2/', destination: '/', permanent: true },
      { source: '/dana-plan', destination: '/dana-plan-v2', permanent: true },
      { source: '/dana-plan/', destination: '/dana-plan-v2', permanent: true },
    ]
  },
  // Ensure static files in public/play/prototypes are served correctly
  async headers() {
    return [
      {
        source: '/play/prototypes/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/play/prototypes/:folder',
        destination: '/play/prototypes/:folder/index.html',
      },
      {
        source: '/play/prototypes/:folder/:subfolder',
        destination: '/play/prototypes/:folder/:subfolder/index.html',
      },
      // Jaw recovery food + care plan: static page in public/mma/food (gated in middleware)
      { source: '/mma/food', destination: '/mma/food/index.html' },
      { source: '/mma/friends', destination: '/mma/friends/index.html' },
      // Erg physics simulator: static page in public/row-simulator
      { source: '/row-simulator', destination: '/row-simulator/index.html' },
      // (Redirects send /dana-plan and /dana-plan/ to /dana-plan-v2; static files under /dana-plan/* still served from public.)
    ]
  },
}

module.exports = nextConfig
