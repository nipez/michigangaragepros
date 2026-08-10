import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Avoid regenerating AGENTS.md / CLAUDE.md on every `next dev`
  agentRules: false,
};

export default nextConfig;
