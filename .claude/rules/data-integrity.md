---
paths:
  - "Data/**"
  - "public/img/products/**"
---

# Tính chính xác của dữ liệu sản phẩm

- Mọi thông số phải lấy từ datasheet, không tự suy đoán. Thiếu thì để trống; trên giao diện ô thiếu hiển thị "—", không ẩn hàng.
- Không điền giá trị "phổ biến" hay copy từ model tương tự.
- Khi chuyển dữ liệu từ PDF/DOCX sang JSON: đọc bảng theo hàng/ô, giữ đúng đơn vị, cách ghi và ngôn ngữ của datasheet (kể cả lỗi chính tả trong bản gốc).
- Khi hai tài liệu ghi khác nhau: chọn bản mới nhất nếu xác định được, ghi rõ xung đột vào trường `notes` và báo lại cho người dùng. Không tự sửa im lặng.
- Mỗi sản phẩm phải có datasheet nguồn trong `sources`. Ghi `updatedAt` nếu datasheet có ngày/phiên bản.
- `category` / `resolution` chỉ là nhãn ngắn cho bộ lọc; giá trị nguyên văn luôn nằm trong `specs`.
- Không đưa thông tin nội bộ (giá, chiết khấu, tên khách hàng) vào dữ liệu nếu chưa được yêu cầu. Tài liệu đề xuất cho khách hàng cụ thể chỉ dùng để hiểu chức năng.
- Liên kết sản phẩm với giải pháp chỉ khi tên model khớp đúng; tên gần giống (VD "MKST/P28-3100" vs "MKST28-5150") là model khác — ghi chú, không liên kết.
