import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    qualities: [62, 70, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      // Legacy category query URLs -> dedicated category routes (SEO canonical).
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "(?<slug>[^&]+)" }],
        destination: "/shop/category/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
