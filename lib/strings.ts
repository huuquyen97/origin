// Chuỗi giao diện tiếng Việt dùng chung.
import type { DocStatus, DocType } from "@/lib/data/schema";

export const NAV = [
  { href: "/", label: "Tổng quan" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/giai-phap", label: "Giải pháp" },
  { href: "/thuat-toan-ai", label: "Tính năng AI" },
  { href: "/tai-lieu", label: "Tài liệu" },
  { href: "/so-sanh", label: "So sánh" },
] as const;

export const DOC_TYPE_LABEL: Record<DocType, string> = {
  datasheet: "Datasheet",
  brochure: "Tài liệu giới thiệu",
  slide: "Slide",
  hdsd: "Hướng dẫn",
  certificate: "Chứng nhận",
  catalog: "Catalogue",
  srs: "Đặc tả yêu cầu (SRS)",
  ai: "Tài liệu AI",
  profile: "Hồ sơ năng lực",
  architecture: "Kiến trúc / sơ đồ",
  media: "Hình ảnh / Video",
  other: "Khác",
};

export const DOC_STATUS: Record<DocStatus, { label: string; cls: string }> = {
  public: { label: "Gửi khách được", cls: "tag-ok" },
  internal: { label: "Nội bộ", cls: "tag-internal" },
  old: { label: "Bản cũ", cls: "tag-warn" },
  expired: { label: "Hết hạn", cls: "tag-danger" },
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
  siteDescription: "Cổng tra cứu nội bộ sản phẩm và giải pháp Camera / AI Camera của MK Vision cho Sales.",
  footerText: "Cổng tra cứu nội bộ sản phẩm và giải pháp MK Vision cho Sales. Mọi thông số lấy từ tài liệu chính thống của công ty.",
  internalOnly: "Chỉ dùng nội bộ",
  searchPlaceholder: "Tìm sản phẩm, tài liệu…",
  searchModalPlaceholder: "Model, tính năng, giải pháp, tài liệu…",
  missing: "—",
  all: "Tất cả",
  clearFilters: "Xoá bộ lọc",
  compare: "So sánh",
  copied: "Đã copy vào clipboard",
};

export const SEARCH_GROUPS = ["Sản phẩm", "Giải pháp", "Tính năng AI", "Tài liệu"] as const;
export type SearchGroup = (typeof SEARCH_GROUPS)[number];
