---
paths:
  - "auth.ts"
  - "proxy.ts"
  - "next.config.ts"
  - "app/api/**"
  - "app/dang-nhap/**"
  - "components/auth/**"
  - "lib/inventory/**"
  - "scripts/copy-assets.mjs"
  - ".env.example"
  - ".vercelignore"
  - ".gitignore"
---

# Bảo mật và kiểm soát truy cập

Website nội bộ chứa tài liệu kỹ thuật, tồn kho và nội dung chưa công bố. Mọi thay đổi ở đăng nhập, proxy, API, phát hành tài liệu, biến môi trường phải theo file này.

## Guardrail (đọc trước)

- **Mặc định khoá.** Thiếu cấu hình Google / `AUTH_SECRET` thì site vẫn khoá (lỗi Configuration), không tự mở.
- **Chỉ `@mkvision.com`**: kiểm ở `callbacks.signIn` phía server — `email_verified === true`, `profile.hd === ALLOWED_DOMAIN`, email kết thúc `@mkvision.com`. Không bỏ điều kiện nào.
- **`hd` trong `authorization.params` chỉ là gợi ý** ở màn chọn tài khoản; không dựa vào nó để chặn.
- **`AUTH_DISABLED=1` chỉ trên máy dev.** Không đặt trên Vercel / server nội bộ; không đưa vào `.env.example` với giá trị.
- **Secret không vào git, log, chat, ảnh chụp.** Nơi hợp lệ: `.env.local`, Vercel Environment Variables (Sensitive), `../Private Docs MKV Docs/`.
- **Không đọc file secret để in / dùng trực tiếp** (tạo cookie, gọi API thử). Chỉ kiểm biến đã đặt hay chưa.
- **`/img/*`, `/brand/*`, `/_next/*` công khai** (matcher bỏ qua). Không đặt nội dung nhạy cảm ở `public/img/`.
- **Tài liệu nhạy cảm → `NOT_PUBLISHED`** trong `scripts/copy-assets.mjs`; kiểm 404 + không có trong chỉ mục.
- **Không log nội dung người dùng nhập** (tìm kiếm, câu hỏi chatbot, file tải lên).
- **Không đổi phiên bản `next-auth`** (ghim `5.0.0-beta.32`) khi chưa kiểm toàn bộ luồng đăng nhập.

## Mô hình truy cập

| Đường dẫn | Chưa đăng nhập | Đã đăng nhập |
|---|---|---|
| `/dang-nhap`, `/api/auth/*` | Vào được | Vào được |
| Mọi trang khác | 307 → `/dang-nhap?callbackUrl=…` | 200 |
| `/files/*` (tài liệu gốc) | 307 → `/dang-nhap` | 200 |
| `/search-index.json` | 307 → `/dang-nhap` | 200 |
| `/api/*` khác | 401 JSON `{ error: "Chưa đăng nhập" }` | 200 |
| `/img/*`, `/brand/*`, `/_next/static/*`, `/_next/image`, `/favicon.ico` | 200 (công khai) | 200 |

- Quyết định nằm ở `callbacks.authorized` (`auth.ts`); `proxy.ts` chỉ export `auth as proxy` + `matcher`.
- Đường dẫn công khai mới → thêm `PUBLIC_PATHS` và hỏi người dùng; ghi lý do vào CLAUDE.md.
- `/_next/image` công khai: ảnh tối ưu từ `public/img` ai cũng tải được → không đưa ảnh nhạy cảm qua `next/image`.

## Phiên đăng nhập

- JWT, `maxAge` 7 ngày; cookie mã hoá bằng `AUTH_SECRET`.
- Đổi `AUTH_SECRET` → mọi phiên hiện có hết hiệu lực (phải đăng nhập lại). Việc cần làm: tạo mới (`npx auth secret`) trên Production vì secret cũ từng lộ trong chat.
- `trustHost: true` (chạy sau reverse proxy / Vercel); đặt `AUTH_URL` đúng tên miền.
- Trang không đọc session phía server; `SessionProvider` lấy `/api/auth/session` phía client.
- Đăng xuất qua `UserMenu` → xoá cookie.
- Lỗi đăng nhập → `/dang-nhap?error=<AccessDenied|Configuration|Verification|Default>`, thông báo trong `AUTH.errors`.

