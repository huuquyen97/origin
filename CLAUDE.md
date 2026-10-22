# MK Vision Product Docs

Website nội bộ tra cứu sản phẩm và giải pháp Camera / AI Camera / thiết bị mạng của MK Vision, phục vụ toàn công ty, đặc biệt là Sales và Presales.
Mục tiêu: tìm nhanh, tin được. Mỗi thông tin hiển thị phải dẫn được về tài liệu chính thống trong `/Data`.

Ngôn ngữ giao diện: tiếng Việt. Thuật ngữ kỹ thuật giữ nguyên tiếng Anh (IR, WDR, PoE, NDAA, ONVIF, H.265, IP67, Edge AI, LPR, SFP+, VLAN...).

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind CSS v4, Fuse.js, zod, lucide-react. Node 24. Windows + PowerShell.
- Không database. Dữ liệu đọc từ `/Data` lúc build; mọi trang sinh tĩnh (`generateStaticParams`), chỉ mục tìm kiếm là route tĩnh `/search-index.json`. Phần động chỉ gồm `proxy.ts` và route `/api/*`; không gọi `auth()`/`cookies()` trong layout hay trang (sẽ làm mất sinh tĩnh) — phiên lấy phía client qua `SessionProvider`.
- Đăng nhập: Auth.js v5 (`next-auth@5.0.0-beta.32`, ghim bản) + Google, chỉ tài khoản `@mkvision.com` (`auth.ts`). `proxy.ts` chặn mọi trang, `/files/*`, `/search-index.json`; API chưa đăng nhập trả 401. Biến môi trường xem `.env.example` (`.env*` không commit). Chạy server thật (`next start`) sau reverse proxy HTTPS, đặt `AUTH_URL`.
- Tồn kho: `lib/inventory/` đọc Google Sheet bằng service account (`google-auth-library` + REST); kết quả trong `unstable_cache` (revalidate 60s, chạy được trên Vercel serverless — không dùng biến trong bộ nhớ tiến trình), chỉ đọc lại bảng khi `modifiedTime` đổi; bản đọc thành công gần nhất lưu ở Vercel Blob private (`@vercel/blob`, có `BLOB_READ_WRITE_TOKEN`) hoặc `.data/` (`lib/inventory/last-good.ts`); `GET /api/ton-kho`; client dùng chung `useInventory()` (`components/inventory/`). Số tồn **không** nằm trong `/Data` (không phải thông số datasheet). Chưa đặt `INVENTORY_SHEET_ID` / `INVENTORY_LOCAL_FILE` thì mọi phần tồn kho tự ẩn.
- Hạn chế thêm dependency; nếu cần thì nêu lý do.

## Lệnh

