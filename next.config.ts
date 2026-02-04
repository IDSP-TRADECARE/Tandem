/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply headers to all routes for iframe embedding support
        source: '/:path*',
        headers: [
          // Allow embedding from specific domains
          // Using SAMEORIGIN to allow same-origin embedding
          // CSP frame-ancestors provides more granular control
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM',
          },
          // Content Security Policy - allow embedding from specific domains
          {
            key: 'Content-Security-Policy',
            value: [
              "frame-ancestors 'self'",
              'http://localhost:3000',
              'https://localhost:3000',
              'http://localhost:3001',
              'https://localhost:3001',
              'https://sdx24.com',
              'https://*.sdx24.com',
              'https://www.stefandorosh.com',
              'https://stefandorosh.com',
              'https://www.lam-thai.com',
              'https://www.matheusdemeis.com',
            ].join(' '),
          },
          // Enable cross-origin credentials (required for cookies in iframe)
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
