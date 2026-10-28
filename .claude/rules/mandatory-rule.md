# Quy tắc bắt buộc

Áp dụng cho mọi tác vụ. Vi phạm các mục dưới đây có thể gây mất dữ liệu không hoàn tác được, lộ thông tin nội bộ hoặc đưa thông số sai tới khách hàng. Khi rule khác mâu thuẫn với file này, file này thắng.

## Guardrail tuyệt đối (đọc trước tiên)

1. **Không xoá, di chuyển, đổi tên thư mục trong `/Data`.** Windows không phân biệt hoa thường: `data/` = `Data/`. Xoá `data` là xoá toàn bộ dữ liệu.
2. **Không sửa tài liệu gốc** trong `Data/MK Vision/` (Docs, Solutions, Logo, Image) và `Data/Design/`. Chỉ đọc.
3. **Không tự bịa thông số.** Mọi thông số sản phẩm lấy nguyên văn từ datasheet. Thiếu thì để trống, giao diện hiện "—".
4. **Không đưa secret vào git**, kể cả `.env.example`, comment, commit message, log, ảnh chụp màn hình.
5. **Không phát hành tài liệu nội bộ nhạy cảm** (BOM, giá, chiết khấu, tên nhân sự, tên khách hàng, ảnh người thật). Hồ sơ năng lực `Docs/MKV Profile/` chỉ dùng làm nguồn, không xem / tải được trên web.
6. **Không tự merge vào `main`, không tự push, không force push.** Commit chỉ khi người dùng yêu cầu; merge / push do người dùng quyết.
7. **Không gọi `auth()` / `cookies()` / `headers()` trong layout hoặc trang.** Làm vậy mất sinh tĩnh toàn site.
8. **Không đặt `AUTH_DISABLED=1` trên server thật** (Vercel, server nội bộ). Chỉ dùng trên máy để chụp ảnh.
9. **Không báo "xong" khi chưa chạy lint + build** (và screenshot nếu đổi giao diện). Lỗi thì báo nguyên văn.
10. **Không sửa im lặng xung đột dữ liệu.** Hai tài liệu ghi khác nhau → ghi `unconfirmed` / `notes`, báo người dùng, chờ PM chốt.
11. **Không xoá thay đổi chưa commit của người dùng** (`git checkout --`, `git reset --hard`, `git clean`, `git stash drop`) nếu chưa được đồng ý rõ ràng.
12. **Không thêm dependency** khi chưa nêu lý do và được đồng ý.

## An toàn file

- Trước khi xoá bất cứ thứ gì: liệt kê chính xác đường dẫn sẽ bị xoá, kiểm tra lại, rồi mới xoá.
- Không dùng xoá đệ quy theo tên mơ hồ (`rm -rf data`, `Remove-Item -Recurse *data*`).
- Không tạo thư mục chỉ khác hoa thường với thư mục đã có (`data/` cạnh `Data/`, `Public/` cạnh `public/`).
- `tsconfig.json` loại `Data`, `data`, `assets`: không đặt code TypeScript trong các thư mục này.
- File tạm, script dùng một lần, ảnh trung gian: đặt trong scratchpad của phiên, không đặt trong dự án.
- Thư mục sinh lúc build, không sửa tay: `public/files/`, `public/brand/`, `lib/generated/`, `.next/`.
- `.data/` chứa bản tồn kho dự phòng trên máy: không commit, không xoá khi đang chạy thử tồn kho.
- Từ 27/10/2026 `Data/MK Vision/` **có trong git** (repo private), nhưng lịch sử không phải bản sao lưu an toàn cho file chưa commit. Coi mọi file ở đó là không hoàn tác được.
- `Data/Design/` **không** có trong git (.gitignore): xoá / ghi đè ở đó là mất hẳn.
- File > 100MB không push được lên GitHub; 50–100MB bị cảnh báo. File lớn cần Git LFS → hỏi người dùng trước.
- Ghi đè file có sẵn: đọc file trước, xác nhận đúng file, giữ nguyên định dạng dòng (nhiều file dùng CRLF).
- Tên file tiếng Việt có thể ở dạng NFC hoặc NFD: so khớp qua `pathKey()`, không so chuỗi trực tiếp.

## Tính chính xác dữ liệu (tóm tắt — chi tiết ở `data-integrity.md`)