```bash
npm run dev          # copy-assets rồi next dev
npm run build        # prebuild: copy-assets + check-data, rồi next build
npm run lint         # eslint (eslint-config-next)
npm run check-data   # kiểm tra dữ liệu
npm run screenshot -- <tên> <url> [chiều cao]   # chụp desktop 1440px + mobile 375px vào screenshots/
# Chụp trang nội bộ cần bỏ đăng nhập trên máy: chạy server với AUTH_DISABLED=1 (không đặt trên server thật)
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
| `design.md` | Design system tham khảo hikvision.com/vn (từ 21/10/2026) | `app/**`, `components/**`, `public/img/**` |
| `frontend-code.md` | Quy ước Next.js / React / Tailwind | file code trong `app/`, `components/`, `lib/` |
| `features.md` | Tính năng và route từng trang | `app/**`, `components/**`, `lib/search/**` |

Agent `.claude/agents/qatesting.md`: kiểm thử website như end user / QC Manager, chỉ báo cáo, không sửa. Mở phiên mới mới nạp được.

## Trạng thái dự án (cập nhật 22/10/2026)

Git: remote `origin` = https://github.com/huuquyen97/origin.git (private). `main` đã gộp `feature/update_giao_dien_hikvision`, `feature/login-google`, `feature/inventory` và được push cuối session 22/10. Làm tính năng mới thì tách nhánh từ `main`.

Triển khai: hướng tới Vercel (`AUTH_URL=https://mk-vision-docs.vercel.app`, OAuth Client có redirect URI localhost:3000 + Vercel). Secret đặt trong `.env.local` (máy dev) và Environment Variables của Vercel, **không** ghi vào `.env.example` (file mẫu được commit). File JSON OAuth Client / service account nằm ngoài repo: `../Private Docs MKV Docs/`.

### Đã xong
| Phần | Trạng thái |
|---|---|
| Website 8 trang (trang chủ, sản phẩm, chi tiết, so sánh, giải pháp, tính năng AI, tài liệu, tồn kho) + đăng nhập | Chạy ổn: lint 0 lỗi (4 cảnh báo `<img>`), build 52 trang |
| Dữ liệu | 24 sản phẩm, 17 giải pháp, 71 tài liệu có mô tả trong `documents.json` (105 file trong thư viện, file chưa mô tả mặc định Nội bộ), 28 tính năng AI chuẩn, 12 mô tả thuật toán |
| Rules | CLAUDE.md tách thành 8 file trong `.claude/rules/` theo chuẩn Claude Code |
| QA toàn site | Đã chạy (ảnh `screenshots/qa-*`); 18 hạng mục cải tiến đã làm, xem dưới |
| Nhãn tài liệu (trong `documents.json`) | Gửi khách được 48 · Nội bộ 16 · Bản cũ 6 · Hết hạn 1 (chứng nhận hợp quy AutoSecure V1C, hết hạn 16/10/2026) |
| Đăng nhập Google (22/10, đã gộp `main`) | `/dang-nhap`, chỉ `@mkvision.com` đã xác minh (`hd` + đuôi email); chặn trang, `/files`, chỉ mục tìm kiếm; API chưa đăng nhập trả 401; menu tài khoản + Đăng xuất. OAuth Client thật (project `mk-vision-docs`) đã cấu hình trong `.env.local`; đã kiểm: chuyển sang Google đúng client_id + `hd`, cookie phiên vào được, đăng xuất xoá cookie. **Chưa đăng nhập thử trọn vòng bằng trình duyệt**. Ảnh `screenshots/14-*` |
| Tồn kho (22/10, đã gộp `main`) | `/ton-kho`, ô tồn kho trang chi tiết, nhãn thẻ sản phẩm, lọc "Còn hàng", hàng "Tồn kho" ở so sánh. Google Sheet thật "MKV Inventory Template" (tab `ton-kho-mau`, service account `inventory-reader@mk-vision-docs.iam.gserviceaccount.com` quyền Viewer): khớp 24/24 model. Đã kiểm: cộng nhiều kho, "1.200", model không khớp, cache trong chu kỳ, stale-while-revalidate, nguồn lỗi giữ số cũ, cold start lấy bản dự phòng, không có dự phòng vẫn không sập. Header 7 mục: ô tìm kiếm thu thành nút ở 1024–1279px. Ảnh `screenshots/15-*` |
| MK Networks | Dùng datasheet docx hiện có (không có bản mới hơn); thông số chưa có trong tài liệu để trống, mục `unconfirmed` giữ nguyên |
| Tính năng AI chuẩn | `Data/AI/features.json`; dùng chung cho sản phẩm, bộ lọc, trang AI, tìm kiếm |
| Thông số chưa chốt | Trường `unconfirmed` cho cả 24 sản phẩm, hiện cảnh báo tại ô; bỏ hiển thị "Ghi chú dữ liệu" |
| Nhãn thông số / loại thiết bị tiếng Việt | `lib/labels.ts`; switch so sánh được theo Cổng / Uplink / PoE / MAC… |
| Giải pháp ngành | Đô thị, Giao thông, Nhà máy, Tòa nhà, Trại giam, Trường học đã có nội dung từ slide V-SECURE; đã bỏ Edge AI và Điện lực |
| Tìm kiếm | `lib/search/rank.ts`: khớp model đứng đầu, AND theo cụm từ, từ đồng nghĩa; Fuse chỉ khi 0 kết quả |
| So sánh | Thêm model vào danh sách (`?add=`), link chia sẻ `?ids=` không ghi đè; copy bảng, CSV, copy rút gọn Zalo |
| Sản phẩm | Bộ lọc nhu cầu (LPR, khuôn mặt, PoE, NDAA, ngoài trời), số đếm theo bộ lọc khác, chip xuống dòng, mobile thu gọn, vùng chạm 44px |
| Ảnh CUVO | 4 ảnh cắt từ `Cuvo catalogue 2024.pdf` (SC609E mờ vì gốc chỉ 232px) |
| Giao diện kiểu Hikvision (21/10) | Open Sans, chữ #333, header cố định đổi nền khi cuộn, hero tràn viền, tab trang chủ có vạch tiến trình tự chuyển, card ảnh hover, footer xám; logo + ô Ctrl K +20%. Ảnh `screenshots/10-*` |
| MobiSecure MK22FC1E (21/10) | Thông số + mô tả lấy lại từ `Datasheet _Mobi Secure.pdf` (người dùng xóa datasheet `MK22FC1E - BWC 2MB_23022026.pdf`); MOBISECURE.pdf/.docx chuyển "Bản cũ"; bỏ LPR, Wi-Fi, ONVIF, bảo hành (không có trong datasheet chuẩn). Ảnh `screenshots/11-mobisecure-*` |
| Tính năng AI (21/10) | Mô tả chỉ lấy từ `[MKV]-AI_Function_Description_v1.0.pdf` (thay file Excel cũ đã xóa): 12 mô tả trong `algorithms.json`. Từ điển `features.json` vẫn giữ tính năng theo thiết bị (28, link từ trang sản phẩm); bỏ 5 tính năng chỉ có ở Excel và không model nào ghi (thuộc tính khuôn mặt / người / phương tiện, Liveness, vi phạm giao thông chung). Ảnh `screenshots/13-*` |

### Chưa xong / chờ người khác
- **Chứng nhận hợp quy AutoSecure mới**: người dùng sẽ bổ sung sau. Khi có file → thêm vào `documents.json` với `validFrom`/`validTo`, status `public`. Đến lúc đó Sales chỉ có bản Hết hạn.
- **Datasheet MK Networks** (MKST28, MKSP28, MKSX30, MKSP10, MKEAP-650): tạm dùng bản docx hiện có, không chờ bản mới. Nếu sau này có PDF chính thức thì nhập `specs`, gỡ `unconfirmed`, đổi nhãn sang `public`.
- **PM chốt các thông số xung đột** (danh sách trong `unconfirmed` của từng sản phẩm: zoom số VA50FA2V-40 16x/10x, VB80FA1V bản VN/EN, IP65/IP67 của T8, Wi-Fi 6/802.11ac MKEAP-650, ERPS MKISP12…).
- **Cấu hình đề xuất giải pháp ngành chưa có model cụ thể** (slide chỉ có ảnh thiết bị); Nhà máy chưa có ảnh/sơ đồ.
- Xác nhận cách gọi CUVO / Pavana; ảnh SC609E rõ hơn.
- **MobiSecure**: `Datasheet _Mobi Secure.pdf` không ghi tên model (web vẫn dùng MK22FC1E); IP65 (datasheet) vs IP67 (slide); dòng "Hiệu năng xử lý" bị cắt ở "Phân tích tầm nhìn tại".
- **16 tính năng AI theo thiết bị chưa có mô tả** (Heat Map, vân tay, DMS…): `AI_Function_Description_v1.0.pdf` chỉ mô tả 12 tính năng.

- **Đổi secret OAuth**: `AUTH_GOOGLE_SECRET` và `AUTH_SECRET` từng được dán trong chat và nằm trong một commit local (đã viết lại trước khi push, không lên GitHub). Nên tạo secret mới trên Google Cloud Console + `npx auth secret`, cập nhật `.env.local` và Vercel.
- **Vercel chưa cấu hình xong**: tạo Blob store (Vercel tự đặt `BLOB_READ_WRITE_TOKEN`); đặt `AUTH_*`, `INVENTORY_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_JSON` (nội dung JSON, không dùng đường dẫn file) trong Environment Variables. Tài liệu gốc `Data/MK Vision`, `Data/Design` không có trên git → bản Vercel thiếu file `/files/*` và ảnh lấy từ đó, có thể `check-data` báo lỗi; cần kiểm khi deploy.

### Bước tiếp theo (session sau)
1. Deploy thử lên Vercel theo mục trên; đăng nhập thật bằng tài khoản @mkvision.com và tài khoản gmail cá nhân (phải bị từ chối); sửa một số trên Sheet, xem web đổi sau 1–2 phút.
2. Feature 3 — **AI Chatbot tư vấn** (đã lên kế hoạch, chưa làm): `/tro-ly`, `POST /api/chat` dùng `@anthropic-ai/sdk`, model `claude-opus-5-5`, streaming, đưa toàn bộ catalog (sinh lúc build) vào system prompt có prompt cache, tồn kho đặt sau điểm cache; trả lời theo khung: tóm tắt yêu cầu → sản phẩm phù hợp (Đáp ứng / Một phần / Chưa) → điểm chưa đáp ứng → phương án chào → câu hỏi lại khách. Không giá / chiết khấu. Giới hạn ~30 câu/giờ/người, log mức dùng không log nội dung. Cần `ANTHROPIC_API_KEY` + hạn mức chi tiêu và 5–10 yêu cầu khách mẫu (đã bỏ tên khách). Làm trên nhánh mới từ `main`.
3. Chạy lại agent `qatesting` trên bản mới; thử trang so sánh / sản phẩm trên điện thoại thật (ảnh mobile của script chụp — trang đặt trong iframe — chỉ hiện trạng thái ban đầu, chưa rõ nguyên nhân; mở trực tiếp ở 375px thì đúng).
4. Bổ sung chứng nhận hợp quy AutoSecure khi người dùng gửi; nhập dữ liệu PM chốt, chạy `check-data` → build → screenshot.
5. Các góp ý QA chưa làm: số liệu trang chủ ("2 triệu sản phẩm/năm" vs "95.000 camera/tháng") chưa có nguồn rõ; hero chi tiết sản phẩm dùng chung ảnh có áo "pavana"; ảnh VMS là giao diện rỗng; lightbox ảnh giải pháp chưa đóng bằng Esc; giải pháp "Ra vào camera AI" xếp ngành Tài chính – Ngân hàng và dùng chung ảnh với Tòa nhà.

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
- **Đổi phong cách từ Primefold sang Hikvision nhưng giữ màu navy MK Vision** cho nút chính/vạch menu (không dùng đỏ Hikvision) để đúng nhận diện thương hiệu; header chuyển ra layout và `fixed` vì header nằm trong hero (có `isolate`) sẽ bị nội dung phía dưới đè khi cuộn.
- **Đăng nhập bằng Google OAuth thay vì LDAP**: Secure LDAP chỉ có ở gói Workspace Enterprise; OAuth + kiểm `hd`/`email_verified` phía server là đủ chặn tài khoản ngoài công ty (`hd` gửi lên Google chỉ là gợi ý). Dùng Auth.js ghim bản beta thay vì tự viết luồng OAuth.
- **Trang vẫn sinh tĩnh, phiên đọc phía client**: chặn ở `proxy.ts`, không gọi `auth()` trong layout/trang, để giữ tốc độ và cách build cũ. `AUTH_DISABLED=1` chỉ để chụp ảnh trên máy.
- **Tồn kho từ Google Sheet qua service account (Viewer), không để link công khai**; Sheet dùng chung cho mọi người đã đăng nhập; số tồn không đưa vào `/Data`. Hỏi Drive `modifiedTime` trước, đổi mới đọc lại bảng (rẻ, không cần webhook — webhook cần URL công khai). Ghép model bằng `modelKey` (chỉ chữ + số, không phân biệt hoa thường); dòng không khớp hiện ở `/ton-kho` để người nhập sửa.
- **`INVENTORY_LOCAL_FILE` ưu tiên hơn Sheet**: để chạy thử bằng CSV mà không phải xoá biến Sheet (PowerShell không đặt được biến rỗng). Server thật không đặt biến này.
- **Secret không vào git, kể cả `.env.example`**: Next.js / Vercel không đọc `.env.example`, ghi giá trị thật vào đó chỉ làm lộ secret.
- **Tồn kho dùng `unstable_cache` + bản dự phòng bền vững thay vì biến trong bộ nhớ**: trên Vercel mỗi instance serverless có bộ nhớ riêng, bị tắt/khởi động lại bất kỳ lúc nào, nên cache trong tiến trình mất và mỗi instance gọi Google riêng. Chưa chuyển sang `use cache` vì phải bật Cache Components cho toàn site.
- **Tài liệu gốc (`Data/MK Vision`, `Data/Design`, ~640MB) không đưa lên git**: dung lượng lớn và là tài liệu nội bộ; clone sang máy khác phải chép riêng trước khi build.