## OAuth Client

| Client | Dùng ở | Redirect URI |
|---|---|---|
| Production `311582447762-lsjrlm…` | Vercel | `https://mk-vision-docs.vercel.app/api/auth/callback/google`, `docs.mkvision.com` |
| Máy dev `311582447762-50gpn7…` | `.env.local` | `http://localhost:3000/...` + Vercel |

- Project Google Cloud `mk-vision-docs`, consent screen Internal.
- Thêm tên miền mới → thêm redirect URI ở client Production + `AUTH_URL`.
- File JSON client nằm ở `../Private Docs MKV Docs/`, không copy vào repo.

## Service account (tồn kho)

- `inventory-reader@mk-vision-docs.iam.gserviceaccount.com`, quyền **Viewer** trên Sheet; bật Sheets API + Drive API.
- Truyền qua `GOOGLE_SERVICE_ACCOUNT_JSON` (Vercel) hoặc `GOOGLE_SERVICE_ACCOUNT_FILE` (máy dev / server nội bộ).
- Không chia sẻ Sheet công khai ("Anyone with the link"); không đổi quyền thành Editor.
- Scope chỉ đọc (Sheets readonly + Drive metadata readonly).
- Lỗi đọc Sheet chỉ ghi log server `[ton-kho]`, không hiện chi tiết cho người dùng.

## Biến môi trường

- Danh sách đầy đủ + mô tả ở `.env.example` (giá trị secret để trống). Giá trị không bí mật (VD `INVENTORY_SHEET_ID`, `AUTH_URL`) được phép điền.
- `.gitignore`: `.env*` trừ `.env.example`; `.data/`; `.vercel`.
- `.vercelignore`: `.env*` (giữ `.env.example`), `.vercel`, `.data`, `.next`, `node_modules`, `public/files`, `public/brand`, `lib/generated`, `screenshots`.
- Vercel: thêm biến kiểu Sensitive; ghi vào CLAUDE.md biến nào đã đặt (không ghi giá trị).
- Biến mới cần secret (VD `ANTHROPIC_API_KEY`) → thêm dòng trống vào `.env.example` + comment cách lấy + hạn mức.

## Quét secret trước commit

- Tìm trong `git diff --cached`: `AUTH_SECRET=`, `GOCSPX-`, `"private_key"`, `BEGIN PRIVATE KEY`, `vercel_blob_rw_`, `sk-ant-`, `client_secret`.
- Có kết quả → bỏ khỏi stage, báo người dùng; nếu đã push → đề xuất rotate ngay (xoá lịch sử không đủ).

## Phát hành tài liệu

- `scripts/copy-assets.mjs` đưa `Data/MK Vision/{Docs,Solutions}` → `public/files/` (tên ASCII) + manifest `lib/generated/files.json`.
- `NOT_PUBLISHED` hiện có: `^Data/MK Vision/Docs/MKV Profile/` (hồ sơ năng lực: BOM, giá, tên nhân sự, ảnh người thật).
- Thư viện chỉ hiện file có trong manifest; tài liệu `NOT_PUBLISHED` → không có URL, không trong tìm kiếm, link cũ 404.
- Nội dung trích từ tài liệu không phát hành: ghi nguồn bằng tên + trang, **không** link.
- File cũ trong `public/files/` không tự xoá khi thêm `NOT_PUBLISHED` trên máy: xoá đúng file đó (liệt kê trước) rồi build lại; Vercel build sạch nên không bị.
- Lưu ý: repo GitHub và artifact build vẫn chứa tài liệu gốc → ai đọc được repo / project Vercel đều xem được. Quyền repo phải giới hạn.

## Nhãn tài liệu (an toàn khi gửi khách)

- `public` (Gửi khách được) chỉ khi tài liệu là bản phát hành chính thức, không comment, không tên khách, còn hiệu lực.
- `internal` mặc định cho file chưa mô tả, docx có comment, đề xuất có tên khách, slide nội bộ.
- `old` khi có bản mới thay thế; `expired` tự tính khi quá `validTo`.
- "Gửi bộ tài liệu" (`DocKit`) và nút Datasheet ưu tiên `public`; nếu chỉ có bản nội bộ phải ghi "(nội bộ)".

