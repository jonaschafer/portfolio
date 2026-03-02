/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
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
      // (Redirects send /dana-plan and /dana-plan/ to /dana-plan-v2; static files under /dana-plan/* still served from public.)
    ]
  },
}

module.exports = nextConfig
