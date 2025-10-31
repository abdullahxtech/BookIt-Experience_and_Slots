import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // allow images from Unsplash
        port: '',
        pathname: '/**', // allow any path on this hostname
      },
    ]
  },
};

export default nextConfig;
