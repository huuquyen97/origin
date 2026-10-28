---
paths:
  - "lib/strings.ts"
  - "lib/labels.ts"
  - "Data/Site/**"
  - "Data/Solutions/**"
  - "Data/Documents/**"
  - "app/**/*.tsx"
  - "components/**/*.tsx"
---

# Nội dung và văn phong

Cách viết chữ hiển thị trên website (nhãn, tiêu đề, mô tả, cảnh báo, nguồn) và nội dung trong `Data/Site`, `Data/Solutions`, `documents.json`. Người đọc là Sales / Presales cần câu trả lời nhanh để nói với khách.

## Guardrail (đọc trước)

- **Không viết điều tài liệu không nói.** Mô tả, điểm nổi bật, lợi ích phải có nguồn trong `/Data`. Câu marketing tự nghĩ ra là sai quy tắc.
- **Không biến năng lực chung thành thông số model.** "IP65/IP67", "2–10 TOPS" từ hồ sơ năng lực là năng lực công ty; trang model chỉ ghi thông số datasheet của model đó.
- **Không giá, chiết khấu, tên khách hàng, tên nhân sự** trong mọi chuỗi hiển thị.
- **Cảnh báo phải nói hành động** ("Cần PM xác nhận trước khi báo khách"), không chỉ nói "có lỗi".
- **Thuật ngữ kỹ thuật giữ tiếng Anh**, không dịch gượng (không "Cấp nguồn qua Ethernet" thay cho PoE trong nhãn ngắn).
- **Trích nguồn đúng**: tên tài liệu + trang; tài liệu không phát hành thì không link.
- **Trang `/nang-luc` không ghi "Hồ sơ năng lực 2026" / số trang** (yêu cầu người dùng 27/10); các trang khác vẫn ghi nguồn.

## Giọng văn

- Tiếng Việt chuẩn, câu ngắn, chủ động, đi thẳng vào thông tin.
- Xưng hô trung tính; không "bạn ơi", không cảm thán, không emoji.
- Tiêu đề nói điều người dùng làm được hoặc nhận được: "Tất cả sản phẩm", "Kịch bản ứng dụng theo ngành", "Khách hỏi gì, tra là có."
- Lead (đoạn mở đầu) ≤ 2 câu, nói trang này giúp gì: "Lọc theo nhu cầu của khách, dòng, loại thiết bị, độ phân giải và tính năng AI."
- Không lặp tiêu đề trong lead; không mở đầu bằng "Trang này…".
- Không viết hoa toàn bộ câu; viết hoa chữ đầu câu và tên riêng / tên dòng sản phẩm.

## Thuật ngữ giữ nguyên tiếng Anh

- Hình ảnh: IR, WDR, HDR, BLC, HLC, DNR, Starlight, Day/Night.
- Mạng: PoE, PoE+, SFP, SFP+, VLAN, QoS, LACP, ERPS, STP, L2+, L3, uplink, Wi-Fi 6.
- Chuẩn / chứng nhận: ONVIF Profile S/G/T/M, NDAA, FIPS 140-2, IP66, IP67, IK10, QCVN, ISO 9001.
- Nén / giao thức: H.264, H.265, H.265+, RTSP, MQTT, SDK, API.
- AI: Edge AI, AI on Edge, LPR, ANPR, FR, DMS, ADAS, Re-ID, LLM, TOPS, CVflow.
- Phần cứng: SoC, CMOS, PTZ, Bullet, Dome, PCBA, SMT, AOI, SPI.
- Nền tảng: VMS, EMS, FMS, COMS, ACP, DEMS.
- Quy trình: EVT, DVT, PVT, MP, IQC, PQC, OQC.

## Thuật ngữ tiếng Việt thống nhất

