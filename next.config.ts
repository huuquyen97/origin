import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Trang sinh tĩnh từ /Data lúc build. Function động (/api/*) không kèm tài liệu gốc (~640MB, đã có trong public/files).
  outputFileTracingExcludes: { "*": ["./Data/MK Vision/**", "./Data/Design/**", "./public/files/**"] },
  // lib/data đọc JSON bằng fs lúc chạy nên Next không tự đóng gói: /api/ton-kho cần để ghép model → slug.
  outputFileTracingIncludes: {
    "/api/ton-kho": ["./Data/{Products,Solutions,Documents,AI,Site}/**/*.json", "./lib/generated/files.json"],
  },
};

export default nextConfig;
