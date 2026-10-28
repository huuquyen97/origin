---
paths:
  - "app/**"
  - "components/**"
  - "lib/search/**"
  - "lib/strings.ts"
---

# Cấu trúc website

Bản đồ route, nội dung từng trang, tham số URL, thành phần dùng chung và chỉ mục tìm kiếm. Thêm / đổi trang phải cập nhật file này.

## Guardrail

- **Mọi trang sinh tĩnh.** Route động `[slug]` phải có `generateStaticParams`. Không đọc cookie / header / session phía server trong trang.
- **Trang cần đăng nhập trừ `/dang-nhap`.** Đường dẫn công khai mới phải thêm vào `PUBLIC_PATHS` (`auth.ts`) và hỏi người dùng trước.
- **Menu tối đa 8 mục** (`NAV` trong `lib/strings.ts`). Thêm mục thứ 9 → kiểm 1024px và 1280px, ưu tiên đặt ở footer hoặc trang con.
- **URL tiếng Việt không dấu, kebab-case.** Không đổi URL đã có (Sales đã lưu / chia sẻ link); nếu buộc đổi thì thêm redirect.
- **Trạng thái lọc lưu trên URL** (`router.replace`, `scroll: false`) để link chia sẻ được.
- **Trang dùng `useSearchParams` phải có `<Suspense fallback={<XView …/>}>`** để HTML tĩnh có nội dung khi chưa chạy JS.
- **Tài liệu `NOT_PUBLISHED` không được xuất hiện** ở thư viện, tìm kiếm, link tải.

## Bản đồ route

| Route | File | Menu | Loại | Nguồn dữ liệu |
|---|---|---|---|---|
| `/` | `app/page.tsx` | Tổng quan | Tĩnh | `home.json`, series, solutions, products, capability |
| `/san-pham` | `app/san-pham/page.tsx` | Sản phẩm | Tĩnh + client lọc | products, series, features |
| `/san-pham/danh-muc` | `app/san-pham/danh-muc/page.tsx` | (link từ Sản phẩm) | Tĩnh + client lọc | `catalog.json` |
| `/san-pham/[slug]` | `app/san-pham/[slug]/page.tsx` | — | SSG 24 trang | product, catalog, feature-shots, solutions |
| `/so-sanh` | `app/so-sanh/page.tsx` | So sánh | Tĩnh + localStorage | products |
| `/giai-phap` | `app/giai-phap/page.tsx` | Giải pháp | Tĩnh + client lọc | solutions, scenarios |
| `/giai-phap/[slug]` | `app/giai-phap/[slug]/page.tsx` | — | SSG 17 trang | solution, scenarios |
| `/thuat-toan-ai` | `app/thuat-toan-ai/page.tsx` | Tính năng AI | Tĩnh + client lọc | features, algorithms |
| `/tai-lieu` | `app/tai-lieu/page.tsx` | Tài liệu | Tĩnh + client lọc | documents |
| `/ton-kho` | `app/ton-kho/page.tsx` | Tồn kho | Tĩnh + fetch API | `/api/ton-kho` |
| `/nang-luc` | `app/nang-luc/page.tsx` | Năng lực | Tĩnh | `capability.json` |
| `/dang-nhap` | `app/dang-nhap/page.tsx` | — (ẩn header/footer) | Tĩnh, công khai | — |
| `/search-index.json` | `app/search-index.json/route.ts` | — | Route tĩnh | `buildSearchIndex()` |
| `/api/auth/*` | `app/api/auth/[...nextauth]` | — | Động | Auth.js |
| `/api/ton-kho` | `app/api/ton-kho/route.ts` | — | Động, `force-dynamic` | Google Sheet |
| `/files/*` | `public/files/` (sinh lúc build) | — | File tĩnh, cần đăng nhập | `Data/MK Vision` |
| `/img/*`, `/brand/*` | `public/` | — | File tĩnh, **không** cần đăng nhập | — |

## Tham số URL

| Trang | Tham số | Ý nghĩa |
|---|---|---|
| `/` | `#tim=<từ khoá>` | Mở hộp tìm kiếm với từ khoá (link chia sẻ) |
| `/san-pham` | `series`, `category`, `res`, `ai`, `need` (nhiều giá trị, phẩy), `stock=1`, `q` | Bộ lọc |
| `/san-pham/danh-muc` | `q` | Lọc sẵn model (link từ tìm kiếm) |
| `/so-sanh` | `ids=a,b,c` | Link chia sẻ, không ghi đè danh sách riêng |
| `/so-sanh` | `add=<slug>` | Thêm model vào danh sách riêng |
| `/giai-phap` | `industry`, `kb=<id kịch bản>` + `#kich-ban` | Lọc ngành / mở kịch bản |
| `/thuat-toan-ai` | `q`, `#<feature-id>` | Lọc / nhảy tới tính năng |
| `/tai-lieu` | `status`, `type`, `topic` | Bộ lọc thư viện |
| `/dang-nhap` | `callbackUrl`, `error` | Quay lại sau đăng nhập / thông báo lỗi Auth.js |