| Dùng | Không dùng |
|---|---|
| Sản phẩm / model | Mặt hàng, SKU |
| Thông số kỹ thuật | Spec (trong giao diện) |
| Tính năng AI | Thuật toán (trong nhãn menu); "thuật toán" chỉ trong mô tả kỹ thuật |
| Giải pháp | Solution |
| Tài liệu | File, document |
| Gửi khách được / Nội bộ / Bản cũ / Hết hạn | Public / Internal / Old / Expired |
| Còn hàng / Sắp hết / Hết hàng / Chưa có số liệu | In stock / Low / Out |
| Dòng sản phẩm | Series (chỉ dùng "series" cho phân hạng A/B/E/S của danh mục) |
| Danh mục model | Catalog (trong giao diện) |
| Kịch bản ứng dụng | Use case |
| Chưa chốt / Cần PM xác nhận | TBD, N/A |
| Tổng quan | Home, Trang chủ (menu dùng "Tổng quan") |
| Đăng nhập / Đăng xuất | Login / Logout |
| Xoá bộ lọc | Reset |
| Đã copy vào clipboard | Copied |

## Tiêu đề trang (metadata)

- `title` ngắn, tiếng Việt, khớp mục menu: "Sản phẩm", "Giải pháp", "Tính năng AI", "Thư viện tài liệu", "So sánh sản phẩm", "Năng lực MK Vision".
- Template layout tự thêm hậu tố ` · MK Vision`.
- Trang chi tiết: `<Model> — <Tên>` ("VB50FB1V — Camera Dome AI 5MP"); không tìm thấy → "Không tìm thấy sản phẩm".
- Breadcrumb bắt đầu "Tổng quan", nhãn trùng tiêu đề menu.

## Nhãn và nút

- Động từ + đối tượng, 1–4 từ: "Tải datasheet", "So sánh", "Xem giải pháp", "Copy rút gọn (Zalo)", "Xoá bộ lọc".
- Link "Xem thêm →" cho section; "Xem bảng tồn kho" cho đích cụ thể.
- Nút có trạng thái: đổi chữ khi xử lý ("Đang chuyển tới Google…").
- Pill bộ lọc: danh từ ngắn + số đếm ("PTZ 3").
- Nhãn nhóm bộ lọc: "Dòng sản phẩm", "Loại thiết bị", "Độ phân giải", "Tính năng AI", "Series", "Kiểu dáng", "Kết nối", "Môi trường".
- Nhãn tài liệu chỉ ghi "(nội bộ)" khi nút Datasheet trỏ tới bản Nội bộ.

## Số, đơn vị, ngày

- Thông số: giữ nguyên văn datasheet (đơn vị, dấu thập phân, khoảng trắng). VD "1,397,760", "0.3 micro" giữ như nguồn.
- Chuỗi giao diện tự viết: số kiểu Việt Nam ("≈1,4 triệu", "82.000 linh kiện/giờ").
- Ngày hiển thị: `dd/mm/yyyy`; giờ + ngày: `vnDateTime()` → "10:32 22/10/2026".
- Ngày trong dữ liệu: ISO `YYYY-MM-DD` (`validFrom`, `validTo`, `updatedAt`).
- Tháng danh mục: "Tháng 6/2026", "06/2026".
- Ô thiếu: "—" (`T.missing`), không "N/A", không để trống.
- Phần trăm: "80%" (không dấu cách).
- Độ phân giải: "5MP", "8MP" (không dấu cách) theo cách ghi phổ biến của datasheet.

## Cảnh báo và trạng thái

- Cấu trúc: **điều gì khác** + **vì sao** + **cần làm gì**.
  - "Danh mục ghi “Không hỗ trợ AI” nhưng datasheet trên web có tính năng AI. Cần PM xác nhận trước khi báo khách."
  - "Ảnh ghi “WiFi”; datasheet chuẩn (Datasheet _Mobi Secure.pdf) không ghi Wi-Fi."
  - "Kịch bản định hướng trong hồ sơ năng lực, chưa có giải pháp chi tiết trên web. Trao đổi với Presales trước khi chào khách."
- Dùng nháy kép cong “…” khi trích chữ trong tài liệu / ảnh.
- Thông báo trống: nói lý do + gợi ý ("Không có model khớp bộ lọc." + nút Xoá bộ lọc).
- Lỗi hệ thống: câu chung, không lộ chi tiết kỹ thuật ("Không tải được số tồn kho").
- Tồn kho cũ: "Chưa đọc được file mới nhất, đang hiện số liệu lần đọc trước".

## Ghi nguồn

