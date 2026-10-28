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
| `mandatory-rule.md` | Guardrail tuyệt đối: an toàn `/Data`, secret, git, kiểm tra trước khi báo xong, việc phải hỏi | luôn |
| `project-overview.md` | Công ty, dòng sản phẩm, stack, kiến trúc build/chạy, env, deploy, thuật ngữ | luôn |
| `workflow.md` | Quy trình theo loại việc, nhánh/commit, kiểm tra, QA, ba-research, deploy, tổng kết phiên | luôn |
| `data-integrity.md` | Thông số chỉ lấy từ datasheet, xử lý xung đột | `Data/**`, `public/img/products/**` |
| `data-structure.md` | Cấu trúc `/Data`, schema, copy tài liệu, thêm sản phẩm | `Data/**`, `lib/data/**`, `lib/file-slug.mjs`, `scripts/**` |
| `design-system.md` | Token màu/chữ, layout, header/hero, card, nút, tag, bảng, ảnh, a11y (tham khảo hikvision.com/vn) | `app/**`, `components/**`, `public/img/**` |
| `site-structure.md` | Bản đồ route, tham số URL, nội dung từng trang, component dùng chung, tìm kiếm | `app/**`, `components/**`, `lib/search/**`, `lib/strings.ts` |
| `coding-convention.md` | Quy ước Next.js / React / TS / Tailwind, lớp dữ liệu, API, cache | code trong `app/`, `components/`, `lib/`, `scripts/`, `auth.ts`, `proxy.ts`, `next.config.ts` |
| `security-and-access.md` | Đăng nhập, proxy, secret, phát hành tài liệu, API, rủi ro | `auth.ts`, `proxy.ts`, `app/api/**`, `lib/inventory/**`, `copy-assets`, `.env.example`… |
| `content-writing.md` | Văn phong, thuật ngữ, số/ngày, cảnh báo, ghi nguồn, copy gửi khách | `lib/strings.ts`, `lib/labels.ts`, `Data/Site/**`, `Data/Solutions/**`, `Data/Documents/**`, `*.tsx` |

Từ 28/10/2026 các rule cũ `file-safety`, `quality-checks`, `company-and-products`, `design`, `frontend-code`, `features` đã gộp vào các file trên.

Agent (mở phiên mới mới nạp được):
- `.claude/agents/qatesting.md`: kiểm thử website như end user / QC Manager, chỉ báo cáo, không sửa.
- `.claude/agents/ba-research.md`: phân tích, lên kế hoạch / tối ưu tính năng, nghiên cứu thị trường / đối thủ, so sánh lựa chọn; báo cáo ≤ 500 từ lưu `analysis/YYYY-MM-DD-<chu-de>.md`, không sửa code.

## Trạng thái dự án (cập nhật 27/10/2026)

Git: remote `origin` = https://github.com/huuquyen97/origin.git (private). `main` đã gộp `feature/update_giao_dien_hikvision`, `feature/login-google`, `feature/inventory`, `feature/nang-luc-danh-muc` (người dùng tự merge + push 27/10, commit `de7635d`); từ 27/10 có cả tài liệu gốc `Data/MK Vision` (~640MB) để Vercel tự build từ GitHub. Làm tính năng mới thì tách nhánh từ `main`.

Triển khai: Vercel Production https://mk-vision-docs.vercel.app (project `mk-vision-docs`, team `tommy-c937`). Hai OAuth Client trong project Google `mk-vision-docs`: **Production** `311582447762-lsjrlm…` (redirect Vercel + `docs.mkvision.com`, không có localhost) đặt trên Vercel; **máy dev** `311582447762-50gpn7…` (localhost + Vercel) đặt trong `.env.local`. Secret chỉ đặt trong `.env.local` và Environment Variables của Vercel (kiểu Sensitive, không đọc lại được), **không** ghi vào `.env.example`. File JSON OAuth Client / service account nằm ngoài repo: `../Private Docs MKV Docs/`.

