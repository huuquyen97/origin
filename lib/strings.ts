// Chuỗi giao diện tiếng Việt dùng chung.
import type { DocType } from "@/lib/data/schema";

export const NAV = [
  { href: "/", label: "Tổng quan" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/giai-phap", label: "Giải pháp" },
  { href: "/thuat-toan-ai", label: "Thuật toán AI" },
  { href: "/tai-lieu", label: "Tài liệu" },
  { href: "/so-sanh", label: "So sánh" },
] as const;

export const DOC_TYPE_LABEL: Record<DocType, string> = {
  datasheet: "Datasheet",
  brochure: "Brochure",
  slide: "Slide",
  hdsd: "Hướng dẫn",
  certificate: "Chứng nhận",
  catalog: "Catalogue",
  srs: "Đặc tả (SRS)",
  ai: "Tài liệu AI",
  profile: "Hồ sơ năng lực",
  architecture: "Kiến trúc",
  media: "Hình ảnh / Video",
  other: "Khác",
};

export const SPEC_GROUP_LABEL: Record<string, string> = {
  Image: "Hình ảnh",
  Lens: "Ống kính",
  AI: "AI",
  Video: "Video",
  Audio: "Âm thanh",
  Network: "Mạng",
  Storage: "Lưu trữ",
  Power: "Nguồn",
  Environment: "Môi trường",
  Physical: "Cơ khí",
  Other: "Khác",
};

export const T = {
  siteName: "MK Vision Product Docs",
  siteDescription: "Cổng tra cứu nội bộ sản phẩm và giải pháp Camera / AI Camera của MK Vision cho Sales & Presales.",
  footerText: "Cổng tra cứu nội bộ sản phẩm và giải pháp MK Vision cho Sales & Presales. Mọi thông số lấy từ tài liệu chính thống của công ty.",
  internalOnly: "Chỉ dùng nội bộ",
  searchPlaceholder: "Tìm sản phẩm, tài liệu…",
  searchModalPlaceholder: "Model, tính năng, giải pháp, tài liệu… (không cần gõ dấu)",
  missing: "—",
  all: "Tất cả",
  clearFilters: "Xoá bộ lọc",
  compare: "So sánh",
  copied: "Đã copy vào clipboard",
};

export const SEARCH_GROUPS = ["Sản phẩm", "Giải pháp", "Thuật toán AI", "Tài liệu"] as const;
export type SearchGroup = (typeof SEARCH_GROUPS)[number];
