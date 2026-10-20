---
paths:
  - "app/**/*.{ts,tsx,css}"
  - "components/**/*.{ts,tsx}"
  - "lib/**/*.{ts,tsx,mjs}"
---

# Quy ước code frontend

- Cấu trúc: `app/` routes; `components/` UI (theo trang: `home/`, `products/`, `solutions/`, `docs/`, `ai/`); `lib/data/` dữ liệu; `lib/search/` chuẩn hoá tiếng Việt + chỉ mục; `lib/strings.ts` chuỗi giao diện.
- Chuỗi giao diện tiếng Việt đặt tập trung ở `lib/strings.ts`, không rải trong logic. Thuật ngữ kỹ thuật giữ tiếng Anh.
- Mặc định Server Components; `"use client"` chỉ cho phần tương tác (tìm kiếm, bộ lọc, so sánh, slider).
- Client component không import `lib/data` (có `server-only`) ngoài `import type`. Truyền dữ liệu rút gọn qua props.
- Trang dùng `useSearchParams` phải bọc `<Suspense fallback={<XView initial={{}} … />}>` để HTML tĩnh có sẵn danh sách (không để trang trắng khi chưa chạy JS).
- Không đặt tên class thành phần trùng utility Tailwind (VD: `h-1`, `h-2` là chiều cao) — dùng tiền tố rõ nghĩa (`heading-*`).
- Grid/flex chứa vùng cuộn ngang cần `grid-cols-[minmax(0,1fr)]` hoặc `min-w-0` để không đẩy tràn trang.
- State lưu trình duyệt (danh sách so sánh) đọc qua `useSyncExternalStore`, không `setState` trong `useEffect`.
- Next.js 16: `params` là Promise (`const { slug } = await params`); route động dùng `generateStaticParams`.
- URL tiếng Việt không dấu, kebab-case: `/san-pham/[slug]`, `/giai-phap/[slug]`, `/tai-lieu`, `/so-sanh`, `/thuat-toan-ai`.
