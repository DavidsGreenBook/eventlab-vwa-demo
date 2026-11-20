# EventLab VWA · Demo 0.2

[**Mở website demo**](https://davidsgreenbook.github.io/eventlab-vwa-demo/)

Bảy bài thực hành cá nhân trong cùng một hội trường, bao phủ sáu vai của dự án mô phỏng tổ chức sự kiện cho Học viện Phụ nữ Việt Nam. Dùng cho trình ý tưởng ngày 23/11/2026; chưa phải hệ thống đánh giá học phần.

| Bài | Tình huống | Vai |
| --- | --- | --- |
| 01 | Micro diễn giả mất tiếng | Kỹ thuật âm thanh – ánh sáng |
| 02 | LED hiển thị sai nội dung | Thiết kế đa phương tiện |
| 03 | Diễn giả đến muộn | Đạo diễn sân khấu |
| 04 | Ánh sáng và góc máy chưa phù hợp | Kỹ thuật âm thanh – ánh sáng |
| 05 | Câu hỏi có tiền đề chưa đúng | MC / người thuyết trình |
| 06 | Tin hậu trường sai giờ bắt đầu | Quản lý truyền thông |
| 07 | Chốt phương án tổ chức talkshow | Trưởng ban tổ chức |

## Sử dụng

Mở website → **Chọn bài** → lọc theo vai → chọn tình huống → đọc vị trí, mục tiêu → **Bắt đầu thực hành**. Bài 01 dùng công cụ micro, LED và đèn. Các bài còn lại dùng lựa chọn có phản hồi theo từng nhiệm vụ; chọn sai sẽ có giải thích và chưa chuyển bước. Có gợi ý, nhật ký, kết quả, sản phẩm mô phỏng và luyện lại.

Thời lượng ghi trên thẻ là thời gian tự luyện đề xuất, bao gồm đọc và giải trình. Không dùng thời gian thao tác tự động để kết luận hiệu quả học tập. Sáu bài mới là các bài tập độc lập theo brief riêng, không phải những vai đồng thời trong một sự kiện dùng chung trạng thái.

Tiến độ hoàn thành gần nhất của từng bài được lưu bằng `localStorage` trên trình duyệt này. Nhật ký chi tiết chỉ nằm trong lượt hiện tại; tải JSON trước khi đổi bài/đóng trang nếu cần giữ. Chọn bài mới bắt đầu lại lượt của bài đó. Không có máy chủ lưu điểm hoặc dữ liệu sinh viên.

## Máy tính và VR

Trên máy tính, kéo chuột để nhìn quanh. Mỗi vai có vị trí quan sát ban đầu khác nhau; nút Bàn kỹ thuật / Sân khấu / Toàn cảnh cho phép quan sát bổ sung.

Trong kính hỗ trợ WebXR, mở đường link HTTPS, chọn bài trước, rồi chọn **Vào VR**. Mỗi vai có một vị trí cố định; dùng tia chỉ của một trong hai controller và nút cò để chọn công cụ. Các bài lựa chọn có bảng tình huống, phản hồi và nút thao tác trong không gian 3D; có kết thúc, gợi ý và luyện lại. Thoát VR để đổi bài. Không có đi lại tự do/cầm nắm vật lý.

Nếu trình duyệt không tạo được WebGL, ứng dụng dùng Canvas 2D với nhãn minh họa rõ ràng. Đây không phải VR. Luồng trình duyệt hiện đã được kiểm tra bằng chế độ 2D; hiển thị 3D, vị trí bảng, độ đọc chữ, hiệu năng và controller vẫn cần thử trên kính thật.

## Phạm vi mô phỏng

Nhân vật, lời thoại và tình huống là kịch bản soạn sẵn, không có AI hội thoại hay nhận dạng/chấm giọng nói. Giọng tiếng Việt dùng `speechSynthesis` nếu trình duyệt có; luôn có chữ. Bài MC là chọn lời dẫn mẫu, bài thiết kế là kiểm soát phiên bản mẫu, bài truyền thông là biên tập tin mẫu; chưa có trình soạn thảo ấn phẩm hoặc phát hành mạng xã hội thật.

Các mức 20 triệu, 60 sinh viên, 09:00/09:30 và khoảng trễ là dữ liệu giả định trong bài tập, không phải thông báo chính thức, dự toán phòng học hoặc báo giá. Preview camera trong bài 04 là hình minh họa cấu hình, không phải livestream/video thu thật.

Three.js 0.170.0 được đặt cục bộ trong `vendor/`, kèm giấy phép MIT. Mô hình và texture tạo bằng mã. Không cần build, không có API key.

## Chỉnh sửa và kiểm tra

- `catalog.js`: dữ liệu sáu bài mới và logic lựa chọn, sản phẩm, nhật ký.
- `scenario.js`: logic bài micro gốc.
- `app.js`: thư viện bài, giao diện, âm thanh, góc nhìn, cảnh và tương tác WebXR.
- `fallback.js`: minh họa Canvas 2D.
- `SCENARIOS.md`: nhiệm vụ, tiêu chí, câu hỏi rút kinh nghiệm cho giảng viên.
- `PRESENTATION.md`: kịch bản trình bày ngắn.
- `DEPLOYMENT.md`: cập nhật GitHub Pages/hosting.

Chạy `npm test` (15 kiểm tra), `node --check app.js`, `node --check catalog.js`. Thay đổi đã commit vào nhánh `main` sẽ kích hoạt GitHub Pages từ thư mục gốc. Không mở qua `file://`; dùng HTTP localhost hoặc HTTPS.

Trước khi trình bằng kính: thử vào/thoát VR, hai controller, từng vị trí vai, các lựa chọn dài, hoàn tất/luyện lại và hiệu năng. Giảng viên cần thẩm định nội dung và các phương án được chấp nhận trước khi dùng trong giảng dạy chính thức.
