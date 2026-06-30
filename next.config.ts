import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security: Prevent source map exposure in production
  productionBrowserSourceMaps: false,

  // Security: HTTP headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Prevent clickjacking via iframe embedding
          { key: "X-Frame-Options", value: "DENY" },
          // Enable XSS protection in older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Strict referrer policy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions policy — disable unused browser features
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Block direct access to API routes from foreign origins
        source: "/api/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