## Dữ liệu nhạy cảm không đưa lên web

- Giá, chiết khấu, BOM, biên lợi nhuận.
- Tên khách hàng, dự án của khách, số hợp đồng.
- Tên / ảnh / thông tin nhân sự, ảnh khuôn mặt người thật (kể cả ảnh demo nhận diện).
- Thông tin sản phẩm quốc phòng (Radar, D-series / UAV) khi chưa được người dùng duyệt.
- Số tồn kho chi tiết không đưa vào `/Data` hay chỉ mục tìm kiếm.

## Chức năng copy / xuất

- Copy Zalo / bảng / CSV chỉ chứa thông số datasheet, tên model, link nội bộ; không chứa nhãn Nội bộ, ghi chú PM, tồn kho chi tiết.
- Link chia sẻ (`?ids=`, `#tim=`) dẫn về site có đăng nhập; người ngoài không xem được.

## API và dịch vụ ngoài

- Mỗi route API: proxy chặn 401; route cần danh tính (giới hạn lượt) đọc session qua `auth()` **trong route handler**, không trong trang.
- Header `Cache-Control: private` cho dữ liệu sau đăng nhập; không `public`, không CDN cache.
- Không trả lỗi nội bộ / stack trace / tên file server cho client.
- Gọi dịch vụ ngoài (Google, Anthropic): timeout hợp lý, bắt lỗi, trả dữ liệu cũ hoặc thông báo chung.
- Dữ liệu gửi ra dịch vụ ngoài: chỉ phần cần thiết; không gửi tài liệu `NOT_PUBLISHED`, giá, tên khách.

## Feature 3 (chatbot) — yêu cầu bảo mật khi làm

- `ANTHROPIC_API_KEY` chỉ ở server (route handler), không `NEXT_PUBLIC_*`.
- Đặt hạn mức chi tiêu ở Anthropic Console; giới hạn ~30 câu / giờ / người (theo email session).
- Log mức dùng (số token, thời gian, email băm hoặc id), không log nội dung câu hỏi / câu trả lời / file.
- Không đưa giá / chiết khấu vào prompt; trả lời không bịa thông số (chỉ dựa catalog đã sinh lúc build).
- File người dùng tải lên (PDF, Excel, Word): giới hạn kích thước, không lưu trên server.
- Route mới thêm vào `outputFileTracingIncludes`.

## Kiểm tra bảo mật sau thay đổi

1. Chạy `npm start` **không** `AUTH_DISABLED`.
2. `curl -s -o NUL -w "%{http_code}" http://localhost:3000/` → 307; `/san-pham` → 307; `/files/<một-file>` → 307; `/search-index.json` → 307.
3. `/api/ton-kho` → 401 JSON.
4. `/dang-nhap` → 200; nút Google → URL Google có `client_id` đúng, `hd=mkvision.com`, `redirect_uri` đúng.
5. Tài liệu `NOT_PUBLISHED`: không có trong `lib/generated/files.json`, không trong `/search-index.json` (kiểm với `AUTH_DISABLED=1`).
6. Production: lặp lại 2–4 với `https://mk-vision-docs.vercel.app`.

## Rủi ro đang mở (theo dõi trong CLAUDE.md)

- `AUTH_SECRET` Production cần xoay vòng.
- Hồ sơ năng lực 2026 nằm trong lịch sử git (gỡ cần viết lại lịch sử — người dùng quyết).
- Ảnh gốc lớn trong `public/img/cover/` công khai không cần đăng nhập.
- Chưa đăng nhập thử trọn vòng trên Production bằng trình duyệt (cả tài khoản bị từ chối).

## Khi thêm người dùng / phân quyền (chưa có)

- Hiện mọi tài khoản `@mkvision.com` có quyền như nhau. Chưa có vai trò (Sales / Admin).
- Nếu cần phân quyền: thêm vào JWT callback từ danh sách email / Google Group, kiểm ở route handler; không ẩn chỉ bằng giao diện.
- Trang quản trị (nếu có) phải là route động riêng, không làm mất sinh tĩnh các trang khác.

