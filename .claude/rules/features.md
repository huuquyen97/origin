---
paths:
  - "app/**"
  - "components/**"
  - "lib/search/**"
---

# Tính năng chính

1. **Trang chủ `/`**: hero ảnh tối + ô tìm kiếm lớn + lối tắt theo dòng; khối chọn dòng sản phẩm; 3 giải pháp; banner điểm nhấn; carousel sản phẩm; bento năng lực; CTA tối.
2. **Tìm kiếm toàn cục** (Fuse.js): model, tên, dòng, tính năng, thông số, giải pháp, thuật toán AI, tài liệu. Phím tắt `/` hoặc `Ctrl+K`, không phân biệt dấu (chuẩn hoá bỏ dấu cả chỉ mục và từ khóa), link chia sẻ `/#tim=tu-khoa`. Chỉ mục sinh lúc build ở `/search-index.json`.
3. **Sản phẩm `/san-pham`**: lọc theo dòng, loại, độ phân giải, tính năng AI; bộ lọc lưu trên URL; chọn tối đa 4 để so sánh.
4. **Chi tiết `/san-pham/[slug]`**: tóm tắt, điểm nổi bật, tính năng AI, bảng thông số theo nhóm, ghi chú dữ liệu, tài liệu, giải pháp liên quan, nút copy thông số / link.
5. **So sánh `/so-sanh?ids=a,b`**: 2–4 model song song, tô các dòng khác nhau, lọc "chỉ dòng khác nhau".
6. **Giải pháp `/giai-phap`, `/giai-phap/[slug]`**: bài toán, kiến trúc, phân hệ, lợi ích, hình ảnh/sơ đồ, sản phẩm đề xuất, tài liệu/slide, nguồn.
7. **Thuật toán AI `/thuat-toan-ai`** và **Thư viện tài liệu `/tai-lieu`** (lọc theo loại và dòng/chủ đề).
