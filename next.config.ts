import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // This app uses server rendering for Supabase authentication, CMS data and contact storage.
  // Do not add output: 'export' here.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