- Cuối khối / trang, chữ nhỏ `muted`: "Nguồn: <tên tài liệu>, tr.X".
- Tài liệu phát hành → có thể link tới `/files/...` hoặc thư viện; tài liệu `NOT_PUBLISHED` → chỉ tên, không link.
- Số liệu trang chủ: `sub` trong `home.json` ghi nguồn ("Nguồn: Hồ sơ năng lực 2026, tr.34–35").
- Dữ liệu `Data/Site/*.json` giữ trường `page` / `source` để đối chiếu, kể cả khi giao diện không hiện.
- Ảnh minh hoạ từ hồ sơ: ghi `PROFILE.illustration` ("Hình minh họa từ hồ sơ năng lực. Thông số chính xác của model xem bảng thông số / datasheet.").

## Nội dung sản phẩm (`Data/Products`)

- `name`: tên loại thiết bị ngắn tiếng Việt / theo datasheet ("Camera Bullet AI 5MP").
- `summary`: 1–3 câu tóm tắt từ datasheet / brochure chính thức; không so sánh với hãng khác.
- `features`: điểm nổi bật nguyên văn hoặc rút gọn sát nghĩa từ tài liệu; mỗi mục một ý.
- `aiFeatures`: nguyên văn datasheet; gom nghĩa qua `aliases` trong `features.json`.
- `specs`: nguyên văn; nhãn tiếng Việt hiển thị qua `specLabel`.
- `notes`: cho người bảo trì (nguồn, xung đột), không hiển thị.
- `unconfirmed.note`: một câu nói rõ hai nguồn ghi khác nhau thế nào.

## Nội dung giải pháp (`Data/Solutions`)

- `painPoints`: bài toán của khách, mỗi mục một câu ngắn.
- `architecture`: chuỗi văn bản (không mảng), mô tả luồng thiết bị → nền tảng → người dùng.
- `modules`: tên phân hệ + mô tả 1 câu.
- `benefits`: lợi ích đo được / cụ thể, theo tài liệu.
- `configuration`: hạng mục theo tài liệu; `product` chỉ khi tài liệu nêu đúng model.
- `targetCustomers`: loại khách (cơ quan, doanh nghiệp…), không tên khách cụ thể.

## Nội dung `Data/Site`

- `home.json`: `features` (banner) có `eyebrow`, `quote`, `who`, `role` (ghi nguồn ngắn), `cta`; `stats` có `value`, `label`, `sub` (nguồn).
- `series.json`: `tagline` ≤ 1 dòng, `description` 2–3 câu, `highlights` theo slide (ghi "(theo slide)" khi là tuyên bố marketing).
- `capability.json`: trích hồ sơ, giữ `page`; nhãn đã Việt hoá theo người dùng (VD yếu tố Edge AI: Hiệu quả / Chất lượng / Tốc độ / Giá thành).
- `catalog.json`: giữ nguyên tên model, ký hiệu môi trường (K / N) + `envLegend`.
- `scenarios.json`: nhãn điểm nóng trùng chữ trong ảnh; `features` là id chuẩn.
- `feature-shots.json`: `conflicts` liệt kê từng điểm ảnh khác datasheet.

## Mô tả tài liệu (`documents.json`)

- `title`: tên dễ hiểu tiếng Việt + model / phiên bản ("Datasheet VB50FB1V (R1)").
- `type`: một trong `DOC_TYPES`; không rõ → `other`.
- `status` + `statusNote` ngắn giải thích nhãn ("Bị thay bởi bản R1", "Có tên khách hàng").
- `validFrom` / `validTo` cho chứng nhận, giấy phép.

## Chuỗi giao diện (`lib/strings.ts`)

- Gom theo tính năng (`T`, `INV`, `CATALOG`, `SCENE`, `AUTH`, `PROFILE`), có comment một dòng.
- Hàm chuỗi có tham số (`PROFILE.source(pages)`) khi chèn giá trị.
- Không ghép câu bằng nhiều mảnh chuỗi rời (khó đọc, sai ngữ pháp); dùng template.
- Thông báo lỗi Auth.js theo mã (`AUTH.errors`), có `Default`.

## Copy gửi khách (Zalo / email / CSV)

