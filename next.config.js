/** @type {import('next').NextConfig} */
const nextConfig = {
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
}

module.exports = nextConfig
