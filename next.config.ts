import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
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
  async redirects() {
    return [
      { source: "/Datenschutz", destination: "/datenschutz", permanent: true },
      { source: "/Impressum", destination: "/impressum", permanent: true },
    ];
  },
};

export default nextConfig;