- `need`: `lpr`, `face`, `poe`, `ndaa`, `outdoor` (định nghĩa ở `NEEDS`, `lib/labels.ts`).
- Đổi tên tham số = gãy link cũ: không đổi khi không cần.

## Layout chung (`app/layout.tsx`)

- `<html lang="vi">`, font Open Sans (`latin` + `vietnamese`) qua `next/font`, biến `--font-open-sans`.
- `SessionProvider` bọc toàn bộ; `ChromeGate` ẩn `SiteHeader` / `SiteFooter` ở `/dang-nhap`.
- `SearchDialog` (gợi ý từ `home.json.searchSuggestions`) và `Toaster` gắn một lần ở layout.
- Metadata: title template `%s · MK Vision`, `robots: noindex, nofollow`, icon `/brand/mk-vision.png`.
- Header cố định 76px → nội dung đầu trang phải chừa `pt` ≥ 124px (hero) hoặc có `PageHero`.

## Nội dung từng trang

### `/` Tổng quan
- Hero tràn viền ảnh `home-cover-2.jpg`, tiêu đề `heading-display`, ô tìm kiếm lớn (`HeroSearch`), lối tắt theo dòng.
- `Explorer`: chọn dòng sản phẩm (tab).
- Giải pháp theo ngành: 3 giải pháp đầu theo `order`.
- `FeatureSlider`: banner điểm nhấn từ `home.json.features`.
- `ProductCarousel`: `home.json.featuredProducts`.
- Năng lực MK Vision: bento 4 số liệu `home.json.stats` (có `sub` ghi nguồn) + link `/nang-luc`.
- CTA tối cuối trang.

### `/san-pham`
- `PageHero`, thẻ link sang danh mục 27 model.
- `ProductBrowser`: ô lọc chữ, nhu cầu nhanh, "Còn hàng" (khi có tồn kho), lọc chi tiết (dòng, loại, độ phân giải, tính năng AI), số đếm theo các bộ lọc khác, mobile thu gọn lọc chi tiết, chọn tối đa 4 để so sánh.

### `/san-pham/danh-muc`
- Thẻ series A / B / E / S / K, `CatalogTable` (bảng desktop, thẻ mobile), cảnh báo model V-Secure trên web không có trong danh mục, "Thiết kế tiêu biểu" (ảnh), dòng nguồn.
- Model trùng tên → link trang chi tiết; cảnh báo vàng khi series A nhưng datasheet có AI.

### `/san-pham/[slug]`
- Hero + ảnh sản phẩm, thông số chính theo loại (`keySpecs`, `kindOf`: camera / switch / ap / nvr), nhãn series danh mục.
- Nút: Datasheet (ưu tiên Gửi khách được + PDF), copy thông số, copy rút gọn (Zalo), copy link, so sánh (`/so-sanh?add=`).
- `StockPanel` (khi có tồn kho).
- Mục: Điểm nổi bật · Chú thích tính năng (`Shots` + cảnh báo lệch) · Tính năng AI (link `/thuat-toan-ai#id`) · Thông số kỹ thuật theo nhóm (cảnh báo "Chưa chốt" tại ô) · Tài liệu (nhãn trạng thái) · Giải pháp liên quan · Cùng dòng.

### `/so-sanh`
- 2–4 model, nhãn thông số chuẩn hoá (`specLabel`) để xếp cùng hàng, tô dòng khác nhau, "chỉ dòng khác nhau", hàng Tồn kho, copy bảng (Excel / email), CSV, copy rút gọn Zalo.

### `/giai-phap`
- `SolutionsBrowser` lọc theo ngành; mục `#kich-ban` có `ScenarioExplorer` 8 kịch bản (tab).

### `/giai-phap/[slug]`
- Bài toán, kiến trúc, phân hệ, tính năng, lợi ích, cấu hình đề xuất, hình ảnh / sơ đồ (`Shots`), sản phẩm đề xuất, `DocKit` (gửi bộ tài liệu, chỉ Gửi khách được), kịch bản ngành liên kết (`ScenarioExplorerView tabs={false}`), nguồn.