- Mở đầu: model + tên; tiếp theo thông số chính dạng "Nhãn: giá trị" mỗi dòng; cuối: link trang (nội bộ).
- Không chứa nhãn Nội bộ, cảnh báo PM, tồn kho chi tiết, ghi chú nội bộ.
- Thông số chưa chốt: không đưa vào bản rút gọn hoặc đánh dấu rõ "(chưa chốt)".
- CSV: tiêu đề cột tiếng Việt, UTF-8 có BOM để Excel đọc đúng dấu.

## Từ đồng nghĩa tìm kiếm

- Bảng `SYNONYMS` trong `lib/search/rank.ts` (đã bỏ dấu, áp dụng hai chiều Việt ↔ Anh). Hiện có:
  - khuôn mặt = face / facial; nhận diện khuôn mặt = face recognition / FR
  - biển số = LPR / ANPR / license plate / number plate
  - đếm người = people counting; đếm xe = vehicle counting / lưu lượng
  - xâm nhập = intrusion / perimeter; vượt rào = line crossing / hàng rào ảo
  - đám đông = crowd / tụ tập; hàng chờ = queue / xếp hàng; bản đồ nhiệt = heat map
  - tài xế = driver / DMS / lái xe; buồn ngủ = drowsiness / FleetFocus
  - vân tay = fingerprint; căn cước = CCCD / e-ID / eKYC
  - camera hành trình = dashcam / AutoSecure; camera đeo người = body-worn / BWC / MobiSecure
  - đầu ghi = NVR; kiểm soát ra vào = access control; chuyển mạch = switch; cổng = port
  - ngoài trời = outdoor; hồng ngoại = IR; thu phát wifi = access point / Wi-Fi
  - hồ sơ năng lực = profile; hướng dẫn = HDSD / manual; chứng nhận = certificate / GCN
- Sales hay gõ từ mới không có kết quả → thêm nhóm đồng nghĩa (không thêm từ quá chung như "camera", "ai").
- Thêm từ đồng nghĩa → thử lại truy vấn mẫu: "đếm người", "PTZ 40x", "biển số", "CCCD gắn chip", "IP67".

## Tên dòng sản phẩm và nền tảng

- Viết đúng: V-Secure, MobiSecure, AutoSecure, BioSecure, MK Networks, CUVO (tên trong tài liệu gốc có thể viết hoa toàn bộ: V-SECURE, MOBISECURE — giữ nguyên trong tên file / trích dẫn).
- Tên công ty: "MK Vision" (không "MKVision", "Mk Vision"); viết tắt "MKV" chỉ trong mã / tên file.
- Tên model: viết hoa nguyên văn (VB50FB1V, MKSX30-6550, AutoSecure-DAT); slug viết thường.
- Nền tảng: VMS, EMS, FMS, COMS, ACP — viết hoa, có thể kèm tên đầy đủ lần đầu xuất hiện.

## Ví dụ viết tốt / tránh

| Tránh | Viết |
|---|---|
| "Camera thông minh hàng đầu, chất lượng vượt trội" | "Camera Bullet AI 5MP, AI xử lý tại biên (CVflow®), IP67, IK10" |
| "Hỗ trợ nhiều tính năng AI" | "Nhận diện khuôn mặt, nhận diện biển số (LPR), đếm người" |
| "Lỗi dữ liệu" | "Datasheet ghi IP65, slide ghi IP67. Cần PM xác nhận trước khi báo khách." |
| "N/A" | "—" |
| "Click vào đây để xem" | "Xem giải pháp" |
| "Tài liệu private" | "Nội bộ" |
| "Sản phẩm này có thể dùng ngoài trời" (không nguồn) | Chỉ ghi khi datasheet có IP66+ hoặc ghi outdoor |
| "Tương đương Hikvision DS-…" | Không so sánh hãng khác trên trang sản phẩm |

## Kiểm tra nội dung trước khi báo xong

- [ ] Mọi câu mô tả mới có nguồn trong `/Data`.
- [ ] Không có giá, tên khách, tên nhân sự.
- [ ] Thuật ngữ thống nhất theo bảng trên.
- [ ] Ô thiếu là "—"; cảnh báo có hành động.
- [ ] Chữ không tràn ở 375px (tiêu đề dài, model dài, nhãn pill).
- [ ] Không lỗi chính tả tiếng Việt do mình viết (lỗi trong nguồn được giữ nguyên trong `specs`).
