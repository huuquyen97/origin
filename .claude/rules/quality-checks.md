# Kiểm tra trước khi báo xong

- Mỗi thay đổi lớn: `npm run lint` và `npm run build` phải qua (build tự chạy `copy-assets` + `check-data` ở bước prebuild).
- Chỉ sửa dữ liệu: chạy `npm run check-data` trước, rồi build.
- Thay đổi giao diện: build, chạy `npm start`, chụp `npm run screenshot -- <tên> <url> [chiều cao]` (desktop 1440px + mobile 375px vào `screenshots/`), mở ảnh xem lại trước khi báo xong. Đặt tên ảnh theo bước, VD `08-ten-thay-doi`.
- Kiểm tra mobile ở 375px: không cuộn ngang cả trang, vùng chạm ≥ 44px.
- Báo đúng kết quả: lỗi build/lint thì nói rõ kèm output; bước nào bỏ qua thì nói.
