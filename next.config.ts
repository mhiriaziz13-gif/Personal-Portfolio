import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  ...(isProduction ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }] : []),
];

const nextConfig: NextConfig = {
  // This app uses server rendering for Supabase authentication, CMS data and contact storage.
  // Do not add output: 'export' here.
  images: { unoptimized: true },
  poweredByHeader: false,
  trailingSlash: true,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: [...securityHeaders, { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }, { key: 'Cache-Control', value: 'no-store, private, max-age=0' }] },
      { source: '/api/:path*', headers: [...securityHeaders, { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }, { key: 'Cache-Control', value: 'no-store, private, max-age=0' }] },
    ];
  },
};

export default nextConfig;
