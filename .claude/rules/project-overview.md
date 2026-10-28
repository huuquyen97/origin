# Tổng quan dự án

Bối cảnh chung để hiểu website, công ty, dữ liệu và hạ tầng. Trạng thái tiến độ mới nhất nằm trong `CLAUDE.md` (mục "Trạng thái dự án"); file này mô tả phần ổn định.

## Guardrail quan trọng nhất

- Website **nội bộ**, chỉ tài khoản `@mkvision.com`. Không SEO (`robots: noindex`), không trang công khai ngoài `/dang-nhap`.
- Mục tiêu: **tìm nhanh, tin được**. Mỗi thông tin hiển thị phải dẫn được về tài liệu chính thống trong `/Data`.
- **Không database.** Dữ liệu là JSON trong `/Data`, đọc lúc build, mọi trang sinh tĩnh.
- Phần động duy nhất: `proxy.ts` (chặn đăng nhập) và `app/api/*` (auth, tồn kho).
- Tồn kho **không** phải thông số datasheet: không nằm trong `/Data`, đọc từ Google Sheet lúc chạy.
- AI Factory trong `Data/MK Vision/Docs/AI Factory` là deck đối tác (Turing Tec): không lấy số liệu làm năng lực MK Vision.

## Người dùng và nhu cầu

- **Sales**: tra model theo nhu cầu khách, copy thông số gửi Zalo / email, tải datasheet được phép gửi.
- **Presales**: so sánh model, đọc giải pháp ngành, kiến trúc, cấu hình đề xuất, tài liệu kỹ thuật.
- **Ban giám đốc**: nắm năng lực, danh mục, tồn kho, kịch bản ngành.
- **PM sản phẩm**: chốt thông số xung đột (`unconfirmed`), danh mục model, chứng nhận.
- Ngữ cảnh dùng: trên điện thoại khi gặp khách (375px) và trên laptop khi làm hồ sơ (1440px).

## Công ty

- Công ty Cổ phần MK Vision, thành viên MK Group (25+ năm về bảo mật, định danh). Thành lập 09/07/2020.
- Slogan logo: "Smart Secure Style".
- Định vị: AI Camera xử lý tại biên (Edge AI) "Make in Vietnam", tự sản xuất tại nhà máy KCN Thăng Long Vĩnh Phúc (Lô C-1B).
- Trụ sở: Tầng G, The Vista, số 4 ngõ 15 Duy Tân, Cầu Giấy, Hà Nội.
- Liên hệ: contact@mkvision.com, hotline +84 247 100 6785. Web: https://mkvision.com/.
- Nguồn thông tin công ty: `Data/Site/company.json`, slide trong `Data/MK Vision/Docs/Slide`, hồ sơ năng lực 2026 (`Docs/MKV Profile`, không phát hành).
- Năng lực (hồ sơ 2026): 8 công nghệ lõi, 2 dây chuyền SMT ≈1,4 triệu PCBA/năm, phòng sạch ISO 7, QC IQC/PQC/OQC/Reliability.

## Dòng sản phẩm

| Dòng | Loại | Model trên web | Nền tảng |
|---|---|---|---|
| V-Secure | AI Camera Bullet / Dome / PTZ | VA50FA0V, VA50FA2V-40, VB50FB1V, VB50FA1V, VB80FA1V | VMS, EMS |
| MobiSecure | Camera đeo người | MK22FC1E, T8A, T8B, T8C | COMS |
| AutoSecure | Camera hành trình AI + DMS | AutoSecure, AutoSecure-DAT, AutoSecure DMS | FMS |
| BioSecure | Đầu đọc CCCD gắn chip, sinh trắc | A612, M6 | ACP |
| MK Networks | Switch, Wi-Fi AP | MKSX30-6550, MKST28-5150, MKSP28-5150, MKSP10-3100, MKISP12-5510, MKEAP-650 | Hạ tầng mạng thôn số / khu đô thị |
| CUVO | Camera dân dụng, IP camera, NVR | SC609E, PVN-CH222M6ND-2812PW-A, PVN-CH322M6MCA-2812PW-A, PVN-N1064OD-E4HL | — |

