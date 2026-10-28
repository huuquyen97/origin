---
paths:
  - "app/**"
  - "components/**"
  - "public/img/**"
---

# Design system

Phong cách tham khảo https://www.hikvision.com/vn/ (bố cục, cỡ chữ, màu chữ, hiệu ứng; áp dụng từ 21/10/2026), màu nhấn là navy thương hiệu MK Vision. Tối giản, hiện đại, chuyên nghiệp, ưu tiên đọc nhanh thông số. Token và class nằm trong `app/globals.css`.

## Guardrail (đọc trước)

- **Không rải mã hex trong component.** Dùng token `@theme` (`text-ink`, `bg-brand-navy`…). Màu mới → thêm token vào `globals.css`.
- **Không dùng đỏ Hikvision** làm màu nhấn. Nhấn = `brand-navy` #004C98; điểm xuyết = `brand-gold` #DEBB5C. `danger` chỉ cho lỗi / Hết hạn / Hết hàng.
- **Không chấm màu trang trí** trước nhãn, chip, card, danh sách. Trang chủ không có section "Mỗi con số đều có nguồn" (nguồn ghi ở `sub` từng số liệu).
- **Vùng chạm ≥ 44px** trên mobile (`min-h-11`). `.btn`, `.pill`, `.link-more` đã có sẵn; nút icon tự làm phải tự đặt `size-11`.
- **Không cuộn ngang cả trang ở 375px.** Vùng cuộn ngang nằm trong grid/flex phải có `min-w-0` hoặc `grid-cols-[minmax(0,1fr)]`.
- **Tương phản WCAG AA.** Chữ trên ảnh phải có lớp `shade-*`. Chữ phụ tối thiểu `text-muted` (#666) trên nền trắng.
- **Tôn trọng `prefers-reduced-motion`** (đã tắt animation toàn cục trong `globals.css`; tự chạy carousel / tab phải dừng).
- **Hero mỗi trang chừa `pt` ≥ 124px** cho header cố định 76px.
- **Không dùng ảnh gốc nhiều MB.** Ảnh web đã tối ưu, đổi ảnh thì đổi tên file.
- **Không đặt tên class trùng utility Tailwind** (`h-1`, `h-2`…): dùng `heading-*`, `tag-*`.

## Màu (token `@theme`)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `brand-navy` | #004c98 | Nút chính, vạch menu / tab, link nhấn, focus ring |
| `brand-navy-600` | #003d7a | Hover nút chính |
| `brand-navy-50` | #eef4fb | Nền tag navy, thẻ link nhẹ, check-list |
| `brand-gold` | #debb5c | Điểm xuyết, vạch nhấn trái, `mark` tìm kiếm |
| `brand-gold-50` | #fbf6e8 | Nền cảnh báo / Bản cũ |
| `brand-gold-700` | #7a5a12 | Chữ cảnh báo (đạt AA trên gold-50) |
| `danger` / `danger-50` | #b42318 / #fdeceb | Hết hạn, Hết hàng, lỗi |
| `ok` / `ok-50` | #1f6b45 / #e8f4ee | Gửi khách được, Còn hàng |
| `ink` | #333333 | Chữ chính |
| `ink-2` | #46454a | Chữ phụ đậm, tag, nền Nội bộ |
| `muted` | #666666 | Mô tả, lead, nhãn bộ lọc |
| `faint` | #8a8a8a | Số đếm, chú thích rất phụ (không dùng cho nội dung chính) |
| `line` / `line-2` | #e8e8e8 / #d6d6d6 | Viền mảnh / viền hover |
| `surface` / `surface-2` | #f5f6f8 / #eceef2 | Nền section xám, header bảng, tag |
| `dark` | #0b0b0d | Hero, section tối, card ảnh |
| `footer` | #4a4a4f | Footer |

- Màu loại file (`.doc-ic[data-ext]`): pdf đỏ, pptx cam, docx xanh, xlsx xanh lá, ảnh tím, mp4 xám — ngoại lệ duy nhất có hex trong CSS.

## Typography

- Font: Open Sans (subset `vietnamese`) qua `next/font`; fallback system-ui.
- Chữ thân 16px, `line-height` 1.6, màu `ink`. Tiêu đề đậm 700, tracking âm nhẹ, `line-height` 1.15–1.25.

| Class | Cỡ | Dùng |
|---|---|---|
| `heading-display` | clamp(34px, 4.4vw, 56px) | Tiêu đề hero trang chủ |
| `heading-1` | clamp(30px, 3.4vw, 48px) | Tiêu đề hero trang con, tiêu đề section trang chủ |
| `heading-2` | clamp(26px, 2.8vw, 40px) | Tiêu đề section trang con |
| `heading-3` | clamp(22px, 2.2vw, 32px) | Tiêu đề khối |
| `lead` | clamp(16px, 1.3vw, 18px), max 60ch, `muted` | Đoạn mở đầu |
| `eyebrow` | 15–16px, 500, `ink-2` | Nhãn trên tiêu đề (`eyebrow-dark` trên nền tối) |
| `h3` thường | `text-lg` | Tiêu đề mục trong trang chi tiết |

- Model, số liệu, thông số: `tabular-nums`.
- Độ dài dòng: lead ≤ 60ch, tiêu đề hero ≤ 18–22ch (`max-w-[22ch]`).
- Không dùng chữ in hoa toàn bộ cho câu tiếng Việt (khó đọc dấu); eyebrow giữ chữ thường.

## Bố cục

- Container: `container-x` = max 1440px, gutter 16 / 24 / 30px (mobile / md / lg).
- Hero tràn viền, không bo góc, không lề ngoài, ảnh tối + `shade-*`.
- Section xen kẽ nền trắng và `bg-dark` (hoặc `bg-surface`) tràn viền; khoảng dọc `py-12 md:py-14` (trang con), lớn hơn ở trang chủ.
- Tiêu đề section: `.section-head` = `heading-1`/`heading-2` bên trái + `.link-more` "Xem thêm →" bên phải.
- Lưới: `grid gap-5`/`gap-6`; 2 cột từ `lg` cho nội dung chữ + danh sách (`lg:grid-cols-2 lg:gap-16`).
- Mobile-first: viết class mặc định cho 375px rồi thêm `md:` / `lg:`.

## Header

- `components/site-header.tsx`, gắn ở layout, `fixed`, cao 76px, `z-50`.
- Trên hero: nền gradient đen mờ, chữ trắng. Cuộn > 24px hoặc mở menu: nền trắng, chữ `ink`, viền dưới 1px `line`.
- Logo cao 36px trong pill trắng (giữ màu thương hiệu trên nền tối).
- Menu `nav-link`: chữ 15px đậm, vạch navy 3px chạy từ trái khi hover / `aria-current="page"`.
- Ô tìm kiếm Ctrl K: cao 53px, rộng 252px, chữ 16px từ `xl`; 1024–1279px thu thành nút tròn; dưới `lg` dùng menu hamburger.
- Header nằm ở layout (không trong hero) vì hero có `isolate` sẽ bị nội dung phía dưới đè khi cuộn.

## Hero

- `PageHero` (`components/hero.tsx`): `shade-compact`, ảnh `fill` `priority` `sizes="100vw"`, breadcrumb (Tổng quan / …), eyebrow, `heading-1`, lead.
- `pt-[124px] md:pt-[148px]`, `pb-12 md:pb-16`.
- Ảnh hero: `public/img/scenes/*` hoặc `cover/*`, đủ tối hoặc có lớp phủ; chủ thể lệch phải để không bị tiêu đề che (dùng `object-[x%_center]`).

## Lớp phủ ảnh (`shade-*`)

| Class | Hướng | Dùng |
|---|---|---|
| `shade-hero` | Trái→phải + dưới lên | Hero trang chủ |
| `shade-compact` | Trái→phải đậm | Hero trang con |
| `shade-bottom` | Dưới lên | Card / banner chữ ở đáy |
| `shade-panel` | Dưới lên rất đậm | Panel chữ dài trên ảnh |
| `shade-feature` | Trên-dưới xanh navy | Banner điểm nhấn |
| `shade-product` | Dưới lên trắng | Ảnh sản phẩm nền sáng |
| `cta-glow` | Tỏa navy từ trên | CTA tối |

- Tất cả dùng `::after` `z-index:-1`; phần tử cha cần `relative isolate`, ảnh `-z-20`.

## Card

- `.card`: bo `rounded-xl2` (20px), viền `line`, nền trắng; `.card-link` hover nhấc 3px + bóng `shadow-soft`.
- `rounded-xl3` (24px) cho khối lớn.
- `.image-card`: ảnh tối, tiêu đề trắng đậm góc dưới; hover phóng ảnh 1.06 và trượt `.reveal-more` lên; thiết bị không hover thì hiện sẵn.
- `ProductCard`: ảnh sản phẩm (`ProductMedia`), model đậm `tabular-nums`, tên, tag thông số chính, nút so sánh, `StockBadge`.
- Card không lồng card. Không dùng bóng đậm; viền mảnh là chính.

## Nút

| Class | Dùng |
|---|---|
| `.btn .btn-primary` | Hành động chính (navy) — tối đa 1 nút chính mỗi khối |
| `.btn .btn-ghost` | Hành động phụ (viền mảnh) |
| `.btn .btn-dark` | Nút đậm trên nền sáng |
| `.btn .btn-outline-light` | Trên nền tối (viền trắng) |
| `.btn .btn-light` | Nút trắng trên nền tối |
| `.btn .btn-glass` | Trên ảnh (mờ kính) |
| `.btn-sm` | Nút nhỏ (vẫn 44px trên mobile, 40px từ `md`) |

- Tất cả dạng pill (`rounded-full`), chữ 15px đậm, icon 16px bên trái hoặc mũi tên bên phải.
- `.link-more`: liên kết chữ + mũi tên trượt khi hover.

## Pill (bộ lọc / chip)

- `.pill` cao 44px mobile / 36px desktop, viền `line`; đang chọn: `aria-pressed="true"` hoặc `.is-active` → nền `ink` chữ trắng.
- Số đếm `.count` 11.5px `faint`; số 0 → `disabled` (trừ khi đang chọn).
- Chip xuống dòng (`flex-wrap`), không cuộn ngang trên mobile.
- Nhãn nhóm bộ lọc: 13px đậm `muted`, `w-full md:w-28`.

## Tag và trạng thái

| Class | Ý nghĩa |
|---|---|
| `.tag` | Nhãn trung tính (xám) |
| `.tag-navy` | Series, loại, thông tin nhấn |
| `.tag-dark` | Trên ảnh tối |
| `.tag-ok` | Gửi khách được, Còn hàng |
| `.tag-warn` | Bản cũ, Sắp hết, xung đột series |
| `.tag-danger` | Hết hạn, Hết hàng |
| `.tag-internal` | Nội bộ |

- Map trạng thái tài liệu → class qua `DOC_STATUS` (`lib/strings.ts`), không viết class tay.

## Cảnh báo dữ liệu

- `.unconfirmed`: icon tròn vàng 20px cạnh ô thông số chưa chốt; ghi chú hiện khi hover / focus (`title` + `sr-only`).
- `.note-warn`: hộp vàng bo 16px, icon `AlertTriangle` / `Info` + nội dung; dùng cho xung đột ảnh / danh mục / kịch bản định hướng.
- Cảnh báo phải có hành động ("Cần PM xác nhận trước khi báo khách").
- Không dùng màu đỏ cho cảnh báo dữ liệu (đỏ = lỗi / hết hạn).

## Tab và carousel

- `.tab-btn` + `.tab-bar`: chữ đậm, vạch dưới mờ; đang chọn vạch sáng; tự chuyển thì `data-progress="true"` chạy vạch theo `--tab-ms` (mặc định 7000ms).
- `.tab-fade` khi đổi nội dung tab.
- `.round-nav`: nút tròn 48px trước / sau; kèm chấm chỉ báo.
- Tự chuyển dừng khi hover / focus và khi `prefers-reduced-motion`.
- Bàn phím: `role="tablist"`, ←/→ đổi tab, `aria-selected`.

## Bảng và danh sách

- Desktop: bảng `rounded-xl2 border`, header `bg-surface` chữ 13px `muted`, hàng `border-t line`, ô `px-4 py-3`, bọc `overflow-x-auto`.
- Mobile: bảng chuyển thành danh sách thẻ (`md:hidden` / `hidden md:block`).
- Bảng thông số: nhãn trái `muted`, giá trị phải `ink`; ô thiếu "—" (`T.missing`), không ẩn hàng.
- So sánh: tô dòng khác nhau, tuỳ chọn "chỉ dòng khác nhau".
- `.check-list`: danh sách có dấu tick navy (điểm nổi bật, lợi ích).
- `% làm chủ` dùng thanh `role="meter"` + `aria-valuenow`, nhãn `whitespace-nowrap`.

## Icon

- Chỉ `lucide-react`; cỡ 16px trong nút, 17–20px trong ô nhập, 14px trong `.unconfirmed`.
- Icon trang trí `aria-hidden`; icon đứng một mình (nút) phải có `aria-label`.
- Biểu tượng file dùng `.doc-ic` (chữ đuôi file), không dùng icon lucide.

## Ảnh

| Thư mục | Nội dung | Giới hạn |
|---|---|---|
| `public/img/products/<slug>.png` | Ảnh sản phẩm nền trong / trắng | ≤ ~600KB |
| `public/img/scenes/` | Ảnh hero, banner | jpg/png tối ưu |
| `public/img/solutions/` | Ảnh / sơ đồ giải pháp | |
| `public/img/profile/` | Ảnh cắt từ hồ sơ năng lực | webp |
| `public/img/cover/` | Ảnh nền đăng nhập / trang chủ (`login-bg.jpg`, `home-cover-2.jpg`) | ~100–150KB |

- Dùng `next/image` (`fill` + `sizes` hoặc `width`/`height`); `priority` chỉ cho ảnh hero.
- `<img>` thường chỉ ở 6 chỗ đã có cảnh báo lint (ảnh tỉ lệ tự do / lightbox); không thêm chỗ mới.
- `alt` mô tả nội dung; ảnh trang trí `alt=""`.
- Ảnh sơ đồ / chú thích: `object-contain` (không cắt chữ); ảnh cảnh: `object-cover`.
- Đổi ảnh → đặt tên file mới (VD `home-cover-2.jpg`), rebuild.
- Không dùng ảnh có logo / áo thương hiệu khác cho sản phẩm MK Vision (VD áo "pavana").

## Chuyển động

- Ngắn, mượt, easing `--ease-soft` cubic-bezier(0.2, 0.7, 0.2, 1).
- Có sẵn: phóng ảnh card (0.6s), vạch menu / tab (0.3–0.35s), fade nội dung tab (0.5s), `.reveal` fade-in theo cuộn (CSS scroll-driven, trình duyệt không hỗ trợ thì hiện ngay).
- Không thêm thư viện animation. Không parallax, không auto-play video.

## Tiếp cận (a11y)

- Focus ring toàn cục: viền navy 2px, offset 2px (`:focus-visible`).
- Điều hướng bàn phím đầy đủ: lightbox đóng bằng Esc và trả focus về nút mở; hotspot ảnh có danh sách tình huống tương đương cho bàn phím / mobile.
- `aria-live="polite"` cho số kết quả lọc.
- `aria-pressed` cho pill, `aria-current` cho menu, `aria-selected` cho tab.
- Nút chỉ có icon: `aria-label`; trạng thái chỉ bằng màu → kèm chữ (VD "Còn hàng").
- Ngôn ngữ `lang="vi"`; thuật ngữ tiếng Anh không cần `lang` riêng.

## Mẫu giao diện chuẩn

- **Trang danh sách**: `PageHero` → (thẻ link phụ) → ô lọc chữ → pill nhu cầu → lọc chi tiết → "N / M kết quả" → lưới card → trống: hộp `bg-surface` căn giữa `muted`.
- **Trang chi tiết**: hero + ảnh → thông số chính → hàng nút hành động → các mục `h3` → khối "Cùng dòng".
- **Khối nguồn**: chữ 13px `muted` cuối khối/trang ("Nguồn: …"), không link tới tài liệu `NOT_PUBLISHED`.
- **CTA cuối trang**: `border-t line pt-8` + 1–2 nút; hoặc section tối `cta-glow` ở trang chủ.

## Thêm thành phần mới — checklist

1. Tìm class / component có sẵn trước (`.card`, `.pill`, `.tag-*`, `.note-warn`, `PageHero`, `Shots`).
2. Class tái dùng ≥ 2 chỗ → thêm vào `@layer components` của `globals.css` với comment ngắn tiếng Việt.
3. Kiểm 375px (chạm 44px, không tràn), 1024px, 1440px.
4. Kiểm bàn phím + `prefers-reduced-motion`.
5. Chụp screenshot, mở ảnh xem trước khi báo xong.
