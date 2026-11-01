import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-only "N" route indicator; compile/runtime errors still show.
  devIndicators: false,
};

export default nextConfig;
