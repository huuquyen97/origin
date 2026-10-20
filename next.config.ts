import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dữ liệu đọc từ /Data lúc build; mọi trang được sinh tĩnh.
  outputFileTracingExcludes: { "*": ["./Data/**", "./public/files/**"] },
};

export default nextConfig;
