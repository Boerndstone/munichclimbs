import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd(), ".."),
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
};

export default nextConfig;
