import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // Optimisation pour ton cas shop_jopke
  experimental: {
    // Optimise les imports lourds
    optimizePackageImports: ['zustand'],
  },

  webpack: (config) => {
    config.watchOptions = {
      // IMPORTANT: Ignore les dossiers qui font exploser la RAM
      ignored: ['**/node_modules/**', '**/.next/**', '**/tmp/**', '**/scripts/**'],
    };
    return config;
  },
};

export default nextConfig;