# Quy trình làm việc

Cách nhận việc, làm, kiểm tra, bàn giao trong dự án. Áp dụng cho mọi phiên.

## Guardrail quy trình (đọc trước)

- **Hiểu đúng yêu cầu trước khi sửa.** Yêu cầu mơ hồ có ảnh hưởng lớn (xoá, đổi URL, đổi dữ liệu hiển thị cho khách) → hỏi một câu cụ thể kèm đề xuất mặc định.
- **Tính năng mới làm trên nhánh `feature/<ten>` từ `main`.** Không commit tính năng dở lên `main`.
- **Không tự merge / push / deploy Production.** Người dùng review rồi tự làm, hoặc yêu cầu rõ.
- **Không báo xong khi chưa kiểm tra** (lint, build, screenshot nếu đổi giao diện, check-data nếu đổi dữ liệu).
- **Thay đổi của người dùng trong lúc làm là chủ ý.** Đọc lại file, làm tiếp trên bản mới, không revert.
- **Cuối phiên khi được yêu cầu: cập nhật CLAUDE.md** (đã xong, trạng thái, bước tiếp theo, quyết định + lý do).
- **Báo cáo trung thực**: ghi rõ cái gì đã kiểm, cái gì chưa, cái gì cần người khác quyết.

## Phân loại yêu cầu → quy trình

| Loại | Quy trình |
|---|---|
| Hỏi đáp / giải thích code | Đọc code, trả lời; không sửa |
| Phân tích, nghiên cứu, lên kế hoạch | Agent `ba-research` → báo cáo `analysis/` → người dùng chọn hướng |
| Sửa dữ liệu (thông số, tài liệu, nhãn) | Đọc datasheet → sửa JSON → `check-data` → build → screenshot trang liên quan |
| Sửa giao diện nhỏ | Sửa → lint → build → screenshot 1440 / 375 → xem ảnh |
| Tính năng mới | Kế hoạch → nhánh mới → code → kiểm tra → QA agent → sửa → commit nhánh → báo người dùng |
| Sửa lỗi | Tái hiện → tìm nguyên nhân gốc → sửa → kiểm lại kịch bản lỗi + hồi quy |
| Deploy / cấu hình Vercel | Hỏi trước → làm → kiểm Production (307 / 401 / trang chính) |
| Tổng kết phiên | Cập nhật CLAUDE.md (+ rule nếu có quyết định mới), commit khi được yêu cầu |

## Bắt đầu phiên

1. Đọc CLAUDE.md mục "Trạng thái dự án", "Bước tiếp theo", "Quyết định quan trọng".
2. `git status`, `git branch --show-current`, `git log --oneline -5`: biết đang ở nhánh nào, có thay đổi chưa commit không.
3. Đối chiếu memory với code hiện tại trước khi dựa vào (tên file / hàm có thể đã đổi).
4. Nếu CLAUDE.md nói "chưa merge" nhưng git cho thấy đã merge → tin git, cập nhật CLAUDE.md khi tổng kết.

## Lên kế hoạch tính năng

- Nêu: mục tiêu cho Sales / Presales, phạm vi, dữ liệu nguồn, trang / component bị ảnh hưởng, rủi ro dữ liệu, cách kiểm tra.
- Tách câu hỏi cần người dùng / PM chốt (xung đột dữ liệu, nội dung nhạy cảm, đổi menu).
- Tận dụng thành phần có sẵn (xem `site-structure.md`, `design-system.md`).
- Kế hoạch lớn / nghiên cứu thị trường → agent `ba-research`, báo cáo lưu `analysis/`.
- Người dùng từ chối kế hoạch kèm ghi chú → làm theo ghi chú, không làm phần bị bỏ.

## Nhánh và commit

- Nhánh: `feature/<ten-ngan>` (VD `feature/inventory`, `feature/nang-luc-danh-muc`), từ `main` mới nhất.
- Commit theo bước có ý nghĩa, message tiếng Việt:
  - `feat:` tính năng mới
  - `ui:` giao diện
  - `fix:` sửa lỗi
  - `data:` dữ liệu / tài liệu
  - `docs:` CLAUDE.md, rule, README
  - `chore:` cấu hình, script
- Message nêu cái gì + vì sao ngắn gọn; dòng cuối là attribution theo hướng dẫn hệ thống.
- Commit gộp thay đổi của người dùng chỉ khi họ cho phép; nêu rõ trong báo cáo.
- Không amend / rebase commit đã push.

## Quy trình sửa dữ liệu

1. Xác định tài liệu nguồn trong `Data/MK Vision/` (ưu tiên PDF chính thức mới nhất).
2. Đọc bảng theo hàng / ô; PDF tên tiếng Việt lỗi đọc → copy sang scratchpad tên ASCII.
3. Sửa `Data/Products/<slug>.json` / `Solutions` / `Documents` / `AI` / `Site` giữ nguyên văn.
4. Xung đột → `unconfirmed` (sản phẩm) hoặc `conflicts` (ảnh chú thích), báo người dùng.
5. `npm run check-data` → đọc cảnh báo (alias AI chưa gắn, tài liệu chưa gắn trạng thái).
6. `npm run build` → screenshot trang sản phẩm / so sánh / tìm kiếm liên quan.
7. Ghi vào CLAUDE.md mục chờ PM nếu còn điểm chưa chốt.