### Đã xong
| Phần | Trạng thái |
|---|---|
| Website 10 trang (trang chủ, sản phẩm, danh mục model, chi tiết, so sánh, giải pháp, tính năng AI, tài liệu, tồn kho, năng lực) + đăng nhập | Chạy ổn: lint 0 lỗi (6 cảnh báo `<img>`), build 54 trang |
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
| Hồ sơ năng lực 2026 (27/10, đã gộp `main`) | Nguồn `Docs/MKV Profile/MK Vision_Năng lực v1 2026.pdf` — **không phát hành** trên web (`NOT_PUBLISHED` trong copy-assets; 404, không có trong thư viện / tìm kiếm). Thêm: `/san-pham/danh-muc` (27 model camera, series A/B/E/S/K, lọc, `?q=`), `/nang-luc` (8 công nghệ lõi + % làm chủ, R&D, sản xuất, phòng sạch, QC; menu thứ 8), kịch bản 8 ngành có điểm nóng ở `/giai-phap#kich-ban` (`?kb=`) + 5 trang giải pháp, ảnh chú thích tính năng ở MK22FC1E / M6 / AutoSecure (kèm điểm lệch datasheet), số liệu trang chủ theo hồ sơ 2026, tìm kiếm có model danh mục + kịch bản + năng lực, lightbox có nút Đóng + Esc. QA agent đã chạy, đã sửa các lỗi trong phạm vi. Ảnh `screenshots/16-*`. Sau đó (27/10): trang `/nang-luc` bố cục lại (Edge AI 2 cột văn bản, bỏ hộp sơ đồ Edge→Cloud, CTA cuối dạng viền trên), **không hiện tham chiếu "Hồ sơ năng lực 2026" / số trang** theo yêu cầu người dùng (`page` vẫn giữ trong `capability.json` để đối chiếu). Người dùng Việt hoá 4 yếu tố Edge AI (Hiệu quả / Chất lượng / Tốc độ / Giá thành) và format lại `capability.json`; `check-data` OK. Ảnh `screenshots/18-*` |
| Ảnh nền mới (27/10, đã gộp `main`) | Màn đăng nhập: `public/img/cover/login-bg.jpg` (cắt 16:9 từ `factory.jpg`, nhà máy về đêm). Trang Tổng quan: `public/img/cover/home-cover-2.jpg` (cắt 1.89:1 từ `home.png` 6240px, logo toà nhà lệch phải để không bị tiêu đề che, `object-[78%_center]` cho mobile). Đổi ảnh thì đặt tên file mới (bộ tối ưu ảnh Next cache theo đường dẫn). Ảnh `screenshots/17-*` |

### Chưa xong / chờ người khác
- **PM xác nhận danh mục 06/2026 vs datasheet**: VA50FA2V-40 / VB50FA1V / VB80FA1V không có trong danh mục (đổi tên hay ngừng?); VA50FA0V danh mục ghi series A "Không AI" nhưng datasheet có FR/LPR (web đang hiện cảnh báo vàng); VB50FB1V ghi "AI-ready" nhưng datasheet có sẵn FR + LPR; ảnh chú thích lệch datasheet: MK22FC1E "WiFi", M6 "màn hình cảm ứng", AutoSecure "360°" và "72h".
- **Ảnh gốc trong `public/img/cover/`** (`factory.jpg`, `home.png` 16MB, `login.jpg` 6,6MB) được commit theo yêu cầu người dùng; `/img/*` không cần đăng nhập (proxy bỏ qua) nên ai có link đều tải được, và làm nặng repo. Nên chuyển sang `Data/Design/` nếu không dùng trực tiếp.
- **Hồ sơ năng lực 2026 đang nằm trong git** (đưa lên cùng `Data/MK Vision` ở commit b9fff62, đã push): file có BOM + giá + tên nhân sự. Web không phục vụ file, nhưng ai đọc được repo GitHub / build Vercel đều xem được. Người dùng cần quyết định có gỡ khỏi git (lịch sử vẫn còn trừ khi viết lại lịch sử).
- **Chứng nhận hợp quy AutoSecure mới**: người dùng sẽ bổ sung sau. Khi có file → thêm vào `documents.json` với `validFrom`/`validTo`, status `public`. Đến lúc đó Sales chỉ có bản Hết hạn.
- **Datasheet MK Networks** (MKST28, MKSP28, MKSX30, MKSP10, MKEAP-650): tạm dùng bản docx hiện có, không chờ bản mới. Nếu sau này có PDF chính thức thì nhập `specs`, gỡ `unconfirmed`, đổi nhãn sang `public`.
- **PM chốt các thông số xung đột** (danh sách trong `unconfirmed` của từng sản phẩm: zoom số VA50FA2V-40 16x/10x, VB80FA1V bản VN/EN, IP65/IP67 của T8, Wi-Fi 6/802.11ac MKEAP-650, ERPS MKISP12…).
- **Cấu hình đề xuất giải pháp ngành chưa có model cụ thể** (slide chỉ có ảnh thiết bị); Nhà máy chưa có ảnh/sơ đồ.
- Xác nhận cách gọi CUVO / Pavana; ảnh SC609E rõ hơn.
- **MobiSecure**: `Datasheet _Mobi Secure.pdf` không ghi tên model (web vẫn dùng MK22FC1E); IP65 (datasheet) vs IP67 (slide); dòng "Hiệu năng xử lý" bị cắt ở "Phân tích tầm nhìn tại".
- **16 tính năng AI theo thiết bị chưa có mô tả** (Heat Map, vân tay, DMS…): `AI_Function_Description_v1.0.pdf` chỉ mô tả 12 tính năng.

