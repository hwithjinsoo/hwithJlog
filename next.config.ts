import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // 개발 모드 좌측 하단 Next.js dev tools 인디케이터 숨김
  devIndicators: false,
};

export default withMDX(nextConfig);