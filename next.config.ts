import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: ["images.unsplash.com"], // add all domains you use for avatars
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
