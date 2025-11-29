/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Only use during development, fix errors for production
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
