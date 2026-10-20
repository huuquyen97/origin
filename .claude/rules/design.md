---
paths:
  - "app/**"
  - "components/**"
  - "public/img/**"
---

# Design

Tham khảo: `Data/Design/godly.design_website_primefold_.png` (phong cách Primefold). Tối giản, hiện đại, chuyên nghiệp.

- **Bố cục**: nền trắng, khoảng trắng rộng, container `container-x` (max 1200px + gutter 16/24/32px). Hero mỗi trang là ảnh tối bo góc lớn, nav nằm trong hero; logo đặt trong pill trắng để giữ nguyên màu.
- **Card**: bo góc lớn (`rounded-xl2` 22px, `rounded-xl3` 28px), viền mảnh, không đổ bóng nặng; card nổi bật dùng ảnh tối với chữ trắng.
- **Nút / filter**: dạng pill. Nút chính nền tối chữ trắng, nút phụ viền mảnh.
- **Typography**: Inter (subset vietnamese) qua `next/font`. Tiêu đề lớn, tracking âm: `heading-display`, `heading-1`, `heading-2`. Nhãn trên tiêu đề `eyebrow` cỡ 15–16px, màu `ink-2`. Model và thông số dùng `tabular-nums`.
- **Màu**: trắng / đen / xám trung tính. Token khai báo trong `@theme` của `app/globals.css` (Tailwind v4): `brand-navy` #004C98 (màu nhấn chính), `brand-gold` #DEBB5C (điểm xuyết), `ink`, `muted`, `line`, `surface`, `dark`... Không rải mã hex trong component.
- **Không dùng chấm màu trang trí** (trước nhãn, chip, card, danh sách). Trang chủ không có section "Mỗi con số đều có nguồn".
- **Chuyển động**: nhẹ, ngắn (hover nâng card, fade-in theo cuộn bằng CSS scroll-driven). Tôn trọng `prefers-reduced-motion`.
- **Mobile-first**: kiểm tra ở 375px. Bảng thông số trên mobile chuyển thành danh sách; không để cả trang cuộn ngang.
- **Tiếp cận**: tương phản WCAG AA, điều hướng bằng bàn phím, ảnh có `alt`, vùng chạm mobile ≥ 44px.