### `/thuat-toan-ai`
- `AiBrowser`: 28 tính năng chuẩn, model hỗ trợ, mô tả từ `algorithms.json` (12), anchor `#id`.

### `/tai-lieu`
- `DocsBrowser`: lọc trạng thái / loại / chủ đề, `DocRow` có icon theo đuôi file, nhãn trạng thái, hiệu lực (`validFrom` / `validTo`).

### `/ton-kho`
- `InventoryTable`: model, số tồn, trạng thái (Còn hàng / Sắp hết / Hết hàng / Chưa có số liệu), theo kho, dòng model không khớp, thời điểm cập nhật. Không hiện dòng mô tả nguồn và lỗi đọc file (lỗi chỉ ghi log server).

### `/nang-luc`
- Edge AI (2 cột chữ), Làm chủ công nghệ (4 trụ), 8 công nghệ lõi + % làm chủ (`role="meter"`), quy trình R&D (Concept → EVT → DVT → PVT → MP), sản xuất (PCBA, lắp ráp), phòng sạch + QC, CTA "Danh mục model" / "Kịch bản ứng dụng".
- **Không** hiện tham chiếu "Hồ sơ năng lực 2026" / số trang.

### `/dang-nhap`
- Ảnh nền `login-bg.jpg`, `LoginCard` (nút Google, lỗi theo `AUTH.errors`), không header / footer.

## Thành phần dùng chung

| Thành phần | File | Dùng ở |
|---|---|---|
| `SiteHeader` | `components/site-header.tsx` | Layout; trong suốt trên hero, nền trắng khi cuộn > 24px |
| `SiteFooter` | `components/site-footer.tsx` | Layout |
| `PageHero` | `components/hero.tsx` | Mọi trang con (crumbs, eyebrow, title, lead) |
| `SearchDialog`, `openSearch()` | `components/search-dialog.tsx` | Layout, nút tìm kiếm |
| `OpenSearchButton` | `components/open-search-button.tsx` | Header, trang chủ |
| `Toaster`, toast | `components/toast.tsx` | Thông báo copy |
| `ProductCard`, `ProductMedia` | `components/cards.tsx` | Danh sách, carousel, cùng dòng |
| `SolutionCard` | `components/cards.tsx` | Trang chủ, giải pháp |
| `DocRow`, `DocStatusTag`, `DocIcon` | `components/cards.tsx` | Tài liệu, chi tiết |
| `StockBadge`, `StockPanel` | `components/inventory/stock.tsx` | Thẻ sản phẩm, chi tiết |
| `useInventory()` | `components/inventory/use-inventory.ts` | Mọi chỗ cần tồn kho (một request dùng chung) |
| `useCompare()` | `components/products/compare-store.ts` | Nút so sánh, trang so sánh |
| `Shots` | `components/solutions/shots.tsx` | Ảnh + lightbox (Esc, nút Đóng 44px) |
| `ScenarioExplorer(View)` | `components/solutions/scenario-explorer.tsx` | Giải pháp |
| `UserMenu` | `components/auth/user-menu.tsx` | Header (Đăng xuất) |

## Tìm kiếm toàn cục

- Mở bằng `Ctrl+K` hoặc `/`; link chia sẻ `/#tim=tu-khoa`.
- Chỉ mục `/search-index.json` sinh lúc build (`lib/search/build-index.ts`), client tải một lần khi mở hộp.
- Nhóm kết quả: Sản phẩm, Giải pháp, Tính năng AI, Tài liệu (`SEARCH_GROUPS`).
- Mỗi mục có trường chuẩn hoá bỏ dấu: `nt` (tiêu đề), `nk` (từ khoá), `nx` (nội dung), `nm` (model chỉ chữ + số).
- Xếp hạng (`lib/search/rank.ts`): khớp model đứng đầu → mọi cụm từ phải có mặt (AND), có từ đồng nghĩa (khuôn mặt = face, biển số = LPR / ANPR…) → Fuse chỉ khi 0 kết quả (bắt lỗi gõ).
- Chỉ mục gồm: 24 sản phẩm, model danh mục chưa có trang (→ `/san-pham/danh-muc?q=`), giải pháp, kịch bản (→ `/giai-phap?kb=id#kich-ban`), trang Năng lực, tính năng AI, tài liệu (trừ `NOT_PUBLISHED`).
- Thêm loại nội dung mới → thêm vào `buildSearchIndex()`, kiểm truy vấn mẫu không làm lệch kết quả cũ (VD "đếm người" không ra switch).

