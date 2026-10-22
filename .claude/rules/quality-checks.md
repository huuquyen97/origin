# Kiểm tra trước khi báo xong

- Mỗi thay đổi lớn: `npm run lint` và `npm run build` phải qua (build tự chạy `copy-assets` + `check-data` ở bước prebuild).
- Chỉ sửa dữ liệu: chạy `npm run check-data` trước, rồi build.
- Thay đổi giao diện: build, chạy `npm start`, chụp `npm run screenshot -- <tên> <url> [chiều cao]` (desktop 1440px + mobile 375px vào `screenshots/`), mở ảnh xem lại trước khi báo xong. Đặt tên ảnh theo bước, VD `08-ten-thay-doi`. Site có đăng nhập: chạy `npm start` với `AUTH_DISABLED=1` để chụp trang nội bộ; kiểm tra chặn truy cập bằng server không có biến này (trang → 307 `/dang-nhap`, `/api/*` → 401).
- Kiểm tra mobile ở 375px: không cuộn ngang cả trang, vùng chạm ≥ 44px.
- Báo đúng kết quả: lỗi build/lint thì nói rõ kèm output; bước nào bỏ qua thì nói.
