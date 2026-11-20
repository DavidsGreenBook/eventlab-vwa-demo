# EventLab VWA

Demo vai kỹ thuật điều hành sân khấu. Bắt đầu với DEPLOYMENT.md để đưa lên GitHub Pages hoặc Netlify. Kịch bản trình diễn nằm trong PRESENTATION.md.

# EventLab VWA — Demo kỹ thuật sân khấu 0.1

Demo ý tưởng phục vụ trình bày ngày 23/11/2026. Bài thực hành dành cho một người: chuẩn bị micro, LED và ánh sáng; báo sẵn sàng; chạy cue mở màn; chẩn đoán micro lỗi; bật micro dự phòng và tắt kênh lỗi.

## Chạy và sử dụng

Ứng dụng tĩnh trong thư mục gốc. Phục vụ thư mục này qua HTTPS (bắt buộc với WebXR ngoài localhost). Không mở `index.html` bằng `file://`.

Trên máy tính, kéo chuột trong hội trường để nhìn quanh. Các nút trên bảng điều khiển HTML và trên bàn kỹ thuật 3D sử dụng cùng một logic bài học. Chọn các góc Bàn kỹ thuật / Sân khấu / Toàn cảnh để quan sát.

Trình duyệt không tạo được WebGL sẽ dùng hình minh họa Canvas 2D có nhãn rõ ràng. LED, ánh sáng và góc quan sát thay đổi theo trạng thái bài học; đây không phải chế độ VR. Phần kiểm thử trình duyệt hiện tại chỉ xác nhận chế độ minh họa và luồng điều khiển, do WebGL bị tắt trong môi trường kiểm thử.

Trong kính hỗ trợ WebXR, mở đường link HTTPS, chọn Vào VR. Người học đứng/ngồi tại một vị trí kỹ thuật cố định; dùng tia chỉ của controller và nút cò để chọn công cụ trên bàn. Nhiệm vụ và lời đạo diễn hiển thị trên màn hình 3D cạnh bàn. Demo không có di chuyển tự do hoặc cầm nắm vật lý. Kết thúc và luyện lại có thể thực hiện bằng nút trên bàn 3D.

## Phạm vi mô phỏng

Âm thanh tạo bằng Web Audio; lời đạo diễn dùng giọng tiếng Việt của trình duyệt nếu có. Phụ đề luôn có. Không thu âm micro thật, không có AI hội thoại. Sự cố phát sinh khoảng 9,5 giây sau mở màn. Nhật ký được giữ trong phiên trình duyệt; nút tải JSON lưu kết quả về máy. Đóng trang sẽ mất lượt chưa xuất.

Các mô hình, nhân vật và texture được tạo bằng mã. Three.js 0.170.0 được đặt cục bộ tại `vendor/` theo giấy phép MIT, kèm LICENSE.

## Kiểm tra

`npm test` kiểm tra logic bài thực hành. `node --check app.js` kiểm tra cú pháp JavaScript.

Trước khi trình bằng kính: thử thực tế WebXR, controller hai tay, độ đọc chữ, âm thanh, quyền vào VR, thoát/đặt lại phiên và hiệu năng trong đúng kính mục tiêu. Chưa xác nhận khả năng vận hành trên kính khi chưa thực hiện lượt thử này.

## Phát triển tiếp

Thiết kế thêm vai MC/đạo diễn, nội dung bài học do giảng viên duyệt, tương tác cầm nắm, phối hợp nhiều người, hoặc AI hội thoại. Bản hiện tại là demo ý tưởng, không phải hệ thống đánh giá chính thức hay mô phỏng thiết bị âm thanh chuyên nghiệp.
