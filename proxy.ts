// Mọi trang, tài liệu /files và chỉ mục tìm kiếm đều cần đăng nhập; quyết định nằm ở callbacks.authorized (auth.ts).
export { auth as proxy } from "@/auth";

export const config = {
  // Bỏ qua file build của Next, logo và ảnh giao diện (trang đăng nhập cần dùng)
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|img/).*)"],
};