## Phía client

- Không có secret ở client; mọi biến `NEXT_PUBLIC_*` coi như công khai.
- Không render HTML từ dữ liệu bằng `dangerouslySetInnerHTML` (hiện không chỗ nào dùng). Nếu cần tô từ khoá tìm kiếm, dựng bằng phần tử React (`<mark>`), không ghép chuỗi HTML.
- Mở tài liệu nội bộ (`/files/...`) tab mới: `target="_blank" rel="noopener"` (như `DocRow`, `DocsBrowser`).
- Link sang trang ngoài: `rel="noopener noreferrer"` để không lộ URL nội bộ qua Referer.
- Không nhúng iframe / script bên thứ ba (analytics, chat widget) khi chưa được duyệt.
- localStorage chỉ lưu dữ liệu không nhạy cảm (danh sách so sánh); không lưu token, tồn kho, nội dung chat có thông tin khách (Feature 3 lưu lịch sử trình duyệt → cảnh báo người dùng không nhập tên khách).
- File người dùng chọn (Feature 3) xử lý trong bộ nhớ, không ghi đĩa server.

## Mối đe doạ chính

| Mối đe doạ | Biện pháp hiện có | Còn hở |
|---|---|---|
| Người ngoài công ty truy cập | OAuth + kiểm `hd` / `email_verified` / đuôi email | Chưa thử trọn vòng trên Production |
| Nhân viên nghỉ việc | Tài khoản Workspace bị khoá → không đăng nhập mới | Phiên JWT còn tới 7 ngày |
| Lộ link tài liệu | `/files/*` cần đăng nhập | `/img/*` công khai |
| Gửi nhầm tài liệu nội bộ cho khách | Nhãn trạng thái, mặc định Nội bộ, DocKit chỉ Gửi khách được | Người dùng vẫn tải được bản Nội bộ |
| Lộ secret | `.gitignore`, Sensitive env, quét diff | `AUTH_SECRET` cũ chưa xoay |
| Lộ tài liệu qua repo | Repo private | Hồ sơ năng lực trong lịch sử git |
| Lạm dụng API tốn phí (chatbot) | (sẽ làm) giới hạn lượt, hạn mức chi tiêu | — |
| Tồn kho sai do người nhập | Dòng không khớp hiện ở `/ton-kho` | Không có kiểm duyệt nhập liệu |

## Checklist review thay đổi liên quan bảo mật

- [ ] Không thêm đường dẫn công khai ngoài ý muốn (`matcher`, `PUBLIC_PATHS`).
- [ ] Không gọi `auth()` trong trang / layout.
- [ ] Không có secret / `NEXT_PUBLIC_` chứa giá trị nhạy cảm.
- [ ] Route API mới trả 401 khi chưa đăng nhập.
- [ ] Log không chứa nội dung người dùng / token.
- [ ] Tài liệu mới đã có nhãn đúng; tài liệu nhạy cảm trong `NOT_PUBLISHED`.
- [ ] `.env.example` cập nhật biến mới (giá trị trống).

## Sự cố → xử lý

| Sự cố | Xử lý |
|---|---|
| Secret lộ trong commit chưa push | Bỏ khỏi commit (reset mềm), xoá giá trị, commit lại |
| Secret lộ đã push / dán chat | Rotate ngay ở nhà cung cấp, cập nhật Vercel + `.env.local`, ghi CLAUDE.md |
| Người ngoài đăng nhập được | Kiểm `signIn` callback, `AUTH_ALLOWED_DOMAIN`, consent screen Internal |
| Trang vào được không cần đăng nhập | Kiểm `matcher`, `PUBLIC_PATHS`, `AUTH_DISABLED` trên server |
| Tài liệu nhạy cảm tải được | Thêm `NOT_PUBLISHED`, xoá file trong `public/files`, build, kiểm 404 |
| Lỗi Configuration ở Production | Thiếu `AUTH_SECRET` / `AUTH_GOOGLE_*` / `AUTH_URL` trên Vercel |
