import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite is only used for local development without a Neon database (see src/server/db/index.ts).
  serverExternalPackages: ["@electric-sql/pglite"],
  // The social card reads the bundled Geist fonts from disk; make sure Vercel ships them with the function.
  outputFileTracingIncludes: {
    "/[lang]/blog/[slug]/opengraph-image": ["./src/assets/fonts/**"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