- **Đổi `AUTH_SECRET` Production**: `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` đã thay bằng OAuth Client mới (27/10); `AUTH_SECRET` cũ từng dán trong chat, nên tạo mới (`npx auth secret`) và cập nhật trên Vercel (mọi phiên đăng nhập hiện có sẽ phải đăng nhập lại).
- **Vercel Production (27/10)**: env `AUTH_*`, `INVENTORY_*`, `GOOGLE_SERVICE_ACCOUNT_JSON` (service account `a8c4…`; file `_PRD` mới trong Private Docs chưa dùng), Blob store gắn project (`BLOB_STORE_ID`, xác thực OIDC). Đã sửa lỗi tồn kho Production `ENOENT /var/task/Data/Products` (function không kèm JSON dữ liệu; xem quyết định). Đã kiểm: trang/`/files`/chỉ mục → 307 `/dang-nhap`, `/api/ton-kho` → 401, nút Google đúng `redirect_uri` + `hd`. **Chưa kiểm sau đăng nhập** (mở `/ton-kho` rồi xem `npx vercel@65.3.1 logs -e production`; gói Hobby chỉ giữ log ~30 phút).
- **Cách deploy**: push `main` lên GitHub để Vercel tự build (nếu project đã nối repo — kiểm trong Vercel → Settings → Git), hoặc `npx vercel@65.3.1 deploy --prod` từ máy này (`.vercelignore` loại `.env*`, `public/files`…; CLI upload cả thư mục làm việc nên cất file chưa commit trước).