- Tổng 24 sản phẩm có trang chi tiết (`Data/Products/*.json`), slug = model viết thường, gạch ngang.
- Danh mục 27 model camera IP hiện hành (06/2026) ở `Data/Site/catalog.json`, series A / B / E / S (+ K cho AutoSecure / BioSecure / MobiSecure). Nhiều model trong danh mục chưa có datasheet trên web.
- Series danh mục: A = Không AI, B = AI-ready, E = Licensed AI, S = Cao cấp, K = Sản phẩm đặc biệt (theo hồ sơ 2026).
- MK Networks: datasheet docx có comment → nhãn Nội bộ; nhiều thông số `unconfirmed`.
- CUVO / Pavana: cách gọi chưa chốt; Pavana là đơn vị thiết kế, gia công camera trong liên minh MK Group.

## Giải pháp

- 17 giải pháp trong `Data/Solutions/*.json`, thứ tự theo `order` (trang chủ lấy 3 đầu).
- Nền tảng phần mềm: VMS, EMS, FMS, COMS, ACP.

| Nhóm | Slug (`Data/Solutions/<slug>.json`) |
|---|---|
| Nền tảng phần mềm | `vms`, `ems`, `fms`, `coms`, `acp` |
| Ngành (slide V-SECURE) | `do-thi`, `giao-thong`, `nha-may`, `toa-nha`, `trai-giam`, `truong-hoc` |
| Định danh / kiểm soát | `ekyc`, `ra-vao-camera-ai`, `dat` |
| Hạ tầng mạng | `mk-networks-thon-so` |
| Dân dụng | `cuvo-gia-dinh` |
| Đối tác | `ai-factory` (Turing Tec — không phải năng lực MK Vision) |

- Kịch bản ngành liên kết 5 trang giải pháp: `do-thi`, `giao-thong`, `toa-nha`, `truong-hoc`, `trai-giam`.
- `ra-vao-camera-ai` đang xếp ngành Tài chính – Ngân hàng và dùng chung ảnh với Tòa nhà (góp ý QA chưa xử lý).
- Giải pháp ngành có nội dung từ slide V-SECURE: Đô thị, Giao thông, Nhà máy, Tòa nhà, Trại giam, Trường học.
- Đã bỏ theo yêu cầu: Edge AI (là năng lực, không phải ngành), Điện lực.
- Kịch bản 8 ngành (hồ sơ 2026) trong `Data/Site/scenarios.json`: An ninh trật tự, Giao thông, Văn phòng, Trường học, Trại giam, Cửa khẩu, Điện lực, Thể thao. Ba ngành cuối là kịch bản định hướng, không có trang giải pháp.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript strict (TS 6), Node 24.
- Tailwind CSS v4 (`@theme` trong `app/globals.css`, không có `tailwind.config`).
- zod 4 (schema dữ liệu), Fuse.js 7 (tìm kiếm mờ dự phòng), lucide-react (icon).
- Auth.js v5 `next-auth@5.0.0-beta.32` (ghim bản) + Google provider.
- `google-auth-library` (service account) + REST Google Sheets / Drive (không dùng `googleapis`).
- `@vercel/blob` 2.8.2 (bản tồn kho dự phòng trên Vercel).
- `server-only` cho module chỉ chạy phía server.
- ESLint 9 + `eslint-config-next`. Không có test framework; kiểm tra bằng `check-data`, build, screenshot, QA agent.
- Môi trường dev: Windows 11, PowerShell 5.1 (không có `&&`), Git Bash có sẵn.

## Kiến trúc dữ liệu (luồng build)