- Nguồn tin cậy theo thứ tự: datasheet chính thức (PDF, có ngày / phiên bản) > datasheet docx > slide / brochure > hồ sơ năng lực.
- Hồ sơ năng lực là năng lực chung: không gán IP / TOPS / nhiệt độ / LLM chung vào `specs` của model cụ thể.
- Giữ nguyên văn: đơn vị, cách ghi, ngôn ngữ, kể cả lỗi chính tả của bản gốc. Chuẩn hoá chỉ ở lớp hiển thị (`lib/labels.ts`, `aliases`).
- Không điền giá trị "phổ biến", không copy thông số từ model tương tự, không suy từ tên model.
- Model chỉ liên kết khi tên khớp đúng (`modelKey`); tên gần giống là model khác.
- Mỗi sản phẩm có `sources` trỏ tới datasheet thật trong `/Data`; `check-data` sẽ báo nếu file không tồn tại.
- Ảnh chú thích / ảnh marketing lệch datasheet → ghi `conflicts`, hiện cảnh báo, không sửa ảnh.
- Thông tin cảnh báo cho Sales phải nói rõ hành động: "Cần PM xác nhận trước khi báo khách".

## Bảo mật và bí mật

- Secret chỉ nằm ở: `.env.local` (máy dev), Environment Variables của Vercel (kiểu Sensitive), `../Private Docs MKV Docs/` (file JSON gốc).
- Không đọc nội dung file secret để in ra, để tạo cookie, hay để "kiểm tra". Chỉ cần biết biến đã đặt hay chưa.
- Không dán secret vào lệnh shell hiển thị trong lịch sử; dùng `vercel env add` dạng tương tác hoặc file.
- Nghi lộ secret (đã xuất hiện trong chat, log, commit) → báo người dùng, đề xuất xoay vòng (rotate), ghi vào CLAUDE.md.
- `/img/*`, `/brand/*`, `/_next/*` **không cần đăng nhập** (proxy bỏ qua). Không đặt ảnh / tài liệu nhạy cảm vào `public/img/`.
- `/files/*`, mọi trang, `/search-index.json` cần đăng nhập. `/api/*` chưa đăng nhập trả 401 JSON.
- Chỉ tài khoản `@mkvision.com` có `email_verified` và `hd` đúng. Không nới lỏng kiểm tra trong `auth.ts`.
- Không log nội dung người dùng nhập (tìm kiếm, câu hỏi chatbot); chỉ log mức dùng / lỗi.

## Phát hành nội dung

- Thư viện tài liệu tự hiện mọi file trong `Data/MK Vision/Docs` trừ `NOT_PUBLISHED` (`scripts/copy-assets.mjs`) và thư mục `Image/`, `Product Photos/`.
- Thêm tài liệu nhạy cảm → thêm regex vào `NOT_PUBLISHED`, kiểm tra URL trả 404 và không có trong `/search-index.json`.
- File chưa mô tả trong `documents.json` mặc định nhãn **Nội bộ**. Chỉ gắn **Gửi khách được** khi chắc chắn.
- Đề xuất có tên khách hàng → Nội bộ. Datasheet có comment / bản nháp → Nội bộ. Bị thay bằng bản mới → Bản cũ.
- "Gửi bộ tài liệu" ở trang giải pháp chỉ gồm tài liệu Gửi khách được.
- Không hiện giá, chiết khấu, tồn kho chi tiết cho khách: website là nội bộ, nhưng nội dung copy (Zalo, CSV) có thể bị chuyển tiếp.

## Git

- Nhánh mặc định `main`. Tính năng mới tách nhánh `feature/<ten-ngan>` từ `main` mới nhất.
- Chỉ commit khi người dùng yêu cầu. Thay đổi của người dùng trong working tree là của họ: không revert.
- Không sửa lịch sử đã push (rebase, amend, force push) trừ khi người dùng yêu cầu rõ.
- Trước commit: `git status` + `git diff --stat`, kiểm tra không có `.env*`, `.data/`, `.vercel/`, file > 50MB lạ.
- Commit message tiếng Việt, tiền tố `feat:` / `ui:` / `fix:` / `data:` / `docs:` / `chore:`, kết thúc bằng dòng attribution theo hướng dẫn hệ thống.
- Hook lỗi → sửa nguyên nhân; không dùng `--no-verify`.

## Hành động phải hỏi trước

- Merge, push, xoá nhánh, tạo PR.
- Deploy Production (`vercel deploy --prod`), đổi env trên Vercel, đổi OAuth Client.
- Xoá file trong `public/img/`, `Data/` hoặc bất kỳ file người dùng tạo.
- Gỡ / thêm giải pháp, dòng sản phẩm, trang, mục menu.
- Đổi nhãn tài liệu sang "Gửi khách được" khi tài liệu không ghi rõ.
- Thêm dependency, đổi phiên bản Next / Auth.js (Auth.js đang ghim `5.0.0-beta.32`).
- Gửi nội dung ra dịch vụ ngoài (web search có chứa dữ liệu nội bộ, API bên thứ ba).

## Hành động không cần hỏi

