import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "@phosphor-icons/react"],
  },
  images: {
    // AVIF first (≈20% smaller than WebP, ≈70% smaller than the source PNGs),
    // WebP fallback for browsers without AVIF support.
    formats: ["image/avif", "image/webp"],
    // 1-year immutable cache for generated variants — the optimizer URLs are
    // content-addressed so this is safe.
    minimumCacheTTL: 31536000,
    // Tuned to the funnel's actual breakpoints so the optimizer never serves a
    // wildly oversized variant.
    deviceSizes: [360, 640, 768, 1024, 1280, 1600],
    // Intrinsic widths of the small fixed-size assets (logos / marquee).
    imageSizes: [96, 186, 328, 480],
    // Next 15.3 requires an explicit allow-list once a non-default quality is used.
    qualities: [50, 70, 85],
  },
}

export default nextConfig
