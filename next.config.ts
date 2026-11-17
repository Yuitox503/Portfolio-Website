import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // The portfolio is a hand-written static page in public/index.html.
      // Serve it at "/" unchanged; the tracker lives in app/tracker.
      beforeFiles: [{ source: "/", destination: "/index.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      { source: "/tracker", headers: noindex },
      { source: "/tracker/:path*", headers: noindex },
    ];
  },
};

export default nextConfig;
