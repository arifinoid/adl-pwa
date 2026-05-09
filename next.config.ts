import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.arifinoid.workers.dev",
      },
    ],
  },
};

// Only apply the Serwist plugin in production to avoid Webpack/Turbopack conflicts.
// Serwist requires Webpack to inject and manage the service worker lifecycle.
const finalConfig =
  process.env.NODE_ENV === "production"
    ? withSerwistInit({
        swSrc: "app/sw.ts",
        swDest: "public/sw.js",
      })(nextConfig)
    : nextConfig;

export default finalConfig;