### Bước tiếp theo (session sau)
1. Kiểm tra Vercel đã tự build `main` mới (`de7635d`): mở `/nang-luc`, `/san-pham/danh-muc`, `/giai-phap#kich-ban`, ảnh nền đăng nhập / Tổng quan trên Production; nếu chưa nối repo thì `npx vercel@65.3.1 deploy --prod`. Có thể xoá nhánh `feature/nang-luc-danh-muc` (local + remote) khi người dùng đồng ý.
2. Trên Vercel Production: đăng nhập thật bằng tài khoản @mkvision.com và tài khoản gmail cá nhân (phải bị từ chối); sửa một số trên Sheet, xem web đổi sau 1–2 phút.
3. Feature 3 — **AI Chatbot tư vấn** (đã lên kế hoạch, chưa làm): `/tro-ly`, `POST /api/chat` dùng `@anthropic-ai/sdk`, model `claude-opus-5-5`, streaming, đưa toàn bộ catalog (sinh lúc build) vào system prompt có prompt cache, tồn kho đặt sau điểm cache; trả lời theo khung: tóm tắt yêu cầu → sản phẩm phù hợp (Đáp ứng / Một phần / Chưa) → điểm chưa đáp ứng → phương án chào → câu hỏi lại khách. Không giá / chiết khấu. Giới hạn ~30 câu/giờ/người, log mức dùng không log nội dung. Cần `ANTHROPIC_API_KEY` + hạn mức chi tiêu và 5–10 yêu cầu khách mẫu (đã bỏ tên khách). Làm trên nhánh mới từ `main`.
4. Chạy lại agent `qatesting` trên bản mới; thử trang so sánh / sản phẩm trên điện thoại thật (ảnh mobile của script chụp — trang đặt trong iframe — chỉ hiện trạng thái ban đầu, chưa rõ nguyên nhân; mở trực tiếp ở 375px thì đúng).
5. Bổ sung chứng nhận hợp quy AutoSecure khi người dùng gửi; nhập dữ liệu PM chốt, chạy `check-data` → build → screenshot.
6. Các góp ý QA chưa làm: trang chủ cuộn ngang nhẹ (dải tab hero ở 375px, carousel ở 1440px); hero chi tiết sản phẩm dùng chung ảnh có áo "pavana"; ảnh VMS là giao diện rỗng; giải pháp "Ra vào camera AI" xếp ngành Tài chính – Ngân hàng và dùng chung ảnh với Tòa nhà.

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
- **Tài liệu gốc `Data/MK Vision` (~640MB) đưa lên git từ 27/10** (trước đó không, theo yêu cầu người dùng): để Vercel tự build từ GitHub, không phụ thuộc máy có đủ `/Data`; repo private. 3 catalogue ~57MB vượt mức cảnh báo 50MB của GitHub (dưới giới hạn 100MB); file > 100MB phải dùng Git LFS. `Data/Design` vẫn không đưa lên.
- **Function động chỉ đóng gói JSON dữ liệu, không kèm tài liệu gốc** (`next.config.ts`: `outputFileTracingExcludes` loại `Data/MK Vision`, `Data/Design`, `public/files`; `outputFileTracingIncludes` thêm `Data/*/**/*.json` + `lib/generated/files.json` cho `/api/ton-kho`): `lib/data` đọc bằng `fs` lúc chạy nên Next không tự đóng gói. Route API mới dùng `lib/data` (VD chatbot) phải thêm vào `outputFileTracingIncludes`.
- **Hồ sơ năng lực dùng làm nguồn nhưng không phát hành**: có BOM, giá, tên nhân sự, ảnh người thật. Mọi số liệu trích ghi "Hồ sơ năng lực 2026, tr.X"; năng lực chung (IP65/67, TOPS, LLM…) không gán vào `specs` model; danh mục chỉ link model trùng tên; ảnh chú thích chỉ gắn model đã đối chiếu thông số và liệt kê điểm lệch. Số liệu trang chủ chọn hồ sơ 2026 (mới nhất) thay "2 triệu sản phẩm/năm" và "82% / 7 lĩnh vực" của báo cáo cũ.
- **Kịch bản ngành: điểm nóng trùng nhãn có sẵn trong ảnh** (toạ độ lấy từ vị trí chữ trong PDF, không vẽ lại) + danh sách tình huống cho mobile / bàn phím; tính năng AI liên quan chỉ là liên kết tra cứu, chỉ hiện "N sản phẩm có…" khi có model ghi tính năng đó. Điện lực / Thể thao / Cửa khẩu hiện là kịch bản định hướng, không thêm lại giải pháp.
- **Trang `/nang-luc` không hiện nguồn "Hồ sơ năng lực 2026" / số trang** (người dùng yêu cầu 27/10): trang đọc như giới thiệu công ty; `page` vẫn giữ trong dữ liệu để đối chiếu. Các trang khác (trang chủ, danh mục, kịch bản, ảnh chú thích) vẫn ghi nguồn. Bỏ hộp sơ đồ Edge→Cloud vì lặp ý với phần chữ (`flow` vẫn còn trong JSON, không dùng).
- **Ảnh nền cắt từ ảnh gốc, đặt tên file mới mỗi lần đổi**: ảnh gốc nhiều MB không dùng trực tiếp; Next image optimizer cache theo đường dẫn nên ghi đè cùng tên sẽ vẫn hiện ảnh cũ.
- **Không tự merge vào `main`**: nhánh tính năng chỉ commit; người dùng review rồi tự merge / push.
- **Trang tồn kho không hiện dòng mô tả nguồn và thông báo lỗi đọc file** (người dùng yêu cầu 27/10): lỗi đọc Sheet chỉ ghi log server (`[ton-kho]`), xem bằng `vercel logs`.
