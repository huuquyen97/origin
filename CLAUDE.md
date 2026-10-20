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

Agent `.claude/agents/qatesting.md`: kiểm thử website như end user / QC Manager, chỉ báo cáo, không sửa. Mở phiên mới mới nạp được.

## Trạng thái dự án (cập nhật 20/10/2026)

Git: repo local nhánh `main`, remote `origin` = https://github.com/huuquyen97/origin.git (private). Commit đầu `532820a`; push lần đầu cần chạy `git push -u origin main` trong terminal VS Code để đăng nhập GitHub. Toàn bộ thay đổi của đợt tối ưu sau QA (bên dưới) **chưa commit**.

### Đã xong
| Phần | Trạng thái |
|---|---|
| Website 7 trang (trang chủ, sản phẩm, chi tiết, so sánh, giải pháp, tính năng AI, tài liệu) | Chạy ổn: lint 0 lỗi (4 cảnh báo `<img>`), build 50 trang tĩnh |
| Dữ liệu | 24 sản phẩm, 17 giải pháp, 73 tài liệu, 33 tính năng AI chuẩn, 23 mô tả thuật toán |
| Rules | CLAUDE.md tách thành 8 file trong `.claude/rules/` theo chuẩn Claude Code |
| QA toàn site | Đã chạy (ảnh `screenshots/qa-*`); 18 hạng mục cải tiến đã làm, xem dưới |
| Nhãn tài liệu | Gửi khách được 49 · Nội bộ 19 · Bản cũ 4 · Hết hạn 1 (chứng nhận hợp quy AutoSecure V1C, hết hạn 16/10/2026) |
| Tính năng AI chuẩn | `Data/AI/features.json`; dùng chung cho sản phẩm, bộ lọc, trang AI, tìm kiếm |
| Thông số chưa chốt | Trường `unconfirmed` cho cả 24 sản phẩm, hiện cảnh báo tại ô; bỏ hiển thị "Ghi chú dữ liệu" |
| Nhãn thông số / loại thiết bị tiếng Việt | `lib/labels.ts`; switch so sánh được theo Cổng / Uplink / PoE / MAC… |
| Giải pháp ngành | Đô thị, Giao thông, Nhà máy, Tòa nhà, Trại giam, Trường học đã có nội dung từ slide V-SECURE; đã bỏ Edge AI và Điện lực |
| Tìm kiếm | `lib/search/rank.ts`: khớp model đứng đầu, AND theo cụm từ, từ đồng nghĩa; Fuse chỉ khi 0 kết quả |
| So sánh | Thêm model vào danh sách (`?add=`), link chia sẻ `?ids=` không ghi đè; copy bảng, CSV, copy rút gọn Zalo |
| Sản phẩm | Bộ lọc nhu cầu (LPR, khuôn mặt, PoE, NDAA, ngoài trời), số đếm theo bộ lọc khác, chip xuống dòng, mobile thu gọn, vùng chạm 44px |
| Ảnh CUVO | 4 ảnh cắt từ `Cuvo catalogue 2024.pdf` (SC609E mờ vì gốc chỉ 232px) |

### Chưa xong / chờ người khác
- **PM cung cấp datasheet đầy đủ** cho MKST28/MKSP28 (và MKSX30, MKSP10, MKEAP-650): file docx hiện có không có bảng thông số chi tiết. Có rồi thì nhập vào `specs`, gỡ mục `unconfirmed` tương ứng, đổi nhãn tài liệu sang `public` nếu là PDF chính thức.
- **PM cấp chứng nhận hợp quy AutoSecure mới** → thêm vào `documents.json` với `validFrom`/`validTo`.
- **PM chốt các thông số xung đột** (danh sách trong `unconfirmed` của từng sản phẩm: zoom số VA50FA2V-40 16x/10x, VB80FA1V bản VN/EN, IP65/IP67 của T8, Wi-Fi 6/802.11ac MKEAP-650, ERPS MKISP12…).
- **Cấu hình đề xuất giải pháp ngành chưa có model cụ thể** (slide chỉ có ảnh thiết bị); Nhà máy chưa có ảnh/sơ đồ.
- Xác nhận cách gọi CUVO / Pavana; ảnh SC609E rõ hơn.

### Bước tiếp theo (session sau)
1. Commit thay đổi đợt này, push lên GitHub (nếu đã đăng nhập).
2. Chạy lại agent `qatesting` trên bản mới; thử trang so sánh / sản phẩm trên điện thoại thật (ảnh mobile của script chụp — trang đặt trong iframe — chỉ hiện trạng thái ban đầu, chưa rõ nguyên nhân; mở trực tiếp ở 375px thì đúng).
3. Nhập dữ liệu mới khi PM gửi (mục trên), chạy `check-data` → build → screenshot.
4. Các góp ý QA chưa làm: số liệu trang chủ ("2 triệu sản phẩm/năm" vs "95.000 camera/tháng") chưa có nguồn rõ; hero chi tiết sản phẩm dùng chung ảnh có áo "pavana"; ảnh VMS là giao diện rỗng; lightbox ảnh giải pháp chưa đóng bằng Esc; giải pháp "Ra vào camera AI" xếp ngành Tài chính – Ngân hàng và dùng chung ảnh với Tòa nhà.

### Quyết định quan trọng và lý do
- **Dữ liệu giữ nguyên văn, chuẩn hoá chỉ ở lớp hiển thị** (`lib/labels.ts`, `features.json` aliases): datasheet là nguồn tin cậy; đổi tên ngay trong JSON sẽ mất dấu vết với tài liệu gốc.
- **Không tự điền thông số / model còn thiếu**: datasheet MK Networks và slide ngành không có → để trống và báo PM, đúng quy tắc "thiếu thì để trống".
- **Tài liệu chưa phân loại mặc định "Nội bộ"; Hết hạn tự tính từ `validTo` lúc build**: an toàn hơn là để Sales gửi nhầm; không phải nhớ cập nhật tay khi giấy tờ hết hạn.
- **Datasheet MK Networks (docx có comment) để Nội bộ; đề xuất có tên khách hàng để Nội bộ; datasheet bị thay bởi bản R1 mới hơn để Bản cũ.**
- **Nút Datasheet ưu tiên bản Gửi khách được + PDF**, ghi rõ "(nội bộ)" nếu chỉ có bản nội bộ: trước đó nút mở nhầm ảnh PNG / slide / docx.
- **Tìm kiếm tự viết xếp hạng thay vì chỉ Fuse**: Fuse fuzzy trên trường dài cho kết quả sai ("đếm người" ra switch); không thêm dependency.
- **Lọc "PoE" tính cả camera cấp nguồn PoE**, "ngoài trời" = IP66+ hoặc datasheet ghi outdoor/ngoài trời.
- **Bỏ giải pháp Edge AI và Điện lực** theo yêu cầu người dùng (Edge AI là năng lực, không phải giải pháp ngành).
- **Gộp `MKSP28-5150` vào loại "Switch truy cập L2+"** (cùng loại MKST28); PoE tách thành bộ lọc nhu cầu.
- **Tài liệu gốc (`Data/MK Vision`, `Data/Design`, ~640MB) không đưa lên git**: dung lượng lớn và là tài liệu nội bộ; clone sang máy khác phải chép riêng trước khi build.
