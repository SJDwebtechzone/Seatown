import type { NextConfig } from "next";

// Backend URL for your API/upload server. Falls back to localhost:5000 for
// local dev, but reads from an env var so this doesn't break in production
// where your backend won't be on localhost.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Derive protocol/hostname/port from API_URL so the remotePattern below
// can never drift out of sync with the actual backend URL — no need to
// hardcode a domain string that has to be manually updated later.
const apiUrlParsed = new URL(API_URL);

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
      // served directly from the backend during local development.
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      // FIX: production backend, derived from NEXT_PUBLIC_API_URL instead
      // of a hardcoded domain — this was missing before, causing every
      // /_next/image request for uploaded photos to fail with 400 Bad
      // Request, since Next.js blocks optimizing images from any host not
      // explicitly listed here.
      {
        protocol: apiUrlParsed.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiUrlParsed.hostname,
        port: apiUrlParsed.port || '',
        pathname: '/uploads/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        // Forwards any request for /uploads/* made to the Next.js app
        // straight through to the backend, so <Image src="/uploads/..." />
        // resolves correctly without hardcoding the backend host in the DB.
        source: "/uploads/:path*",
        destination: `${API_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;