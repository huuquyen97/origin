# MK Vision Product Docs

Website nội bộ tra cứu sản phẩm và giải pháp Camera / AI Camera / thiết bị mạng của MK Vision, phục vụ toàn công ty, đặc biệt là Sales và Presales.
Mục tiêu: tìm nhanh, tin được. Mỗi thông tin hiển thị phải dẫn được về tài liệu chính thống trong `/Data`.

Ngôn ngữ giao diện: tiếng Việt. Thuật ngữ kỹ thuật giữ nguyên tiếng Anh (IR, WDR, PoE, NDAA, ONVIF, H.265, IP67, Edge AI, LPR, SFP+, VLAN...).

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind CSS v4, Fuse.js, zod, lucide-react. Node 24. Windows + PowerShell.
- Không database, không backend. Dữ liệu đọc từ `/Data` lúc build; mọi trang sinh tĩnh (`generateStaticParams`), chỉ mục tìm kiếm là route tĩnh `/search-index.json`.
- Hạn chế thêm dependency; nếu cần thì nêu lý do.

## Lệnh

```bash
npm run dev          # copy-assets rồi next dev
npm run build        # prebuild: copy-assets + check-data, rồi next build
npm run lint         # eslint (eslint-config-next)
npm run check-data   # kiểm tra dữ liệu
npm run screenshot -- <tên> <url> [chiều cao]   # chụp desktop 1440px + mobile 375px vào screenshots/
```

## Rules

Quy tắc chi tiết nằm trong `.claude/rules/`. Rule có `paths` chỉ nạp khi đọc/sửa file khớp.

| File | Chủ đề | Nạp khi |
|---|---|---|
| `file-safety.md` | Không xóa `/Data`; Windows không phân biệt hoa thường | luôn |
| `quality-checks.md` | lint, build, screenshot trước khi báo xong | luôn |
| `company-and-products.md` | Thông tin công ty, các dòng sản phẩm | luôn |
| `data-integrity.md` | Thông số chỉ lấy từ datasheet, xử lý xung đột | `Data/**`, `public/img/products/**` |
| `data-structure.md` | Cấu trúc `/Data`, schema, copy tài liệu, thêm sản phẩm | `Data/**`, `lib/data/**`, `lib/file-slug.mjs`, `scripts/**` |
| `design.md` | Design system phong cách Primefold | `app/**`, `components/**`, `public/img/**` |
| `frontend-code.md` | Quy ước Next.js / React / Tailwind | file code trong `app/`, `components/`, `lib/` |
| `features.md` | Tính năng và route từng trang | `app/**`, `components/**`, `lib/search/**` |