- Đọc file, tìm kiếm code, chạy `lint` / `check-data` / `build` / `screenshot`.
- Tạo script tạm trong scratchpad.
- Sửa lỗi lint / type do chính thay đổi của mình gây ra.
- Cập nhật rule / CLAUDE.md khi người dùng yêu cầu tổng kết.

## Kiểm tra trước khi báo xong

- Thay đổi code lớn: `npm run lint` (0 lỗi) và `npm run build` (qua). Build tự chạy `copy-assets` + `check-data`.
- Chỉ sửa dữ liệu: `npm run check-data` trước, rồi `npm run build`.
- Đổi giao diện: build → `AUTH_DISABLED=1` + `npm start` → `npm run screenshot -- <bước-tên> <url> [cao]` → mở ảnh xem lại.
- Mobile 375px: không cuộn ngang cả trang; vùng chạm ≥ 44px; chữ không tràn.
- Đổi auth / proxy: chạy server **không** có `AUTH_DISABLED`, kiểm tra trang → 307 `/dang-nhap`, `/api/*` → 401.
- Đổi route API: kiểm tra `outputFileTracingIncludes` nếu route đọc `lib/data`.
- Cảnh báo lint hiện có: 6 cảnh báo `<img>` (cố ý). Không thêm cảnh báo mới.

## Báo cáo kết quả

- Nói đúng sự thật: lỗi thì kèm output; bước bỏ qua thì nói bỏ qua và vì sao.
- Không nói "đã kiểm tra" với thứ chưa chạy thật (VD đăng nhập Production chưa thử bằng trình duyệt).
- Nêu rõ thay đổi nằm ở nhánh nào, đã commit chưa, đã push chưa.
- Nêu rõ các điểm cần người dùng / PM quyết.
- Câu trả lời tiếng Việt; thuật ngữ kỹ thuật giữ tiếng Anh.

## Ngôn ngữ và đối tượng

- Giao diện, dữ liệu hiển thị, rule, báo cáo: tiếng Việt.
- Giữ tiếng Anh: IR, WDR, PoE, NDAA, ONVIF, H.265, IP67, IK10, Edge AI, LPR, ANPR, SFP+, VLAN, SoC, VMS, EMS, FMS, DMS.
- Người dùng chính: Sales, Presales, Ban giám đốc. Ưu tiên tìm nhanh, tin được, copy gửi khách được.

## Phụ thuộc và công cụ

- Stack đã chốt (xem `project-overview.md`). Không đổi framework, không thêm UI kit, không thêm thư viện state.
- Công cụ xử lý PDF / ảnh (pdfjs-dist, @napi-rs/canvas, sharp) chỉ cài trong scratchpad, không vào `package.json`.
- Vercel CLI dùng `npx vercel@65.3.1` (ghim bản), không cài global.

## Khi không chắc

- Thiếu thông tin quyết định → hỏi người dùng một câu cụ thể, kèm đề xuất mặc định.
- Thông số không rõ → để trống + ghi `unconfirmed`, không đoán.
- Không rõ tài liệu có được gửi khách → Nội bộ.
- Không rõ có ảnh hưởng Production → không làm, hỏi trước.

## Rule nào áp dụng khi nào

- Luôn nạp: `mandatory-rule.md`, `project-overview.md`, `workflow.md`.
- Sửa `Data/**`: `data-integrity.md`, `data-structure.md`, `content-writing.md` (Site / Solutions / Documents).
- Sửa `app/**`, `components/**`: `design-system.md`, `site-structure.md`, `coding-convention.md`, `content-writing.md`.
- Sửa `lib/**`, `scripts/**`: `coding-convention.md` (+ `data-structure.md` cho `lib/data`, scripts).
- Sửa auth / proxy / API / tồn kho / copy-assets / env: `security-and-access.md`.

## Thứ tự ưu tiên giữa các rule

1. `mandatory-rule.md` (file này)
2. `security-and-access.md`, `data-integrity.md`
3. `workflow.md`
4. `data-structure.md`, `coding-convention.md`, `design-system.md`, `site-structure.md`, `content-writing.md`
5. `project-overview.md` (bối cảnh)
6. Yêu cầu cụ thể của người dùng trong phiên được ưu tiên hơn mục 3–5, nhưng không vượt mục 1–2 khi chưa được xác nhận rõ.

## Giữ phạm vi thay đổi

- Chỉ sửa điều được yêu cầu và điều bắt buộc để nó chạy đúng. Cải tiến ngoài phạm vi → đề xuất, không tự làm.
- Không đổi tên file / route / tham số URL / class CSS đang dùng khi không cần.
- Không format lại cả file khi chỉ sửa vài dòng (diff khó review, dễ đè thay đổi của người dùng).
- Không xoá dữ liệu "có vẻ thừa" (`flow` trong `capability.json`, trường `page`) — có thể dùng để đối chiếu.
- Gỡ / ẩn nội dung theo yêu cầu: gỡ ở giao diện, giữ dữ liệu nguồn nếu còn giá trị tra cứu; nói rõ trong báo cáo.

