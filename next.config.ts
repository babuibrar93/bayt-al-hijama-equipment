import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
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
