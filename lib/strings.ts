// Chuỗi giao diện tiếng Việt dùng chung.
import type { DocStatus, DocType } from "@/lib/data/schema";

export const NAV = [
  { href: "/", label: "Tổng quan" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/giai-phap", label: "Giải pháp" },
  { href: "/thuat-toan-ai", label: "Tính năng AI" },
  { href: "/tai-lieu", label: "Tài liệu" },
  { href: "/so-sanh", label: "So sánh" },
  { href: "/ton-kho", label: "Tồn kho" },
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

/** Tồn kho (lib/inventory) */
export const INV = {
  title: "Tồn kho",
  status: { ok: "Còn hàng", low: "Sắp hết", out: "Hết hàng" },
  none: "Chưa có trong file tồn kho",
  notConfigured: "Chưa kết nối file tồn kho",
  loading: "Đang tải tồn kho…",
  failed: "Không tải được số tồn kho",
  stale: "Chưa đọc được file mới nhất, đang hiện số liệu lần đọc trước",
  updated: "Cập nhật",
  inStock: "Còn hàng",
  viewAll: "Xem bảng tồn kho",
};

/** Giờ Việt Nam: "10:32 22/10/2026" */
export const vnDateTime = (iso: string) =>
  new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })
    .format(new Date(iso))
    .replace(",", "");

/** Đăng nhập Google Workspace (auth.ts) */
export const AUTH = {
  title: "Đăng nhập",
  heading: "Đăng nhập để tra cứu",
  lead: "Cổng tra cứu nội bộ của MK Vision. Dùng tài khoản Google công ty (@mkvision.com) để tiếp tục.",
  button: "Đăng nhập bằng Google",
  redirecting: "Đang chuyển tới Google…",
  note: "Chỉ tài khoản @mkvision.com được truy cập. Phiên đăng nhập giữ 7 ngày trên trình duyệt này.",
  signOut: "Đăng xuất",
  signedInAs: "Đang đăng nhập",
  errors: {
    AccessDenied: "Tài khoản này không được phép truy cập. Chỉ tài khoản @mkvision.com đã xác minh mới đăng nhập được.",
    Configuration: "Đăng nhập chưa được cấu hình trên server (thiếu AUTH_SECRET / AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET). Liên hệ quản trị website.",
    Verification: "Liên kết đăng nhập đã hết hạn. Vui lòng thử lại.",
    Default: "Không đăng nhập được. Vui lòng thử lại hoặc liên hệ quản trị website.",
  } as Record<string, string>,
};

export const SEARCH_GROUPS = ["Sản phẩm", "Giải pháp", "Tính năng AI", "Tài liệu"] as const;
export type SearchGroup = (typeof SEARCH_GROUPS)[number];
