import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { NextResponse } from "next/server";

/** Chỉ tài khoản Google Workspace của công ty được đăng nhập. */
export const ALLOWED_DOMAIN = process.env.AUTH_ALLOWED_DOMAIN || "mkvision.com";

/**
 * Tắt đăng nhập chỉ để chạy thử trên máy (AUTH_DISABLED=1). Không đặt biến này trên server thật:
 * thiếu cấu hình Google thì site vẫn khóa, không tự mở.
 */
export const AUTH_DISABLED = process.env.AUTH_DISABLED === "1";

/** Đường dẫn vào được khi chưa đăng nhập (ngoài các file đã loại trong matcher của proxy.ts) */
const PUBLIC_PATHS = ["/dang-nhap", "/api/auth"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true, // chạy sau reverse proxy nội bộ
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/dang-nhap", error: "/dang-nhap" },
  providers: [
    Google({
      // hd chỉ gợi ý tài khoản công ty ở màn chọn tài khoản; kiểm tra thật nằm ở callback signIn
      authorization: { params: { hd: ALLOWED_DOMAIN, prompt: "select_account" } },
    }),
  ],
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider !== "google" || !profile) return false;
      const email = (profile.email ?? "").toLowerCase();
      return profile.email_verified === true && profile.hd === ALLOWED_DOMAIN && email.endsWith(`@${ALLOWED_DOMAIN}`);
    },
    authorized({ auth, request }) {
      if (AUTH_DISABLED) return true;
      const { pathname } = request.nextUrl;
      if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
      if (auth?.user) return true;
      // API trả 401 JSON thay vì chuyển trang
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
      return false; // Auth.js chuyển sang /dang-nhap?callbackUrl=…
    },
  },
});
