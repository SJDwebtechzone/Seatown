import type { NextConfig } from "next";

// Backend URL for your API/upload server. Falls back to localhost:5000 for
// local dev, but reads from an env var so this doesn't break in production
// where your backend won't be on localhost.
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: "jvmjcjezhsaubgcncelq.supabase.co",
      },
      // Allows next/image to load review photos (and any other uploads)
      // served directly from the backend, e.g. http://localhost:5000/uploads/...
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      // NOTE: when you deploy, your backend will likely be on a real domain
      // over https instead of localhost:5000. When that happens, add another
      // entry here matching that domain, e.g.:
      // { protocol: 'https', hostname: 'api.yourdomain.com', pathname: '/uploads/**' },
    ],
  },

  async rewrites() {
    return [
      {
        // Forwards any request for /uploads/* made to the Next.js app
        // straight through to the backend, so <Image src="/uploads/..." />
        // resolves correctly without hardcoding the backend host in the DB.
        source: "/uploads/:path*",
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;