1. `scripts/copy-assets.mjs`: hard link / copy tài liệu `Data/MK Vision/{Docs,Solutions}` → `public/files/<ascii-slug>`; logo → `public/brand/`; sinh `lib/generated/files.json` (manifest đường dẫn → URL + size). Bỏ qua `NOT_PUBLISHED`.
2. `scripts/check-data.mjs`: kiểm trường bắt buộc, slug trùng, liên kết gãy, file / ảnh không tồn tại, alias AI chưa gắn, `unconfirmed` trỏ sai hàng.
3. `next build`: các trang gọi `lib/data` (`getData()` đọc + validate zod + liên kết, cache trong tiến trình build).
4. `app/search-index.json/route.ts`: route tĩnh sinh chỉ mục tìm kiếm từ `lib/search/build-index.ts`.
5. Kết quả: 54 trang tĩnh + route động `/api/auth/*`, `/api/ton-kho`.

## Kiến trúc lúc chạy

- `proxy.ts` (Next 16 thay `middleware.ts`) = `auth` của Auth.js; `callbacks.authorized` quyết định.
- Matcher bỏ qua `_next/static`, `_next/image`, `favicon.ico`, `brand/`, `img/`.
- Phiên lấy phía client qua `SessionProvider` (`/api/auth/session`) để trang vẫn tĩnh.
- `ChromeGate` ẩn header / footer ở `/dang-nhap`.
- Tồn kho: client `useInventory()` gọi `GET /api/ton-kho` → `lib/inventory/store.ts` → `unstable_cache` (revalidate `INVENTORY_POLL_SECONDS`, mặc định 60s) → Drive `modifiedTime` → nếu đổi mới đọc Sheet → lưu bản tốt gần nhất (Blob / `.data/`).
- Danh sách so sánh lưu `localStorage` (`compare-store.ts`, tối đa 4).

## Thư mục chính

```
app/                 # route (App Router); globals.css chứa design token
components/          # UI theo trang: home/ products/ solutions/ docs/ ai/ inventory/ auth/ + dùng chung
lib/data/            # schema.ts (zod) + index.ts (đọc, validate, liên kết) — server-only
lib/search/          # normalize.ts (bỏ dấu), rank.ts (xếp hạng), build-index.ts
lib/inventory/       # source.ts, parse.ts, store.ts, last-good.ts, types.ts
lib/strings.ts       # chuỗi giao diện tiếng Việt
lib/labels.ts        # nhãn tiếng Việt cho category / thông số, NEEDS, kindOf
lib/file-slug.mjs    # fileUrl(), pathKey() — dùng chung build script + app
scripts/             # copy-assets, check-data, screenshot
Data/                # nguồn dữ liệu (xem data-structure.md)
public/img/          # ảnh đã tối ưu: products/ scenes/ solutions/ profile/ cover/ brand/
templates/           # ton-kho-mau.csv (mẫu tồn kho chạy thử)
screenshots/         # ảnh kiểm tra giao diện theo bước (NN-ten-*)
analysis/            # báo cáo của agent ba-research
.claude/             # rules/ + agents/ (qatesting, ba-research)
```

## Biến môi trường

