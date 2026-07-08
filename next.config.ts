import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  output: "export",
  trailingSlash: true,
  allowedDevOrigins: ["192.168.1.122", "192.168.1.*"],
  // Pin the workspace root to this project. A stray pnpm-workspace.yaml in the
  // parent directory otherwise makes Next.js infer the wrong root and fail to
  // resolve dependencies like tailwindcss.
  turbopack: {
    root: __dirname,
  },
};

export default withMDX(nextConfig);