## Quy trình sửa giao diện

1. Đọc component + class trong `globals.css` liên quan.
2. Sửa theo `design-system.md`; chuỗi mới vào `lib/strings.ts`.
3. `npm run lint`, `npm run build`.
4. Chạy server: `$env:AUTH_DISABLED='1'; npx next start -p 3000` (nền).
5. `npm run screenshot -- <NN-ten-buoc> http://localhost:3000/<duong-dan> [chiều cao]`.
6. Mở ảnh `screenshots/<NN-ten-buoc>-desktop.png` và `-mobile.png` để xem thật.
7. Tương tác (lightbox, tab, lọc) → kiểm bằng CDP / trình duyệt; script screenshot mobile không chạy JS.
8. Dừng server (giết PID cổng 3000).

## Quy trình sửa lỗi

1. Tái hiện: URL, bề rộng màn hình, thao tác, dữ liệu liên quan; chụp ảnh trước khi sửa nếu là lỗi giao diện.
2. Tìm nguyên nhân gốc (dữ liệu, tracing, cache ảnh, Suspense, CSS tràn…), không vá triệu chứng.
3. Sửa nhỏ nhất đủ đúng; không kèm refactor.
4. Kiểm lại đúng kịch bản lỗi + trang lân cận dùng chung component.
5. Lỗi Production: kiểm lại trên Production sau deploy (hoặc ghi "chưa kiểm Production" trong báo cáo).
6. Ghi vào "Sự cố đã gặp" (`mandatory-rule.md`) nếu là lỗi dễ lặp lại.

## Đặt tên ảnh chụp

- `screenshots/<NN>-<ten-buoc>-desktop.png` và `-mobile.png`; `NN` tăng dần theo tính năng (hiện tới `18-*`).
- QA agent dùng tiền tố `qa-*`.
- Ảnh chụp có thể commit cùng tính năng (đã làm trước đây); không chụp màn hình chứa secret / dữ liệu tồn kho thật nếu sẽ commit.

## Kiểm thử QA

- Sau mỗi tính năng: chạy agent `qatesting` (end user + QC Manager), chỉ báo cáo.
- Đọc báo cáo, sửa lỗi trong phạm vi tính năng; lỗi ngoài phạm vi → ghi CLAUDE.md "góp ý QA chưa làm".
- Kiểm lại sau khi sửa (lint, build, screenshot).
- Agent mới / sửa agent chỉ nạp ở phiên mới.

## Nghiên cứu / phân tích (agent `ba-research`)

- Dùng khi: lên kế hoạch tính năng, tối ưu tính năng, nghiên cứu thị trường / đối thủ / cách làm tương tự, so sánh lựa chọn, thu thập thông tin.
- Đầu vào cho agent: câu hỏi rõ, phạm vi, ràng buộc (không giá, không tên khách, nguồn nội bộ không gửi ra ngoài), file liên quan.
- Đầu ra: báo cáo ≤ 500 từ tại `analysis/YYYY-MM-DD-<chu-de>.md` + tóm tắt trả về.
- Agent không sửa code / dữ liệu; quyết định triển khai thuộc người dùng.
- Báo cáo agent là đầu vào, không phải kết luận: kiểm lại các điểm quan trọng trước khi làm.

## Kiểm tra trước khi báo xong

| Thay đổi | Bắt buộc |
|---|---|
| Code bất kỳ | `npm run lint` 0 lỗi |
| Code / dữ liệu | `npm run build` qua |
| Dữ liệu | `npm run check-data` trước build |
| Giao diện | Screenshot 1440 + 375, mở xem; không cuộn ngang; chạm ≥ 44px |
| Auth / proxy | Server không `AUTH_DISABLED`: trang → 307 `/dang-nhap`, `/api/*` → 401 |
| API mới | 401 khi chưa đăng nhập, 200 khi có; `outputFileTracingIncludes` |
| Tài liệu nhạy cảm | URL `/files/...` → 404; không có trong `/search-index.json` |
| Menu | 1024px + 1280px không xuống dòng |

## Deploy

- Mặc định: người dùng push `main` → Vercel tự build (nếu project đã nối repo GitHub).
- Thủ công (khi được yêu cầu): `npx vercel@65.3.1 deploy --prod` từ máy; CLI upload cả thư mục làm việc → cất file chưa commit trước; `.vercelignore` loại secret / file sinh.
- Env Production: `npx vercel@65.3.1 env add <TEN> production --sensitive`; Sensitive không đọc lại được.
- Sau deploy kiểm: trang → 307 `/dang-nhap`; `/files/...` → 307; `/search-index.json` → 307; `/api/ton-kho` → 401; nút Google đúng `redirect_uri` + `hd`.
- Lỗi lúc chạy: `npx vercel@65.3.1 logs -e production` (Hobby giữ ~30 phút) → tìm tiền tố `[ton-kho]`.
- Ghi kết quả deploy + điểm chưa kiểm vào CLAUDE.md.

