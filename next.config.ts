import type { NextConfig } from "next";

// Tailwind 4 runs as a Turbopack loader, so no PostCSS config is needed.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"] },
    },
  },
};

export default nextConfig;
