# MK Vision Product Docs

Website nội bộ tra cứu sản phẩm và giải pháp MK Vision. Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4, Fuse.js. Không có database: mọi trang sinh tĩnh từ `/Data` lúc build.

## Chạy

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # copy tài liệu + kiểm tra dữ liệu + build
npm start            # chạy bản build
npm run lint
npm run check-data   # chỉ kiểm tra dữ liệu
npm run screenshot -- <tên> <url> [chiều cao]   # chụp desktop 1440px + mobile 375px vào screenshots/
```

## Đăng nhập và triển khai

Website chỉ dành cho tài khoản Google `@mkvision.com` (Auth.js + Google OAuth, cấu hình ở `auth.ts`, chặn truy cập ở `proxy.ts`).

1. Google Cloud Console (tài khoản công ty) → APIs & Services:
   - OAuth consent screen: User type **Internal**.
   - Credentials → Create OAuth client ID → **Web application**. Authorized redirect URI: `https://<tên-miền>/api/auth/callback/google` (dev: `http://localhost:3000/api/auth/callback/google`).
2. Chép `.env.example` thành `.env.local` (hoặc đặt biến môi trường trên server), điền `AUTH_SECRET` (`npx auth secret`), `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_URL`.
3. `npm run build` → `npm start` (Node 24) sau reverse proxy HTTPS (IIS / Nginx) trỏ tới cổng 3000. Tài liệu gốc `Data/MK Vision`, `Data/Design` phải được chép sẵn lên server trước khi build.

Chạy thử trên máy không có OAuth Client: đặt `AUTH_DISABLED=1` (bỏ qua đăng nhập). Không đặt biến này trên server thật.

## Tồn kho (Google Sheet)

Trang `/ton-kho`, ô Tồn kho ở trang chi tiết, nhãn trên thẻ sản phẩm, bộ lọc "Còn hàng" và hàng "Tồn kho" ở bảng so sánh đọc số từ một Google Sheet chung.

- Kết quả kiểm tra nguồn nằm trong Data Cache của Next.js (`unstable_cache`, `revalidate` = `INVENTORY_POLL_SECONDS`, mặc định 60s): dùng chung giữa các instance và còn sau khi khởi động lại (Vercel: Data Cache; server nội bộ: `.next/cache`). Hết hạn thì request đầu tiên vẫn nhận số cũ và kích hoạt làm mới nền, nên số mới hiện sau khoảng 1–2 chu kỳ.
- Mỗi lần làm mới chỉ gọi Drive lấy `modifiedTime`; file chưa đổi thì không đọc lại bảng.
- Bản đọc thành công gần nhất được lưu bền vững: Vercel Blob private (`BLOB_READ_WRITE_TOKEN`) hoặc file `.data/inventory-last-good.json`. Google lỗi (kể cả khi instance vừa khởi động) thì web hiện bản này kèm cảnh báo.

1. Tạo Google Sheet (không phải file .xlsx tải lên) từ mẫu `templates/ton-kho-mau.csv`: cột **Model**, **Tồn kho**, tùy chọn **Kho**, **Ghi chú**. Một model nhiều kho thì nhiều dòng, web tự cộng. Model so khớp không phân biệt hoa thường, bỏ dấu cách / gạch nối.
2. Google Cloud: bật **Google Sheets API** và **Google Drive API**; tạo service account, tải key JSON đặt trên server (không commit).
3. Chia sẻ Sheet cho email của service account, quyền **Viewer**.
4. Đặt biến môi trường: `INVENTORY_SHEET_ID` (đoạn giữa `/d/` và `/edit` trong link), `GOOGLE_SERVICE_ACCOUNT_FILE` (đường dẫn key JSON) hoặc `GOOGLE_SERVICE_ACCOUNT_JSON`; tùy chọn `INVENTORY_SHEET_RANGE`, `INVENTORY_LOW_STOCK` (ngưỡng "Sắp hết", mặc định 10).

Chạy thử không cần Google: `INVENTORY_LOCAL_FILE=<đường dẫn CSV>`.

## Dữ liệu (`/Data`)

| Đường dẫn | Nội dung |
|---|---|
| `Data/MK Vision/Docs`, `Data/MK Vision/Solutions` | Tài liệu gốc (PDF, PPTX, DOCX…). Không sửa. |
| `Data/MK Vision/Logo/mk-vision.png` | Logo |
| `Data/Products/<slug>.json` | Mỗi sản phẩm một file. Thông số nguyên văn datasheet; `sources` = datasheet nguồn; `notes` = điểm chưa thống nhất giữa tài liệu |
| `Data/Solutions/<slug>.json` | Mỗi giải pháp một file |
| `Data/Documents/documents.json` | Mô tả tài liệu (tiêu đề, loại, sản phẩm liên quan). File có trên đĩa mà chưa mô tả vẫn tự hiện trong thư viện |
| `Data/AI/algorithms.json` | Thuật toán AI |
| `Data/Site/*.json` | Dòng sản phẩm, thông tin công ty, nội dung trang chủ |

- Dữ liệu được validate bằng zod trong `lib/data/schema.ts`. File sai sẽ làm build dừng và báo đúng tên file.
- `scripts/check-data.mjs` (chạy tự động trước build) kiểm tra trường bắt buộc, slug trùng, liên kết gãy và file tài liệu/ảnh không tồn tại.
- `scripts/copy-assets.mjs` đưa tài liệu gốc sang `public/files/` với tên ASCII không dấu (hard link, không tốn thêm dung lượng), và sinh `lib/generated/files.json`.

## Cấu trúc code

- `app/`: routes `/`, `/san-pham`, `/san-pham/[slug]`, `/so-sanh`, `/giai-phap`, `/giai-phap/[slug]`, `/tai-lieu`, `/thuat-toan-ai`, `/search-index.json`
- `components/`: UI dùng chung; `"use client"` chỉ ở phần tương tác (tìm kiếm, bộ lọc, so sánh, slider)
- `lib/data/`: đọc + validate + liên kết dữ liệu
- `lib/search/`: chuẩn hoá tiếng Việt (bỏ dấu), tạo chỉ mục tìm kiếm
- `lib/strings.ts`: chuỗi giao diện tiếng Việt
- `app/globals.css`: design token (`brand-navy` #004C98, `brand-gold` #DEBB5C đo từ logo) khai báo trong `@theme` của Tailwind v4

Tìm kiếm: `Ctrl K` hoặc `/` ở mọi trang. Link chia sẻ: `/#tim=tu-khoa`.