## Dấu hiệu phải dừng lại và hỏi

- Lệnh sắp chạy chạm tới `Data/`, `public/img/`, `.env*`, `.vercel/`, lịch sử git.
- Sửa sẽ làm thay đổi nội dung Sales gửi khách (nhãn Gửi khách được, thông số, copy Zalo).
- Hai nguồn dữ liệu mâu thuẫn và không xác định được bản mới hơn.
- Build / test chỉ qua được khi nới lỏng schema, bỏ kiểm tra, hoặc tắt lint rule.
- Yêu cầu có thể đưa nội dung nội bộ ra ngoài (web search kèm dữ liệu nội bộ, upload lên dịch vụ ngoài).

## Checklist trước khi commit

- [ ] `git status` sạch ngoài các file định commit; không có `.env*`, `.data/`, `.vercel/`, `node_modules/`.
- [ ] Không có secret: tìm `AUTH_SECRET=`, `GOCSPX-`, `private_key`, `BEGIN PRIVATE KEY`, `vercel_blob_rw_` trong diff.
- [ ] `npm run lint` 0 lỗi; `npm run build` qua.
- [ ] Ảnh mới trong `public/img/` đã tối ưu (sản phẩm ≤ ~600KB, cảnh ≤ ~300KB, ưu tiên webp / jpg).
- [ ] Không commit ảnh gốc nhiều MB khi web không dùng trực tiếp (hỏi người dùng nếu họ muốn commit).
- [ ] CLAUDE.md cập nhật nếu thay đổi trạng thái / quyết định.
- [ ] Đang ở đúng nhánh (không commit tính năng dở dang lên `main`).

## Lệnh shell trên Windows

- PowerShell 5.1: không có `&&` / `||`; dùng `A; if ($?) { B }`. Không có `?:`, `??`.
- Không redirect `2>&1` với lệnh native trong PowerShell (sinh lỗi giả).
- Dừng server cổng 3000: tìm PID qua `Get-NetTCPConnection -LocalPort 3000`, `Stop-Process -Id <pid>`. Dừng task nền chỉ giết shell bọc ngoài.
- Biến môi trường tạm: `$env:AUTH_DISABLED='1'; npx next start -p 3000`. PowerShell không đặt được biến rỗng → muốn tắt thì `Remove-Item Env:NAME`.
- Lệnh tương tác (`git rebase -i`, prompt mật khẩu) không chạy được: không dùng.
- Đường dẫn dự án có dấu cách: luôn đặt trong nháy kép.

## Sự cố đã gặp (không lặp lại)

- Commit lỡ chứa secret trong `.env.example` → phải reset trước khi push. Luôn soát diff.
- Vercel build `ENOENT Data/MK Vision` khi tài liệu chưa có trong git → đã đưa lên git.
- `/api/ton-kho` Production `ENOENT /var/task/Data/Products` do tracing loại `Data` → thêm `outputFileTracingIncludes`.
- Ảnh đổi nội dung nhưng giữ tên → Next image cache trả ảnh cũ.
- Đọc PDF tên tiếng Việt NFD lỗi → copy sang scratchpad tên ASCII rồi đọc.
- Sửa file CRLF bằng chuỗi LF không khớp → chuẩn hoá xuống dòng khi thay thế.
- Đọc file secret để tự tạo cookie đăng nhập → bị từ chối, đúng: không làm.

## Bảng tra nhanh: tình huống → hành động

| Tình huống | Hành động |
|---|---|
| Datasheet và slide ghi khác nhau | Lấy datasheet mới nhất, ghi `unconfirmed`, báo người dùng |
| Model trong tài liệu không có trang | Không tạo trang nếu chưa có datasheet; ghi "Chưa có datasheet trên web" |
| Người dùng sửa file trong lúc làm | Coi là chủ ý, đọc lại, không revert |
| Build lỗi do dữ liệu | Đọc thông báo `[Data] <file>: …`, sửa dữ liệu, không nới schema |
| Cần ảnh từ PDF | Cắt trong scratchpad → webp/jpg tối ưu → `public/img/<nhóm>/` |
| Ảnh đổi nhưng web vẫn hiện ảnh cũ | Đặt tên file mới (Next image cache theo đường dẫn), rebuild |
| Lộ secret | Báo ngay, đề xuất rotate, ghi CLAUDE.md |
| Classifier / người dùng từ chối lệnh | Không thử lại y nguyên; đổi cách hoặc hỏi |
| Tài liệu mới nhạy cảm | Thêm `NOT_PUBLISHED`, kiểm 404 |
| Cần merge / deploy | Hỏi người dùng |
