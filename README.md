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
