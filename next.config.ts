const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allows any HTTPS domain for images
      },
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
