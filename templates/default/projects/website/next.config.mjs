import withBundleAnalyzer from "@next/bundle-analyzer";
import process from "process";

const initializeBundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default initializeBundleAnalyzer({
  reactStrictMode: true,
  typedRoutes: true,
  turbopack: { rules: { "*.svg": ["@svgr/webpack"] } },
  experimental: {
    optimizeCss: true,
    reactCompiler: true,
    webVitalsAttribution: ["CLS", "LCP", "FID", "FCP", "TTFB"],
    serverActions: { bodySizeLimit: "1mb" },
  },
  images: { qualities: [75, 100], formats: ["image/webp", "image/avif"], remotePatterns: [{ protocol: "https", hostname: "**", port: "" }] },
  async headers() {
    return [
      {
        source: "/(.*)?",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
});
