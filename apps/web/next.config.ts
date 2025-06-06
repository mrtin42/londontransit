import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* image origin */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.ltcdn.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
