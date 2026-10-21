---
paths:
  - "app/**"
  - "components/**"
  - "public/img/**"
---

# Design

Tham khảo: https://www.hikvision.com/vn/ (bố cục, cỡ chữ, màu chữ, hiệu ứng; từ 21/10/2026). Màu nhấn vẫn là màu thương hiệu MK Vision (navy), không dùng đỏ Hikvision. Tối giản, hiện đại, chuyên nghiệp.

- **Bố cục**: hero tràn viền (không bo góc, không lề ngoài), ảnh tối; container `container-x` (max 1440px, gutter 16/24/30px). Section xen kẽ nền trắng và nền đen tràn viền (`bg-dark`). Tiêu đề section `heading-1` bên trái + `link-more` "Xem thêm →" bên phải (`section-head`).
- **Header**: `components/site-header.tsx`, gắn ở `app/layout.tsx`, cố định cao 76px. Trong suốt chữ trắng khi ở trên hero; cuộn xuống thì nền trắng, chữ `ink`, viền dưới mảnh. Mục menu `nav-link` có vạch navy chạy từ trái khi hover / trang hiện tại. Logo cao 36px trong pill trắng (giữ màu); ô tìm kiếm Ctrl K cao 53px, rộng 252px, chữ 16px. Hero mỗi trang chừa `pt` ≥ 124px cho header.
- **Card**: bo góc `rounded-xl2` 20px / `rounded-xl3` 24px, viền mảnh. Card ảnh `image-card`: ảnh tối, tiêu đề trắng đậm góc dưới; hover phóng ảnh và trượt mô tả lên (`reveal-more`).
- **Tab**: `tab-btn` + `tab-bar`: chữ đậm, vạch dưới mờ; tab đang chọn có vạch sáng, tự chuyển thì vạch chạy tiến trình (`data-progress`, `--tab-ms`). Đi kèm nút tròn `round-nav` và chấm chỉ báo. Tự chuyển dừng khi hover/focus và khi `prefers-reduced-motion`.
- **Nút / filter**: dạng pill. Nút chính `btn-primary` nền navy chữ trắng; trên nền tối dùng `btn-outline-light` (viền trắng); nút phụ `btn-ghost` viền mảnh.
- **Typography**: Open Sans (subset vietnamese) qua `next/font`. Chữ thân 16px, màu `ink` #333. Tiêu đề đậm (700), tracking gần 0: `heading-display`, `heading-1` (tới 48px), `heading-2`, `heading-3`. Nhãn `eyebrow` 15–16px. Model và thông số dùng `tabular-nums`.
- **Màu**: trắng / #333 / xám trung tính; footer xám đậm (`bg-footer`). Token trong `@theme` của `app/globals.css`: `brand-navy` #004C98 (màu nhấn), `brand-gold` #DEBB5C (điểm xuyết), `ink`, `muted`, `line`, `surface`, `dark`, `footer`... Không rải mã hex trong component.
- **Không dùng chấm màu trang trí** (trước nhãn, chip, card, danh sách). Trang chủ không có section "Mỗi con số đều có nguồn".
- **Chuyển động**: ngắn, mượt (phóng ảnh card, vạch menu/tab, fade nội dung tab, fade-in theo cuộn bằng CSS scroll-driven). Tôn trọng `prefers-reduced-motion`.
- **Mobile-first**: kiểm tra ở 375px. Bảng thông số trên mobile chuyển thành danh sách; không để cả trang cuộn ngang.
- **Tiếp cận**: tương phản WCAG AA, điều hướng bằng bàn phím (tab dùng phím ←/→), ảnh có `alt`, vùng chạm mobile ≥ 44px.
