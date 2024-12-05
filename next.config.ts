import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/on-es",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
