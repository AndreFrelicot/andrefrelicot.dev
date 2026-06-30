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
};

export default withMDX(nextConfig);