| Biến | Dùng cho | Ghi chú |
|---|---|---|
| `AUTH_SECRET` | Mã hoá cookie phiên | `npx auth secret`; cần xoay vòng trên Production |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | OAuth Client | Production và máy dev dùng 2 client khác nhau |
| `AUTH_URL` | URL gốc sau reverse proxy | Production `https://mk-vision-docs.vercel.app` |
| `AUTH_ALLOWED_DOMAIN` | Tên miền email | Mặc định `mkvision.com` |
| `AUTH_DISABLED` | Bỏ đăng nhập | Chỉ máy dev, `=1` |
| `INVENTORY_SHEET_ID` / `INVENTORY_SHEET_RANGE` | Google Sheet tồn kho | Không đặt → ẩn mọi phần tồn kho |
| `GOOGLE_SERVICE_ACCOUNT_FILE` / `_JSON` | Service account Viewer | Một trong hai |
| `INVENTORY_LOW_STOCK` / `INVENTORY_POLL_SECONDS` | Ngưỡng sắp hết / chu kỳ | 10 / 60 (tối thiểu 15) |
| `INVENTORY_LOCAL_FILE` | CSV chạy thử | Ưu tiên hơn Sheet; không đặt trên server thật |
| `BLOB_READ_WRITE_TOKEN` / `BLOB_STORE_ID` | Bản tồn kho dự phòng | Vercel tự đặt `BLOB_STORE_ID` (OIDC) |
| `INVENTORY_CACHE_FILE` | Bản dự phòng dạng file | Mặc định `.data/inventory-last-good.json` |
| `ANTHROPIC_API_KEY` | Feature 3 chatbot | Chưa dùng; cần hạn mức chi tiêu |

## Triển khai

- Vercel Production: https://mk-vision-docs.vercel.app (project `mk-vision-docs`, team `tommy-c937`, gói Hobby: log giữ ~30 phút).
- Tên miền dự kiến: `docs.mkvision.com` (đã có trong redirect URI của OAuth Client Production).
- Repo: https://github.com/huuquyen97/origin.git (private), gồm cả `Data/MK Vision` (~640MB) để Vercel tự build.
- Function chỉ đóng gói JSON dữ liệu (`outputFileTracingIncludes`), loại tài liệu gốc (`outputFileTracingExcludes`).
- `.vercelignore` loại `.env*` (giữ `.env.example`), `.vercel`, `.data`, `.next`, `node_modules`, `public/files`, `public/brand`, `lib/generated`, `screenshots`.
- Có thể chạy server nội bộ: `next start` sau reverse proxy HTTPS, đặt `AUTH_URL`.

## Trang và tính năng (tóm tắt — chi tiết ở `site-structure.md`)

- `/` Tổng quan · `/san-pham` · `/san-pham/danh-muc` · `/san-pham/[slug]` · `/so-sanh` · `/giai-phap` · `/giai-phap/[slug]` · `/thuat-toan-ai` · `/tai-lieu` · `/ton-kho` · `/nang-luc` · `/dang-nhap`.
- Tìm kiếm toàn cục (Ctrl K, `/`), lọc theo nhu cầu, so sánh 2–4 model, copy Zalo / bảng / CSV, nhãn trạng thái tài liệu, cảnh báo thông số chưa chốt, tồn kho thời gian gần thực.

## Tính năng đã lên kế hoạch

- **Feature 3 – Trợ lý AI tư vấn** (`/tro-ly`, `POST /api/chat`, `@anthropic-ai/sdk`, model `claude-opus-5-5`, streaming, prompt cache catalog). Kế hoạch trong memory `feature3-ai-assistant-plan` và CLAUDE.md. Chưa code.
- Khi làm: route mới phải thêm vào `outputFileTracingIncludes`; không log nội dung câu hỏi; không trả giá / chiết khấu.

## Hạn chế đã biết

- Ảnh mobile của `npm run screenshot` (iframe) chỉ hiện trạng thái ban đầu, không chạy JS tương tác → dùng CDP script nếu cần.
- Trang chủ cuộn ngang nhẹ (dải tab hero 375px, carousel 1440px) — chưa sửa.
- 16 tính năng AI theo thiết bị chưa có mô tả (tài liệu chỉ mô tả 12).
- Ảnh gốc lớn trong `public/img/cover/` (`home.png` 16MB…) truy cập được không cần đăng nhập.
- Hồ sơ năng lực 2026 nằm trong git (có BOM, giá): web không phục vụ nhưng ai đọc repo đều xem được.

## Quy mô dữ liệu (27/10/2026)