## Làm việc với server local

- Build trước rồi `next start` (gần Production hơn `next dev`); `next dev` chỉ khi sửa nhanh.
- Port 3000 bận (EADDRINUSE) → tìm và dừng tiến trình cũ, không đổi port lung tung.
- Tồn kho trên máy: `INVENTORY_LOCAL_FILE=templates/ton-kho-mau.csv` hoặc Sheet thật qua `.env.local`.
- Đổi `.env.local` → khởi động lại server.
- Trang tĩnh: đổi dữ liệu / ảnh phải build lại mới thấy.

## Tổng kết phiên (khi người dùng yêu cầu)

1. `git status`, `git log`: xác định đã commit / merge / push gì (người dùng có thể đã tự làm).
2. CLAUDE.md:
   - "Trạng thái dự án": ngày cập nhật, git (nhánh đã gộp), triển khai.
   - "Đã xong": mỗi phần một dòng — làm gì, đã kiểm gì, ảnh `screenshots/NN-*`.
   - "Chưa xong / chờ người khác": việc chờ PM / người dùng, rủi ro còn mở.
   - "Bước tiếp theo": đánh số, cụ thể, làm được ngay ở phiên sau.
   - "Quyết định quan trọng và lý do": quyết định mới, mỗi dòng có **vì sao**.
3. Rule trong `.claude/rules/` nếu quy ước thay đổi (VD route mới → `site-structure.md`).
4. Memory: chỉ điều không suy ra được từ repo (kế hoạch dài hạn, sở thích người dùng).
5. Commit `docs:` khi được yêu cầu; không push trừ khi được yêu cầu.

## Báo cáo cho người dùng

- Câu đầu: kết quả chính (đã làm gì, ở nhánh nào, commit nào).
- Tiếp theo: thay đổi cụ thể (gạch đầu dòng ngắn), kết quả lint / build / ảnh.
- Cuối: việc cần người dùng quyết / làm (merge, push, PM xác nhận), rủi ro.
- File nhắc tới dùng link markdown đường dẫn tương đối.
- Không lặp lại nội dung đã báo ở tin nhắn trước.
- Tiếng Việt, thuật ngữ kỹ thuật tiếng Anh.

## Khi bị chặn

- Lệnh bị từ chối (người dùng / classifier) → không chạy lại y nguyên; đổi cách hợp lệ hoặc nhờ người dùng tự chạy (VD `git push`).
- Thiếu quyền / secret (Vercel Sensitive, OAuth) → nói rõ không đọc được, hướng dẫn người dùng kiểm tra trên giao diện web.
- MCP / dịch vụ cần xác thực → báo người dùng xác thực, không xin token qua chat.
- Build lỗi không phải do mình → báo nguyên văn, đề xuất cách sửa, hỏi trước khi sửa phần ngoài phạm vi.

## Làm việc với PM / dữ liệu chờ chốt

- Danh sách chờ PM nằm trong CLAUDE.md và trường `unconfirmed` / `conflicts` / `notes`.
- Khi PM chốt: sửa JSON, gỡ `unconfirmed`, cập nhật nhãn tài liệu, `check-data` → build → screenshot, xoá mục khỏi danh sách chờ.
- Không coi lời nói miệng là nguồn: cần tài liệu (datasheet mới, email xác nhận đưa vào `/Data`).

## Làm việc song song / agent

- Agent con chỉ dùng khi việc độc lập (QA, nghiên cứu, rà nhiều file); việc vài lệnh tự làm.
- Giao việc cho agent: mục tiêu, phạm vi, file cần đọc, điều đã loại trừ, định dạng kết quả.
- Không làm lại việc đã giao cho agent; chờ kết quả rồi kiểm điểm quan trọng.

## Mẫu kế hoạch tính năng

```
Mục tiêu: <Sales / Presales làm được gì nhanh hơn>
Phạm vi: <trang, route, dữ liệu> · Ngoài phạm vi: <…>
Dữ liệu nguồn: <file trong /Data, trang tài liệu>
Thay đổi: <file mới / sửa, component tái dùng>
Rủi ro: <xung đột dữ liệu, nội dung nhạy cảm, Production>
Cần chốt: <câu hỏi cho người dùng / PM>
Kiểm tra: <lint, build, screenshot NN-*, QA, 307/401>
```

## Mẫu báo cáo hoàn thành

```
<Kết quả chính: đã làm gì, nhánh, commit / chưa commit>
- Thay đổi: <gạch đầu dòng ngắn, link file>
- Kiểm tra: lint <kết quả>, build <số trang>, ảnh screenshots/NN-*
- Chưa làm / bỏ qua: <lý do>
- Cần bạn quyết: <merge, push, PM xác nhận…>
```

## Định kỳ / khi rảnh

- Chạy lại `qatesting` toàn site sau nhiều tính năng.
- Rà góp ý QA chưa làm trong CLAUDE.md.
- Kiểm tài liệu sắp hết hạn (`validTo`) — Hết hạn tự tính lúc build, cần build lại để cập nhật nhãn.
- Kiểm cảnh báo `check-data` (alias AI chưa gắn: hiện có A612, M6).
