---
paths:
  - "Data/**"
  - "lib/data/**"
  - "lib/file-slug.mjs"
  - "scripts/**"
---

# Cấu trúc dữ liệu `/Data`

```
Data/
  MK Vision/Docs/        # tài liệu gốc theo dòng (V-SECURE, MOBISECURE, AUTOSECURE, BIOSECURE, M6, MK Networks, Datasheets, Slide, HDSD, AI...) — KHÔNG sửa
  MK Vision/Solutions/   # tài liệu gốc giải pháp phần mềm (VMS, EMS) — KHÔNG sửa
  MK Vision/Logo/mk-vision.png
  Design/                # ảnh tham khảo design, không dùng trong web
  Products/<slug>.json   # mỗi sản phẩm 1 file
  Solutions/<slug>.json  # mỗi giải pháp 1 file
  Documents/documents.json  # mô tả tài liệu (tiêu đề, loại, dòng, sản phẩm liên quan)
  AI/algorithms.json     # thuật toán AI
  Site/series.json | company.json | home.json   # dòng sản phẩm, công ty, nội dung trang chủ
```

## Schema

- zod ở `lib/data/schema.ts`; đọc, validate, liên kết ở `lib/data/index.ts`. File sai làm build dừng và báo rõ tên file.
- Sản phẩm: `slug, model, name, series, category, resolution, ipRating, summary, features, aiFeatures, specs` (nhóm: Image, Lens, AI, Video, Audio, Network, Storage, Power, Environment, Physical, Other), `solutions, documents, image, status, updatedAt, sources, notes`.
- Giải pháp: `slug, order, name, shortName, industry, summary, painPoints, architecture, modules, features, benefits, targetCustomers, relatedSeries, products, documents, cover, images, sources, notes`. `order` quyết định thứ tự (trang chủ lấy 3 giải pháp đầu).
- Liên kết sản phẩm ↔ giải pháp là hai chiều: khai báo ở một phía là đủ.
- Trường văn bản (`summary`, `notes`, `architecture`) là chuỗi, không phải mảng.

## Tài liệu và ảnh

- `scripts/copy-assets.mjs` đưa tài liệu gốc sang `public/files/` với tên ASCII không dấu (hard link) và sinh `lib/generated/files.json`. File mới trong `Data/MK Vision/Docs` tự hiện trong thư viện tài liệu, trừ thư mục `Image/`, `Product Photos/`.
- Tên file tiếng Việt trên đĩa có thể ở dạng Unicode NFC hoặc NFD: so khớp đường dẫn qua `pathKey()`, tạo URL qua `fileUrl()` (`lib/file-slug.mjs`), không ghép URL thủ công.
- Ảnh web đã tối ưu đặt trong `public/img/` (`products/<slug>.png` ≤ ~600KB, `scenes/`, `solutions/`). Không dùng ảnh gốc nhiều MB trực tiếp.
- `public/files/`, `public/brand/`, `lib/generated/` được sinh lúc build — không sửa tay.

## Thêm sản phẩm / dòng mới

1. Trích thông số từ datasheet vào `Data/Products/<slug>.json`.
2. Ảnh sản phẩm: resize → `public/img/products/<slug>.png`.
3. Thêm mô tả tài liệu vào `Data/Documents/documents.json`; dòng mới thì thêm vào `Data/Site/series.json` và `FOLDER_SERIES` trong `lib/data/index.ts`.
4. `npm run check-data` → `npm run build` → chụp screenshot kiểm tra.