## Liên kết chéo bắt buộc

- Sản phẩm ↔ giải pháp: hai chiều, khai báo một phía.
- Tính năng AI trên trang sản phẩm / kịch bản → `/thuat-toan-ai#<id>`.
- Danh mục ↔ sản phẩm: chỉ khi `modelKey` trùng.
- Kịch bản → giải pháp: chỉ khi `scenario.solution` có giá trị; ở chính trang giải pháp đó không hiện nút tự trỏ.
- Trang Năng lực ↔ trang chủ: số liệu trang chủ lấy cùng nguồn.
- Footer: Danh mục model, Năng lực MK Vision, Kịch bản ứng dụng, Slide hồ sơ năng lực.

## Thêm trang mới — checklist

1. Tạo `app/<duong-dan>/page.tsx` (Server Component), `export const metadata = { title }`.
2. Dùng `PageHero` (ảnh tối trong `public/img/scenes/` hoặc `cover/`).
3. Dữ liệu qua `lib/data` (thêm schema + loader nếu là file mới trong `Data/Site/`).
4. Phần tương tác tách `components/<nhóm>/<ten>.tsx` (`"use client"`), cặp `X` + `XView` nếu đọc URL.
5. Chuỗi giao diện vào `lib/strings.ts`.
6. Menu: thêm vào `NAV` chỉ khi người dùng đồng ý; nếu không, link từ trang liên quan + footer.
7. Tìm kiếm: thêm mục vào `buildSearchIndex()`.
8. Cập nhật file này, `CLAUDE.md` (số trang), chạy lint → build → screenshot 1440 / 375.

## Thêm route API mới — checklist

1. `app/api/<ten>/route.ts`, `export const dynamic = "force-dynamic"` nếu đọc dữ liệu lúc chạy.
2. Proxy đã bắt đăng nhập (401 JSON); không tự kiểm lại session trừ khi cần email người dùng.
3. Đọc `lib/data` → thêm route vào `outputFileTracingIncludes` (`next.config.ts`).
4. Header cache: dữ liệu theo người dùng → `private`; không cache lỗi.
5. Log lỗi có tiền tố `[ten-route]`, không log nội dung người dùng nhập.
6. Kiểm chưa đăng nhập → 401, đã đăng nhập (`AUTH_DISABLED=1`) → 200.

## Trang lỗi

- `app/not-found.tsx`: 404 chung (slug sai, tài liệu `NOT_PUBLISHED`).
- Slug không tồn tại trong trang động → `notFound()`.
- Lỗi đăng nhập → `/dang-nhap?error=<Mã>`, thông báo từ `AUTH.errors`.
- Tồn kho lỗi → ẩn / hiện số liệu lần trước kèm `INV.stale`, không làm sập trang.

## Ảnh hero theo trang

| Trang | Ảnh |
|---|---|
| `/` | `/img/cover/home-cover-2.jpg` (`object-[78%_center]`) |
| `/dang-nhap` | `/img/cover/login-bg.jpg` |
| `/san-pham`, `/so-sanh`, chi tiết sản phẩm, 404 | `/img/scenes/products.jpg` |
| `/ton-kho` | `/img/scenes/control-room-1.jpg` |
| `/san-pham/danh-muc` | `/img/scenes/vsecure-1.jpg` |
| `/giai-phap` | `/img/scenes/solutions.jpg` |
| `/thuat-toan-ai` | `/img/scenes/ai.jpg` |
| `/tai-lieu` | `/img/scenes/docs.jpg` |
| `/nang-luc` | `/img/scenes/rnd-1.jpg` |
| Giải pháp chi tiết | `cover` của giải pháp (mặc định `/img/scenes/solutions.jpg`) |

- Đổi ảnh hero → kiểm chữ trắng đọc được (lớp `shade-*`) và chủ thể không bị tiêu đề che ở 375px.

## Breakpoint kiểm tra

| Bề rộng | Điểm cần xem |
|---|---|
| 375px | Không cuộn ngang, menu hamburger, bảng → thẻ, bộ lọc thu gọn, nút ≥ 44px |
| 768px (`md`) | Bảng danh mục / so sánh hiện dạng bảng, hotspot kịch bản bắt đầu hiện |
| 1024px (`lg`) | Menu ngang 8 mục không xuống dòng, ô tìm kiếm thu thành nút tròn |
| 1280px (`xl`) | Ô tìm kiếm Ctrl K đầy đủ 252px |
| 1440px | Container tối đa, ảnh hero, carousel |
