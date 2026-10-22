"use client";

import { usePathname } from "next/navigation";

/** Ẩn header/footer ở trang đăng nhập; các trang khác giữ nguyên (layout vẫn sinh tĩnh). */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  return usePathname() === "/dang-nhap" ? null : children;
}
