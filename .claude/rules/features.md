---
paths:
  - "app/**"
  - "components/**"
  - "lib/search/**"
---

# Tính năng chính

1. **Trang chủ `/`**: hero ảnh tối + ô tìm kiếm lớn + lối tắt theo dòng; khối chọn dòng sản phẩm; 3 giải pháp; banner điểm nhấn; carousel sản phẩm; bento năng lực; CTA tối.
2. **Tìm kiếm toàn cục** (`lib/search/rank.ts`): khớp model đứng đầu; mọi cụm từ trong truy vấn phải có mặt, kèm từ đồng nghĩa (khuôn mặt = face, biển số = LPR/ANPR…); Fuse chỉ dùng khi không có kết quả (bắt lỗi gõ). Phím tắt `/` hoặc `Ctrl+K`, không phân biệt dấu, link chia sẻ `/#tim=tu-khoa`. Chỉ mục sinh lúc build ở `/search-index.json`.
3. **Sản phẩm `/san-pham`**: lọc nhanh theo nhu cầu (`need`: LPR, khuôn mặt, PoE, NDAA, ngoài trời), dòng, loại, độ phân giải, tính năng AI chuẩn; số đếm cập nhật theo các bộ lọc khác; mobile thu gọn bộ lọc chi tiết; bộ lọc lưu trên URL; chọn tối đa 4 để so sánh.
4. **Chi tiết `/san-pham/[slug]`**: thông số chính theo loại thiết bị (switch: cổng / uplink / PoE), tóm tắt, điểm nổi bật, tính năng AI chuẩn, bảng thông số theo nhóm với cảnh báo "Chưa chốt" tại ô, tài liệu kèm nhãn trạng thái, giải pháp liên quan; nút Datasheet (ưu tiên bản gửi khách được), copy thông số, copy rút gọn (Zalo), so sánh (`/so-sanh?add=slug` thêm vào danh sách).
5. **So sánh `/so-sanh`**: 2–4 model, nhãn thông số chuẩn hoá để xếp cùng hàng, tô dòng khác nhau, "chỉ dòng khác nhau", copy bảng (Excel/email), tải CSV, copy rút gọn (Zalo). `?ids=` là link chia sẻ, không ghi đè danh sách riêng.
6. **Giải pháp `/giai-phap`, `/giai-phap/[slug]`**: bài toán, kiến trúc, phân hệ, lợi ích, cấu hình đề xuất, hình ảnh/sơ đồ, sản phẩm đề xuất, gửi bộ tài liệu (chỉ tài liệu Gửi khách được), nguồn.
0. **Đăng nhập `/dang-nhap`** (Google, chỉ `@mkvision.com`; `auth.ts`, `proxy.ts`): mọi trang và tài liệu cần đăng nhập, quay lại đúng trang sau khi đăng nhập (`callbackUrl`); trang đăng nhập ẩn header/footer (`ChromeGate`); menu tài khoản trên header có Đăng xuất.
7. **Tính năng AI `/thuat-toan-ai`** (từ điển tính năng chuẩn, model hỗ trợ, mô tả theo tài liệu; anchor `#id`) và **Thư viện tài liệu `/tai-lieu`** (lọc theo trạng thái, loại, dòng/chủ đề).
