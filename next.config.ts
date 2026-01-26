import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "munichclimbs.com",
      },
      {
        protocol: "https",
        hostname: "www.munichclimbs.de",
      },
    ],
  },
};

export default nextConfig;
