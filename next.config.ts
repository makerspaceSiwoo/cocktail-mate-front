import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 잠정적으로 모든 https 이미지 호스트 허용. 이미지 도메인이 확정되면
    // 특정 호스트로 좁힌다.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
