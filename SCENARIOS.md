# Bộ scenario EventLab VWA 0.2

Bảy bài cá nhân, sáu vai. Mỗi bài dùng một brief giả định độc lập, lời thoại và phản ứng soạn trước. Các vai khác được mô phỏng bằng thông báo; chưa có nhiều người cùng phiên. Bản 0.2 phục vụ lấy ý kiến về cấu trúc bài học.

## 01 · Micro diễn giả mất tiếng — Kỹ thuật

**POV:** Bàn kỹ thuật nhìn ra sân khấu. **Đích:** khôi phục micro mà không bỏ qua chẩn đoán.

1. Bật MIC 1, âm lượng từ 30%, kiểm tra tín hiệu.
2. LED Giới thiệu.
3. Cảnh sáng ấm.
4. Báo sẵn sàng.
5. Chạy mở màn theo GO.
6. Sau khoảng 9,5 giây, kiểm tra tín hiệu khi MIC 1 lỗi.
7. Bật MIC 2, tắt MIC 1, kết thúc lượt.

**Minh chứng:** thời gian phát sinh/khôi phục, thao tác sai điều kiện, nhật ký. **Giải trình:** Tại sao phải tắt kênh lỗi sau chuyển dự phòng? Cần báo ai khi lỗi xảy ra?

## 02 · LED hiển thị sai nội dung — Thiết kế đa phương tiện

**POV:** Bàn nội dung ở phía trái khán phòng. **Brief:** LED đang phát Ngày hội sáng tạo V1, cue yêu cầu Talkshow V3 đã duyệt.

**Luồng phù hợp:** đối chiếu cue → báo đạo diễn và màn chờ → nạp Talkshow V3 đã duyệt → xem trước → GO phát theo xác nhận → lưu biên bản.

**Phản hồi sai tiêu biểu:** chọn tệp theo vẻ đẹp/số phiên bản mà không kiểm tra chủ đề; sửa trực tiếp trong khi đang phát; bỏ preview.

**Minh chứng:** biến đổi LED sai → chờ → đúng; biên bản phiên bản và cue. **Giải trình:** Đâu là khác biệt giữa nạp tệp, xem trước và phát? Làm sao tránh lặp lỗi phiên bản?

## 03 · Diễn giả đến muộn — Đạo diễn sân khấu

**POV:** Vị trí đạo diễn phía sau khán phòng. **Brief:** talkshow 15 phút, diễn giả trễ 5 phút; có nội dung tương tác 5 phút đã duyệt.

**Luồng phù hợp:** xác minh với đón tiếp → chọn đoạn bù đã duyệt → giao cue MC/kỹ thuật → thống nhất phần trình bày 5 phút → nhận sẵn sàng rồi GO → lưu rundown thực chạy.

**Sản phẩm:** tương tác 5′ + diễn giả 5′ + hỏi đáp 3′ + kết 2′ = 15 phút. Đây là phương án của bài mẫu, không phải quy tắc duy nhất cho sự kiện thật.

**Giải trình:** Nếu diễn giả trễ thêm, ngưỡng nào cần xin quyết định từ trưởng ban? Làm sao biết MC đã nhận và hiểu cue?

## 04 · Ánh sáng và góc máy chưa phù hợp — Kỹ thuật

**POV:** Bàn kỹ thuật hình ảnh. **Brief:** phần phát biểu đang dùng sáng show và toàn cảnh, trong khi đạo diễn cần tập trung diễn giả.

**Luồng phù hợp:** kiểm tra hình → sáng ấm → góc trung diễn giả → kiểm tra preview → GO hình và lưu cấu hình.

**Minh chứng:** cảnh sáng thay đổi trong hội trường, preview minh họa đổi từ toàn cảnh sang góc trung, bản ghi cấu hình. Góc camera đầu ra tách khỏi góc quan sát của người học. Preview là đồ họa mô phỏng, chưa phải feed video/stream thật.

**Giải trình:** Vì sao cảnh show không nên được giữ mặc định? Cần xem trước những gì ngoài việc chủ thể có trong khung?

## 05 · Câu hỏi có tiền đề chưa đúng — MC / người thuyết trình

**POV:** MC trên sân khấu nhìn về khán giả. **Brief:** khán giả nghe tin phần hỏi đáp đã bị hủy; rundown và đạo diễn xác nhận vẫn còn 5 phút.