| Mục | Số lượng | Nguồn |
|---|---|---|
| Sản phẩm có trang | 24 | `Data/Products/*.json` |
| Giải pháp | 17 | `Data/Solutions/*.json` |
| Tài liệu có mô tả | 71 | `Data/Documents/documents.json` |
| File trong thư viện | 105 | `lib/generated/files.json` |
| Nhãn: Gửi khách được / Nội bộ / Bản cũ / Hết hạn | 48 / 16 / 6 / 1 | `documents.json` |
| Tính năng AI chuẩn | 28 | `Data/AI/features.json` |
| Mô tả thuật toán AI | 12 | `Data/AI/algorithms.json` |
| Model danh mục | 27 | `Data/Site/catalog.json` |
| Kịch bản ngành / điểm nóng | 8 / 59 | `Data/Site/scenarios.json` |
| Ảnh chú thích tính năng | 3 (MK22FC1E, M6, AutoSecure) | `Data/Site/feature-shots.json` |
| Mục chỉ mục tìm kiếm | ~174 | `/search-index.json` |
| Trang build | 54 | `next build` |

- Số liệu thay đổi khi thêm dữ liệu: cập nhật CLAUDE.md, không cần sửa file này trừ khi quy mô đổi đáng kể.

## Lịch sử phát triển chính

| Thời điểm | Mốc |
|---|---|
| Trước 21/10/2026 | Website 8 trang, dữ liệu 24 sản phẩm, tìm kiếm, so sánh, nhãn tài liệu |
| 21/10 | Giao diện kiểu Hikvision (giữ màu navy), cập nhật MobiSecure, mô tả AI từ tài liệu chính thức |
| 22/10 | Đăng nhập Google, tồn kho Google Sheet |
| 27/10 | Deploy Vercel, `Data/MK Vision` lên git, sửa tồn kho Production, hồ sơ năng lực 2026 (danh mục, năng lực, kịch bản, ảnh chú thích), ảnh nền mới |
| Sau | Feature 3 trợ lý AI, chứng nhận AutoSecure mới, dữ liệu PM chốt |

## Tài liệu tham chiếu trong repo

- `CLAUDE.md`: trạng thái, việc chờ, bước tiếp theo, quyết định + lý do. Cập nhật cuối mỗi phiên.
- `.claude/rules/*.md`: quy tắc theo chủ đề (bảng trong CLAUDE.md).
- `.claude/agents/qatesting.md`: kiểm thử như end user, chỉ báo cáo.
- `.claude/agents/ba-research.md`: phân tích, nghiên cứu, lên kế hoạch; báo cáo vào `analysis/`.
- `.env.example`: danh sách biến môi trường (không chứa giá trị secret).
- `templates/ton-kho-mau.csv`: định dạng cột của file tồn kho.

## Thuật ngữ

| Thuật ngữ | Nghĩa trong dự án |
|---|---|
| Datasheet | Tài liệu thông số chính thức của model, nguồn tin cậy nhất |
| `unconfirmed` | Thông số đang xung đột giữa tài liệu, chờ PM chốt |
| Gửi khách được / Nội bộ / Bản cũ / Hết hạn | Nhãn trạng thái tài liệu (`public` / `internal` / `old` / `expired`) |
| Tính năng AI chuẩn | Mục trong `Data/AI/features.json`, gom các cách ghi khác nhau qua `aliases` |
| Nhu cầu (`need`) | Bộ lọc nhanh: LPR, khuôn mặt, PoE, NDAA, ngoài trời |
| Danh mục | 27 model camera hiện hành theo hồ sơ 2026 |
| Kịch bản | Ảnh ngành có điểm nóng (hotspot) → tính năng AI |
| Ảnh chú thích | Ảnh marketing có nhãn tính năng, gắn trang model (`feature-shots.json`) |
| `modelKey` | Model viết hoa, chỉ chữ + số; dùng để ghép tồn kho / danh mục |
| Edge AI | AI xử lý tại thiết bị (camera), không gửi video lên cloud để phân tích |
