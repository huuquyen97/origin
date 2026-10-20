# An toàn file

- Hệ thống file Windows không phân biệt hoa thường: `data` và `Data` là cùng một thư mục. Xóa `data/` tức là xóa `Data/`.
- Không bao giờ xóa hoặc di chuyển thư mục trong `/Data`. Tài liệu gốc trong `Data/MK Vision/` (Docs, Solutions, Logo) và `Data/Design/` không được sửa.
- Không tạo thư mục chỉ khác hoa thường với thư mục đã có (VD: `data/` cạnh `Data/`).
- Trước khi xóa bất cứ thứ gì: liệt kê chính xác các đích sẽ bị xóa và kiểm tra lại, không dùng xóa đệ quy theo tên mơ hồ.
- Git không theo dõi tài liệu gốc trong `Data/MK Vision/` và `Data/Design/` (.gitignore): xóa/ghi đè ở đó không hoàn tác được. File tạm, script một lần đặt trong scratchpad, không đặt trong dự án.
