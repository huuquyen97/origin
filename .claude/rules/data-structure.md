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
  AI/algorithms.json     # mô tả tính năng AI, chỉ lấy từ Docs/AI Function/[MKV]-AI_Function_Description_v1.0.pdf (thay file Excel cũ); feature = id trong features.json
  AI/features.json       # từ điển tính năng AI chuẩn theo thiết bị (nameVi + name EN, keywords, aliases = chuỗi aiFeatures nguyên văn); tính năng không có model và không có mô tả thì không giữ
  Site/series.json | company.json | home.json   # dòng sản phẩm, công ty, nội dung trang chủ
```

## Schema

- zod ở `lib/data/schema.ts`; đọc, validate, liên kết ở `lib/data/index.ts`. File sai làm build dừng và báo rõ tên file.
- Sản phẩm: `slug, model, name, series, category, resolution, ipRating, summary, features, aiFeatures, specs` (nhóm: Image, Lens, AI, Video, Audio, Network, Storage, Power, Environment, Physical, Other), `solutions, documents, image, status, updatedAt, sources, notes`.
- Giải pháp: `slug, order, name, shortName, industry, summary, painPoints, architecture, modules, features, benefits, targetCustomers, relatedSeries, products, documents, cover, images, sources, notes`. `order` quyết định thứ tự (trang chủ lấy 3 giải pháp đầu).
- Sản phẩm có `unconfirmed: [{group, label, note}]`: thông số đang xung đột giữa tài liệu; `group`/`label` khớp đúng một hàng trong `specs` (rỗng = cấp sản phẩm). Giao diện hiện cảnh báo tại ô; `notes` chỉ dành cho người bảo trì, không hiển thị.
- Giải pháp có `configuration: [{item, product, note}]` (cấu hình đề xuất); `product` chỉ điền khi tài liệu nêu đúng model.
- Tài liệu (`documents.json`) có `status`: `public` (Gửi khách được) / `internal` (Nội bộ) / `old` (Bản cũ), `statusNote`, `validFrom`/`validTo` (YYYY-MM-DD). Quá `validTo` thì tự thành "Hết hạn" lúc build. File chưa mô tả mặc định Nội bộ.
- `aiFeatures` của sản phẩm giữ nguyên văn datasheet; thêm chuỗi mới thì gắn vào `aliases` của tính năng chuẩn trong `AI/features.json` (check-data cảnh báo chuỗi chưa gắn).
- Nhãn hiển thị tiếng Việt cho `category` và label thông số nằm ở `lib/labels.ts` (dữ liệu vẫn nguyên văn); label mới cùng nghĩa với label đã có thì thêm vào bảng để bảng so sánh xếp cùng hàng.
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