**Luồng phù hợp:** nghe và nhắc băn khoăn → kiểm tra nguồn → làm rõ vẫn còn 5 phút → chuyển câu hỏi nội dung tới diễn giả → báo còn 1 phút, mời ý kết và cảm ơn.

**Minh chứng:** lời dẫn mẫu, phản ứng khán giả theo kịch bản, chuỗi quyết định. Không thu micro thật và không chấm giọng nói hay ứng biến tự do.

**Giải trình:** Mời sinh viên nói lại lời dẫn bằng cách diễn đạt của mình. Giảng viên quan sát sự tôn trọng, thông tin đã xác minh, cách chuyển người trả lời và giữ thời gian.

## 06 · Tin hậu trường sai giờ bắt đầu — Quản lý truyền thông

**POV:** Bàn truyền thông ở cạnh sân khấu. **Brief:** tin thử nghiệm đã phát ghi 09:00, trong khi brief V2 được xác nhận ghi 09:30; bản đăng lại còn trong hàng chờ.

**Luồng phù hợp:** dừng đăng lại → xác minh brief và đầu mối → soạn đính chính rõ 09:00 → 09:30 → gửi duyệt kèm nguồn → phát mô phỏng, gắn vào bản cũ và ghi phiên bản.

**Minh chứng:** bản đính chính mẫu, nguồn xác minh, trạng thái duyệt/phát mô phỏng. Không đăng bài lên mạng xã hội thật.

**Giải trình:** Nếu tin mới chỉ là nháp, cần xử lý khác nội dung đã phát thế nào? Ai duyệt và người đọc bản cũ nhận bản sửa bằng cách nào?

## 07 · Chốt phương án tổ chức talkshow — Trưởng ban tổ chức

**POV:** Vị trí điều phối nhìn bao quát hội trường. **Brief:** 60 sinh viên, vận hành 15 phút, luyện 3 bước kiểm chứng thông tin, trần chi giả định 20 triệu đồng.

**Luồng phù hợp:** mục tiêu có hành vi quan sát → gói 17 triệu + dự phòng 3 triệu → đủ 6 vai và đầu mối duyệt → MIC 2, đoạn bù 5 phút và chế độ PC → duyệt sau xác nhận nội dung/kỹ thuật/rundown.

**Minh chứng:** bản kế hoạch tóm tắt đã được duyệt mô phỏng. Đây là bài chọn phương án mẫu, chưa có nhập ngân sách hoặc dựng kế hoạch tự do. Các số liệu không phải báo giá hay quy mô được Học viện chốt.

**Giải trình:** Vì sao cần giữ dự phòng? Ai quyết định thay đổi phạm vi, ai gọi cue? Một phương án rẻ hơn nhưng thiếu âm thanh có đáp ứng mục tiêu không?

## Hướng dẫn sử dụng và đánh giá

Bật hướng dẫn cho lượt đầu, tắt ở lượt sau. Mỗi nhiệm vụ của sáu bài mới có ba phương án; một phương án phù hợp brief hiện tại, phương án chưa phù hợp có giải thích và không chuyển bước. Bản demo giới hạn tập quyết định; giảng viên có thể chấp nhận phương án ngoài lựa chọn nếu sinh viên giải trình hợp lý.

Không tự quy đổi số lần sai hoặc tốc độ thành điểm năng lực. Dùng nhật ký, sản phẩm và giải trình để góp ý. Các khoảng 3–8 phút trên thẻ là gợi ý cho tự luyện, bao gồm đọc và thảo luận.

JSON gồm mã bài, vai, nhiệm vụ hoàn thành, thời gian, số gợi ý, thao tác cần chỉnh, quyết định kèm phản hồi, sản phẩm cuối và nhật ký theo thời gian. Bài micro có thêm thời gian khôi phục. Tiến độ tóm tắt gần nhất lưu tại trình duyệt; chi tiết phải tải xuống trước đổi bài.

## Phạm vi kiểm thử bản 0.2

- 15 kiểm tra logic: hoàn thành cả sáu bài mới; không vượt bước bằng lựa chọn sai/cũ/tương lai; reset; thời gian chốt; bản ghi độc lập; bài micro cũ.
- Trình duyệt: hoàn thành bảy bài ở chế độ minh họa 2D; thử phản hồi sai ở bài LED, đổi bài, lọc vai và kết quả.
- Chưa kiểm chứng trên kính thật: hiển thị 3D, các bảng ở từng POV, độ đọc chữ, controller, hiệu năng và trải nghiệm người học.
