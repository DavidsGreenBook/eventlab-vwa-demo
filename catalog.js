// Authored learning scenarios. All names, timings and budgets below are fictional training data.
const choice=(id,label,valid,feedback,effect={})=>({id,label,valid,feedback,effect});
const step=(title,hint,context,choices)=>({title,hint,context,choices});
export const LESSONS=[
 {id:'mic',number:'01',title:'Micro diễn giả mất tiếng',role:'Kỹ thuật âm thanh – ánh sáng',station:'Bàn kỹ thuật',view:'tech',duration:'5–8 phút',summary:'Kiểm tra hệ thống, nhận cue và chuyển micro dự phòng khi mất tiếng.',objective:'Giữ chương trình tiếp tục bằng kiểm tra, chẩn đoán và cô lập kênh lỗi.',output:'Micro dự phòng hoạt động; MIC 1 lỗi đã được tắt.',resultTitle:'Bạn đã giữ chương trình tiếp tục.',debrief:'Đối chiếu thời điểm phát sinh lỗi, chẩn đoán và chuyển dự phòng trong nhật ký. Thử lại khi tắt hướng dẫn.',initial:{},steps:[]},
 {id:'led',number:'02',title:'LED hiển thị sai nội dung',role:'Thiết kế đa phương tiện',station:'Bàn nội dung',view:'content',duration:'4–6 phút',summary:'Phát hiện slide sai phiên bản, giữ màn hình an toàn và đưa nội dung đã duyệt trở lại.',objective:'Kiểm soát phiên bản và xác nhận nội dung trước khi phát.',output:'Deck V3 đã duyệt được phát đúng cue; thay đổi được ghi nhận.',resultTitle:'Nội dung đúng đã trở lại sân khấu.',debrief:'Tách các bước chọn tệp, xem trước, duyệt và phát. Thảo luận cách tránh phát nhầm một lần nữa.',initial:{slide:'wrong',light:'warm',live:true},steps:[
  step('Đối chiếu nội dung','Mở bảng cue để so tên tệp đang phát với phiên bản đã duyệt.','LED đang phát “Ngày hội sáng tạo · bản V1”. Cue hiện tại yêu cầu “Truyền thông có trách nhiệm · V3 đã duyệt”.',[
   choice('led-ignore','Tiếp tục vì bố cục đẹp',false,'Bố cục đẹp không thay thế yêu cầu đúng sự kiện và phiên bản.'),
   choice('led-check','Đối chiếu bảng cue',true,'Đã xác định sai chủ đề và sai phiên bản; cần che nội dung sai trước khi thay.'),
   choice('led-edit','Sửa trực tiếp khi đang phát',false,'Sửa trực tiếp có thể lộ nội dung chưa kiểm tra lên LED.')]),
  step('Giữ màn hình an toàn','Báo đạo diễn và chuyển sang màn hình chờ đã duyệt.','Chưa xác nhận được tệp thay thế. Cần giữ hình ảnh phù hợp trong lúc xử lý.',[
   choice('led-hold','Báo đạo diễn, bật màn chờ',true,'Màn hình chờ đã lên; đạo diễn được biết quá trình đổi nội dung.',{slide:'standby'}),
   choice('led-random','Mở tệp gần nhất',false,'Tệp gần nhất chưa chắc là phiên bản được duyệt.'),
   choice('led-blackout','Tắt toàn bộ ánh sáng',false,'Lỗi nội dung LED không cần làm gián đoạn toàn bộ sân khấu.')]),
  step('Chọn đúng phiên bản','Chọn tệp trùng tên sự kiện và trạng thái đã duyệt.','Kho tệp: Talkshow_V1_nhap; Talkshow_V3_da_duyet; Ngayhoi_V3_da_duyet.',[
   choice('led-draft','Chọn Talkshow V1 nháp',false,'Đây là bản nháp chưa được duyệt.'),
   choice('led-other','Chọn Ngày hội V3',false,'Đúng số phiên bản nhưng sai chương trình.'),
   choice('led-load','Nạp Talkshow V3 đã duyệt',true,'Đã nạp đúng deck vào vùng xem trước.',{artifact:'Tệp chờ phát: Talkshow_V3_da_duyet. LED vẫn ở màn chờ.'})]),
  step('Kiểm tra trước khi phát','Xem trước tên sự kiện, thứ tự slide và độ đọc rõ.','Bản xem trước có đúng chủ đề, đúng mục “Phát biểu mở đầu”, không có chữ bị cắt.',[
   choice('led-preview','Xác nhận bản xem trước',true,'Đã kiểm tra nội dung và bố cục trước khi lên LED.'),
   choice('led-speed','Bỏ xem trước cho nhanh',false,'Bỏ bước này có thể tái diễn sai nội dung.'),
   choice('led-logo','Chỉ kiểm tra logo',false,'Cần kiểm tra cả thông điệp và slide đang đến lượt.')]),
  step('Phát theo xác nhận','Nhận xác nhận của đạo diễn rồi phát deck đã kiểm tra.','Bộ đàm: “V3 đúng nội dung. GO slide phát biểu.”',[
   choice('led-later','Đợi hết talkshow',false,'Đã có cue hợp lệ; chờ hết chương trình không đáp ứng nhu cầu hiện tại.'),
   choice('led-publish','GO: phát V3 đúng cue',true,'LED đã hiển thị đúng nội dung theo cue.',{slide:'live'}),
   choice('led-revert','Quay lại bản V1',false,'Bản V1 là nguồn sai đã xác định.')]),
  step('Ghi nhận thay đổi','Ghi phiên bản, cue và cách khôi phục để rút kinh nghiệm.','Đầu ra cần có: V1 sai → màn chờ → V3 đã duyệt; cue phát biểu; đã báo đạo diễn.',[
   choice('led-close','Đóng tệp, không ghi lại',false,'Thiếu nhật ký sẽ khó truy vết nguyên nhân.'),
   choice('led-log','Lưu biên bản đổi nội dung',true,'Đã lưu chuỗi xử lý và phiên bản đúng.',{artifact:'Biên bản: phát hiện V1 sai chủ đề; báo đạo diễn; màn chờ; xem trước V3 đã duyệt; phát theo GO.'}),
   choice('led-blame','Ghi lỗi do một bạn khác',false,'Biên bản cần mô tả sự kiện và cách xử lý đã xác minh.')])]},
 {id:'delay',number:'03',title:'Diễn giả đến muộn',role:'Đạo diễn sân khấu',station:'Bàn đạo diễn',view:'director',duration:'4–6 phút',summary:'Điều chỉnh rundown khi diễn giả trễ 5 phút, giữ nhịp và bảo toàn phần hỏi đáp.',objective:'Đưa ra phương án có mốc thời gian, người nhận việc và cue rõ ràng.',output:'Rundown điều chỉnh đã được xác nhận; MC và kỹ thuật nhận cue mới.',resultTitle:'Bạn đã điều chỉnh chương trình có kiểm soát.',debrief:'Giải thích vì sao chọn đoạn bù 5 phút và cách kiểm tra người nhận cue. Giảng viên có thể chấp nhận phương án hợp lý khác.',initial:{slide:'intro',light:'warm',live:true},steps:[
  step('Xác minh thời gian trễ','Hỏi đầu mối diễn giả trước khi đổi rundown.','Talkshow còn 15 phút. Diễn giả chưa vào hội trường; bộ phận đón tiếp chưa xác nhận thời gian đến.',[
   choice('delay-cancel','Hủy toàn bộ talkshow',false,'Chưa có thông tin đủ để quyết định hủy.'),
   choice('delay-verify','Xác minh với đón tiếp',true,'Đón tiếp xác nhận: diễn giả đến sau 5 phút.'),
   choice('delay-wait','Để sân khấu trống',false,'Cần chủ động điều phối trong lúc xác minh.')]),
  step('Chọn nội dung bù giờ','Dùng nội dung đã duyệt, có thời lượng khớp khoảng trễ.','Thư viện có: câu hỏi tương tác đã duyệt 5 phút; video chưa duyệt 8 phút; nhạc nền không giới hạn.',[
   choice('delay-video','Phát video mới 8 phút',false,'Video chưa duyệt và vượt khoảng trễ.'),
   choice('delay-bridge','Chọn tương tác 5 phút',true,'Đã chọn nội dung bù được duyệt, phù hợp thời lượng.',{artifact:'Rundown mới: tương tác 5 phút → diễn giả 5 phút → hỏi đáp 3 phút → kết 2 phút.'}),
   choice('delay-music','Mở nhạc đến khi diễn giả tới',false,'Không có mốc kết thúc sẽ khó giữ tổng thời lượng.')]),
  step('Giao việc rõ vai','Thông báo MC dẫn tương tác và kỹ thuật giữ LED tương ứng.','Phương án đã chốt; MC và kỹ thuật vẫn cầm rundown cũ.',[
   choice('delay-silent','Chỉ sửa bản của mình',false,'Các vai khác chưa biết thay đổi sẽ thực hiện sai cue.'),
   choice('delay-text','Nhắn “xử lý linh hoạt”',false,'Lệnh chưa nêu nội dung, thời lượng và người thực hiện.'),
   choice('delay-brief','Giao cue cho MC và kỹ thuật',true,'MC nhận phần tương tác; kỹ thuật nhận LED và âm thanh mới.',{slide:'live',light:'warm'})]),
  step('Bảo toàn khung kết thúc','Ưu tiên thông điệp chính và giữ phần hỏi đáp, kết chương trình.','Sau phần tương tác, còn 10 phút. Khung đề xuất: diễn giả 5, hỏi đáp 3, kết 2 phút.',[
   choice('delay-overrun','Giữ bài nói cũ 10 phút',false,'Sẽ mất thời gian hỏi đáp và kết chương trình.'),
   choice('delay-trim','Chốt bài nói 5 phút với diễn giả',true,'Diễn giả đồng ý tập trung thông điệp chính trong 5 phút.'),
   choice('delay-noqa','Bỏ hỏi đáp mà không báo',false,'Cần thống nhất thay đổi mục tiêu và thông báo người liên quan.')]),
  step('Xác nhận trước chuyển phần','Chờ các vai báo sẵn sàng rồi gọi GO.','Diễn giả đã vào vị trí; cần xác nhận MC và kỹ thuật.',[
   choice('delay-goearly','Gọi GO khi chưa xác nhận',false,'Có thể chuyển phần trong lúc micro hoặc MC chưa sẵn sàng.'),
   choice('delay-ready','Nhận sẵn sàng rồi gọi GO',true,'Đã chuyển sang diễn giả sau xác nhận hai đầu mối.',{slide:'live',light:'warm'}),
   choice('delay-restart','Chạy lại toàn bộ mở màn',false,'Lặp mở màn gây mất thêm thời gian.')]),
  step('Bàn giao rundown thực chạy','Lưu mốc điều chỉnh và người đã xác nhận.','Cần phân biệt rundown kế hoạch và bản thực chạy.',[
   choice('delay-record','Lưu rundown điều chỉnh',true,'Đã lưu quyết định đổi thứ tự và phân bổ thời gian.',{artifact:'Rundown thực chạy: tương tác 5′; diễn giả 5′; hỏi đáp 3′; kết 2′. MC, kỹ thuật và diễn giả đã xác nhận.'}),
   choice('delay-erase','Xóa lịch cũ và mọi ghi chú',false,'Cần giữ dấu vết để đối chiếu kế hoạch và thực tế.'),
   choice('delay-stop','Chỉ ghi “đã xử lý”',false,'Thiếu thay đổi cụ thể và người nhận cue.')])]},
 {id:'lighting',number:'04',title:'Ánh sáng và góc máy chưa phù hợp',role:'Kỹ thuật âm thanh – ánh sáng',station:'Bàn kỹ thuật hình ảnh',view:'tech',duration:'3–5 phút',summary:'Chuyển từ cảnh hiệu ứng sang cảnh phát biểu, chọn khung hình và xác nhận trước khi lên sóng mô phỏng.',objective:'Kiểm tra cả hình ảnh tại sân khấu và khung hình đầu ra.',output:'Ánh sáng ấm và góc trung diễn giả đã được xem trước, xác nhận và phát mô phỏng.',resultTitle:'Khung hình đã sẵn sàng cho phần phát biểu.',debrief:'Cảnh show phù hợp mở màn có thể không phù hợp phát biểu. Góc quan sát của người học khác với góc máy đầu ra.',initial:{slide:'live',light:'show',live:true,programCamera:'wide'},steps:[
  step('Quan sát hình đầu ra','So sánh yêu cầu phần phát biểu với cảnh sáng và khung hình hiện tại.','Đạo diễn yêu cầu tập trung diễn giả. Đầu ra đang là toàn cảnh khán phòng, ánh sáng hiệu ứng chuyển động.',[
   choice('light-ok','Giữ nguyên vì nhiều màu',false,'Nhiều hiệu ứng chưa đáp ứng mục tiêu tập trung diễn giả.'),
   choice('light-check','Kiểm tra sáng và khung hình',true,'Đã nhận diện hai hạng mục cần điều chỉnh.'),
   choice('light-mic','Đổi micro dự phòng',false,'Không có bằng chứng lỗi âm thanh trong tình huống này.')]),
  step('Chọn cảnh phát biểu','Dùng cảnh ấm đã chuẩn bị thay cho hiệu ứng show.','Preset: tắt / ấm cho phát biểu / show cho mở màn.',[
   choice('light-off','Tắt sáng sân khấu',false,'Diễn giả cần được nhìn thấy rõ.'),
   choice('light-show','Tăng hiệu ứng show',false,'Chưa khắc phục yêu cầu của cảnh phát biểu.'),
   choice('light-warm','Bật cảnh sáng ấm',true,'Đã chuyển sân khấu sang cảnh phát biểu ổn định.',{light:'warm'})]),
  step('Chọn góc máy đầu ra','Chọn góc trung diễn giả để khán giả quan sát phần trình bày.','Ba lựa chọn mô phỏng: toàn cảnh, trung diễn giả, khán giả.',[
   choice('light-camera','Chọn góc trung diễn giả',true,'Vùng xem trước chuyển sang diễn giả.',{programCamera:'speaker'}),
   choice('light-audience','Chọn máy khán giả',false,'Chưa đúng chủ thể ở phần phát biểu.'),
   choice('light-wide','Giữ toàn cảnh',false,'Toàn cảnh chưa đáp ứng cue tập trung diễn giả.')]),
  step('Kiểm tra bản xem trước','Kiểm tra khuôn mặt, vùng chữ và sự ổn định trước khi xác nhận.','Preview mô phỏng: cảnh ấm, diễn giả ở trung tâm, chữ không bị cắt.',[
   choice('light-preview','Xác nhận preview phù hợp',true,'Đã kiểm tra khung hình và ánh sáng.'),
   choice('light-skip','Bỏ qua preview',false,'Không nên chuyển đầu ra chưa được kiểm tra.'),
   choice('light-move','Đổi liên tục cả ba góc',false,'Thay đổi liên tục làm mất ổn định và chưa xác nhận khung hình nào.')]),
  step('Phát và ghi cấu hình','Nhận cue đạo diễn, chuyển đầu ra và lưu cấu hình dùng cho phát biểu.','Bộ đàm: “Cảnh phát biểu và góc trung đạt. GO hình.”',[
   choice('light-go','GO hình, lưu cấu hình',true,'Đã phát đầu ra đã kiểm tra theo cue.',{artifact:'Cấu hình phát biểu: sáng ấm; góc trung diễn giả; preview đạt; GO hình đã nhận.'}),
   choice('light-revert','Đổi lại show trước GO',false,'Thay đổi sau kiểm tra làm mất cấu hình đã được xác nhận.'),
   choice('light-delay','Không báo trạng thái',false,'Đạo diễn cần biết đầu ra đã chuyển hay chưa.')])]},
 {id:'question',number:'05',title:'Câu hỏi có tiền đề chưa đúng',role:'MC / người thuyết trình',station:'Vị trí MC trên sân khấu',view:'stage',duration:'4–6 phút',summary:'Lắng nghe, đối chiếu thông tin và điều phối câu hỏi mà vẫn tôn trọng khán giả.',objective:'Giữ đối thoại rõ ràng, đúng thông tin và trong thời lượng.',output:'Câu hỏi được làm rõ, chuyển đúng người trả lời và khép lại trong khung hỏi đáp.',resultTitle:'Bạn đã giữ cuộc đối thoại đúng hướng.',debrief:'Đọc thành tiếng lời dẫn đã chọn và giải thích cách xử lý. Demo lựa chọn lời thoại chưa đánh giá giọng nói, phát âm hay ứng biến tự do.',initial:{slide:'live',light:'warm',live:true,audience:'hand'},steps:[
  step('Nghe đầy đủ câu hỏi','Cho người hỏi hoàn tất rồi nhắc lại điều cần xác minh.','Khán giả: “Tôi nghe nói ban tổ chức đã hủy phần hỏi đáp. Vì sao không cho sinh viên đặt câu hỏi?”',[
   choice('qa-cut','Ngắt lời ngay lập tức',false,'Chưa lắng nghe đủ sẽ dễ hiểu sai mối quan tâm.'),
   choice('qa-listen','Cảm ơn và nhắc lại băn khoăn',true,'Đã xác định băn khoăn về quyền đặt câu hỏi.'),
   choice('qa-agree','Xác nhận đã hủy hỏi đáp',false,'Không xác nhận thông tin khi chưa đối chiếu.')]),
  step('Đối chiếu nguồn chính thức','Kiểm tra rundown đã được đạo diễn xác nhận.','Rundown được duyệt ghi: còn 5 phút hỏi đáp. Chưa có quyết định hủy.',[
   choice('qa-rumor','Tin ngay lời truyền miệng',false,'Nguồn đang mâu thuẫn cần được xác minh.'),
   choice('qa-check','Đối chiếu rundown và đạo diễn',true,'Đạo diễn xác nhận vẫn giữ 5 phút hỏi đáp.'),
   choice('qa-guess','Tự đoán lý do hủy',false,'Suy đoán tạo thêm thông tin sai.')]),
  step('Làm rõ mà vẫn tôn trọng','Nêu thông tin đã xác nhận, tránh công kích người hỏi.','Cần phản hồi ngắn gọn trước khi mở lại câu hỏi nội dung.',[
   choice('qa-shame','Nói người hỏi thiếu hiểu biết',false,'Công kích cá nhân không giúp làm rõ thông tin.'),
   choice('qa-dodge','Bỏ qua và kết chương trình',false,'Chưa giải đáp băn khoăn đã nêu.'),
   choice('qa-clarify','“Hỏi đáp vẫn diễn ra trong 5 phút”',true,'Đã đính chính bằng thông tin được xác nhận.',{artifact:'Lời dẫn: Cảm ơn bạn đã nêu băn khoăn. Theo rundown được xác nhận, chúng ta vẫn còn 5 phút hỏi đáp. Mời bạn đặt câu hỏi về nội dung talkshow.'})]),
  step('Điều phối về đúng nội dung','Mời người hỏi nêu câu hỏi và chuyển cho diễn giả phù hợp.','Khán giả hỏi tiếp: “Làm sao kiểm tra thông tin trước khi chia sẻ?” Đây là chủ đề của diễn giả.',[
   choice('qa-route','Mời diễn giả trả lời',true,'Đã chuyển câu hỏi đúng phạm vi và người trả lời.',{audience:'listening'}),
   choice('qa-promise','Hứa mọi tin trên mạng đều đúng',false,'Cam kết này không có căn cứ và không trả lời đúng câu hỏi.'),
   choice('qa-reject','Từ chối mọi câu hỏi tiếp',false,'Câu hỏi tiếp theo phù hợp chủ đề.')]),
  step('Giữ thời lượng và khép lại','Báo còn 1 phút, mời một ý kết rồi cảm ơn.','Đạo diễn báo còn 1 phút trong phần hỏi đáp.',[
   choice('qa-over','Cho phát biểu không giới hạn',false,'Cần giữ cam kết thời lượng của phần hỏi đáp.'),
   choice('qa-close','Mời ý kết ngắn và cảm ơn',true,'Đã giữ nhịp và khép lại phần hỏi đáp.',{audience:'applause',artifact:'Lời kết: Xin diễn giả chia sẻ một ý cuối trong một phút. Cảm ơn diễn giả và các bạn đã tham gia phần hỏi đáp.'}),
   choice('qa-mute','Tắt micro khi diễn giả đang nói',false,'Có thể kết nối bằng lời dẫn và báo thời gian trước khi can thiệp kỹ thuật.')])]},
 {id:'news',number:'06',title:'Tin hậu trường sai giờ bắt đầu',role:'Quản lý truyền thông',station:'Bàn truyền thông hậu trường',view:'backstage',duration:'4–6 phút',summary:'Tạm dừng bản tin sai thông tin, kiểm chứng và phát bản đính chính qua quy trình duyệt mô phỏng.',objective:'Kiểm chứng thông tin và kiểm soát phiên bản trước khi phát hành.',output:'Bản đính chính 09:30 đã được duyệt và phát hành mô phỏng; có nhật ký nguồn và phiên bản.',resultTitle:'Thông tin đã được đính chính rõ ràng.',debrief:'Phân biệt sửa bản nháp với đính chính nội dung đã phát. Không phát hành thật lên mạng xã hội trong demo.',initial:{slide:'live',light:'warm',live:true},steps:[
  step('Tạm dừng nội dung sai','Ngừng lịch đăng và ghi nhận bản tin đã phát cần được sửa.','Bản tin thử nghiệm đã ghi “bắt đầu 09:00”; bản đăng lại đang chờ. Brief được duyệt ghi 09:30.',[
   choice('news-repost','Đăng lại ngay bản 09:00',false,'Đăng lại sẽ lan truyền thêm thông tin đang mâu thuẫn.'),
   choice('news-hold','Dừng đăng lại, mở xử lý sai lệch',true,'Đã dừng lịch đăng lại và ghi nhận bản đã phát cần đính chính.'),
   choice('news-delete','Xóa lặng lẽ rồi bỏ qua',false,'Nội dung đã phát cần xử lý rõ ràng để người đọc biết thông tin chính xác.')]),
  step('Kiểm chứng giờ chính xác','Đối chiếu brief và người có trách nhiệm xác nhận.','Brief V2 được duyệt ghi 09:30. Trưởng ban tổ chức xác nhận đây là giờ bắt đầu chính thức trong bài tập.',[
   choice('news-chat','Dựa vào tin nhắn không rõ nguồn',false,'Chưa đủ căn cứ so với brief được duyệt.'),
   choice('news-guess','Lấy trung bình hai mốc giờ',false,'Thời gian sự kiện cần nguồn xác nhận, không thể lấy trung bình.'),
   choice('news-verify','Xác nhận 09:30 từ brief V2',true,'Đã xác nhận nguồn và giờ chính xác.',{artifact:'Nguồn: Brief V2 đã duyệt; Trưởng ban tổ chức xác nhận giờ bắt đầu 09:30.'})]),
  step('Soạn nội dung đính chính','Nêu rõ thông tin cũ, thông tin đúng và lời xin lỗi ngắn.','Cần phản hồi người đã thấy bản tin 09:00.',[
   choice('news-correct','Soạn đính chính 09:00 → 09:30',true,'Bản đính chính nêu rõ thay đổi và nguồn.',{artifact:'ĐÍNH CHÍNH: Bản tin trước ghi giờ bắt đầu 09:00. Giờ chính xác là 09:30 theo thông tin ban tổ chức đã xác nhận. Xin lỗi vì sai sót và mong các bạn cập nhật.'}),
   choice('news-ambiguous','Chỉ viết “giờ có thay đổi”',false,'Chưa nêu giờ chính xác và thông tin nào được sửa.'),
   choice('news-blame','Quy trách nhiệm khi chưa xác minh',false,'Cần tập trung sửa thông tin và tránh suy đoán nguyên nhân.')]),
  step('Gửi duyệt bản sửa','Gửi bản đính chính kèm nguồn để người phụ trách phê duyệt.','Quy trình bài tập: quản lý nội dung xác nhận trước khi phát.',[
   choice('news-now','Phát ngay, bỏ duyệt',false,'Chưa hoàn thành quy trình duyệt trong đề bài.'),
   choice('news-approve','Gửi bản đính chính và nguồn duyệt',true,'Người phụ trách xác nhận bản đính chính được phép phát mô phỏng.'),
   choice('news-unrelated','Chỉ gửi ảnh minh họa',false,'Người duyệt cần nội dung sửa và nguồn xác minh.')]),
  step('Phát hành và lưu dấu vết','Phát bản đã duyệt, gắn vào bản cũ và ghi phiên bản mới.','Đã có phê duyệt. Đây là kênh mô phỏng; không kết nối tài khoản mạng xã hội thật.',[
   choice('news-publish','Phát đính chính, lưu nguồn và V2',true,'Đã phát mô phỏng và liên kết đính chính với bản cũ.',{artifact:'ĐÃ PHÁT MÔ PHỎNG: đính chính 09:00 → 09:30; gắn ghi chú tại bản cũ; nguồn Brief V2; người duyệt đã xác nhận.'}),
   choice('news-old','Phát lại bản chưa sửa',false,'Bản cũ chứa thông tin đã xác định là sai.'),
   choice('news-forget','Chỉ lưu, không thông báo người đọc',false,'Người đã đọc tin cũ cần được tiếp cận đính chính.')])]},
 {id:'planning',number:'07',title:'Chốt phương án tổ chức talkshow',role:'Trưởng ban tổ chức',station:'Vị trí điều phối hội trường',view:'planning',duration:'5–7 phút',summary:'Chốt mục tiêu, nguồn lực và phân công trước khi cho phép tổng duyệt.',objective:'Đưa ra phương án đáp ứng mục tiêu, trần ngân sách và điều kiện dự phòng.',output:'Kế hoạch một trang gồm mục tiêu, gói nguồn lực, phân vai, dự phòng và điều kiện tổng duyệt.',resultTitle:'Kế hoạch đã đủ điều kiện tổng duyệt.',debrief:'Mức 20 triệu đồng là dữ liệu giả định của bài tập, không phải dự toán dự án hay báo giá thiết bị. Giảng viên có thể thay số và tiêu chí.',initial:{slide:'standby',light:'warm',live:false},steps:[
  step('Chốt mục tiêu học tập','Chọn mục tiêu có đối tượng và kết quả có thể quan sát.','Brief giả định: talkshow 60 sinh viên, 15 phút vận hành; luyện kiểm chứng thông tin trước khi chia sẻ.',[
   choice('plan-viral','Chỉ cần nhiều lượt xem',false,'Chưa xác định kết quả học tập theo brief.'),
   choice('plan-goal','60 SV thực hành 3 bước kiểm chứng',true,'Mục tiêu gắn đối tượng và hành vi cần quan sát.',{artifact:'Mục tiêu: 60 sinh viên nhận diện và thực hành 3 bước kiểm chứng; talkshow vận hành 15 phút.'}),
   choice('plan-long','Kéo chương trình thành cả ngày',false,'Không khớp khung vận hành 15 phút của đề bài.')]),
  step('Cân đối nguồn lực','Giữ tổng chi trong 20 triệu đồng giả định và có dự phòng.','Các gói cho sẵn: A 22 triệu; B 17 triệu + dự phòng 3 triệu; C 20 triệu nhưng chưa có âm thanh.',[
   choice('plan-a','Chọn A: 22 triệu',false,'Vượt trần 20 triệu của bài tập.'),
   choice('plan-c','Chọn C: thiếu âm thanh',false,'Chưa bảo đảm hạng mục thiết yếu của talkshow.'),
   choice('plan-budget','Chọn B: 17 + 3 triệu dự phòng',true,'Gói B đáp ứng hạng mục thiết yếu và giữ khoản dự phòng trong trần ngân sách.' )]),
  step('Phân vai và đầu mối quyết định','Giao người chịu trách nhiệm từng vai và quy định luồng báo cáo.','Nhóm 6 sinh viên cần các vai: trưởng ban, thiết kế, đạo diễn, MC, kỹ thuật, truyền thông.',[
   choice('plan-roles','Chốt 6 vai và đầu mối duyệt',true,'Đã phân đủ vai; đạo diễn gọi cue, trưởng ban duyệt thay đổi phạm vi.'),
   choice('plan-all','Tất cả cùng gọi cue',false,'Lệnh đồng thời không có đầu mối dễ mâu thuẫn.'),
   choice('plan-none','Để đến giờ mới phân công',false,'Không đủ cơ sở chuẩn bị và tổng duyệt.')]),
  step('Duyệt phương án dự phòng','Chuẩn bị micro và nội dung chờ cùng người kích hoạt.','Rủi ro giả định: micro lỗi, diễn giả trễ 5 phút, người học cần chế độ máy tính.',[
   choice('plan-ignore','Chỉ xử lý khi xảy ra',false,'Bỏ chuẩn bị khiến nhóm khó phản ứng đồng bộ.'),
   choice('plan-backup','Duyệt MIC 2, đoạn bù và chế độ PC',true,'Đã có micro dự phòng, nội dung bù 5 phút, lựa chọn máy tính và đầu mối thực hiện.'),
   choice('plan-vr','Bắt buộc mọi người dùng kính',false,'Cần phương án tiếp cận phù hợp với người học và điều kiện thiết bị.')]),
  step('Kiểm tra điều kiện tổng duyệt','Chỉ cho phép tổng duyệt khi nội dung, kỹ thuật và phân vai được xác nhận.','Thiết kế báo tệp đã duyệt; kỹ thuật xác nhận kiểm tra; đạo diễn có rundown 15 phút; MC và truyền thông nhận phiên bản mới.',[
   choice('plan-go','Duyệt kế hoạch và cho tổng duyệt',true,'Đã tổng hợp xác nhận của các đầu mối.',{slide:'intro',artifact:'KẾ HOẠCH ĐÃ DUYỆT MÔ PHỎNG: 60 SV; 15 phút; 3 bước kiểm chứng; gói 17 + dự phòng 3 triệu; 6 vai; MIC 2 và đoạn bù 5 phút; phương án PC; nội dung và kỹ thuật đã xác nhận.'}),
   choice('plan-blind','Duyệt khi chưa ai xác nhận',false,'Phê duyệt cần dựa trên thông tin từ người phụ trách.'),
   choice('plan-decor','Chỉ kiểm tra trang trí',false,'Tổng duyệt cần cả nội dung, phân vai và kỹ thuật.')])]},
];
export function getLesson(id){return LESSONS.find(item=>item.id===id)??LESSONS[0];}

export class DecisionScenario {
 constructor(lesson,now=()=>Date.now()){if(!lesson.steps.length)throw new Error('Decision scenario requires steps');this.lesson=lesson;this.now=now;this.reset();}
 reset(){Object.assign(this,{started:false,finished:false,step:0,errors:0,hints:0,startedAt:null,completedAt:null,log:[],decisions:[],message:'Bắt đầu bài để nhận nhiệm vụ.',mic1:true,mic2:false,volume:.65,tested:true,ready:false,live:false,fault:false,recovered:false,slide:'standby',light:'warm',programCamera:'wide',audience:'listening',artifact:'Chưa có sản phẩm. Hoàn thành các quyết định để lập bản ghi.'},this.lesson.initial);}
 get current(){return this.lesson.steps[this.step]??null;}
 get totalSteps(){return this.lesson.steps.length;}
 record(text,type='info'){this.log.push({at:this.now(),text,type});}
 start(){if(this.started)return {ok:true,message:this.message};this.started=true;this.startedAt=this.now();this.message=this.current.context;this.record(`Bắt đầu: ${this.lesson.title}. Vai: ${this.lesson.role}.`);return{ok:true,message:this.message};}
 act(action,id){
  if(!this.started||this.finished)return {ok:false,message:this.finished?'Lượt thực hành đã kết thúc.':'Bắt đầu bài trước khi thao tác.'};
  if(action==='hint'){this.hints++;this.message=this.current?.hint??'Đã hoàn thành các nhiệm vụ. Chọn Kết thúc phiên.';this.record(`Gợi ý: ${this.message}`);return{ok:true,message:this.message};}
  if(action==='finish'){
   if(this.step!==this.totalSteps){this.errors++;this.message='Hoàn thành các nhiệm vụ trước khi kết thúc.';this.record(this.message,'warning');return{ok:false,message:this.message};}
   this.finished=true;this.completedAt=this.now();this.record('Kết thúc lượt thực hành.','success');this.message='Đã hoàn thành bài thực hành.';return{ok:true,message:this.message};
  }
  const selected=action==='decision'&&this.current?.choices.find(c=>c.id===id);
  if(!selected){this.errors++;this.message='Lựa chọn không thuộc nhiệm vụ hiện tại.';this.record(this.message,'warning');return{ok:false,message:this.message};}
  this.decisions.push({at:this.now(),step:this.step+1,id:selected.id,label:selected.label,accepted:selected.valid,feedback:selected.feedback});
  this.record(`${this.step+1}. ${selected.label}: ${selected.feedback}`,selected.valid?'success':'warning');
  if(!selected.valid){this.errors++;this.message=selected.feedback;return{ok:false,message:this.message};}
  Object.assign(this,selected.effect);this.step++;this.recovered=this.step===this.totalSteps;
  this.message=selected.feedback;return{ok:true,message:this.message};
 }
 report(){return{version:'0.2',scenarioId:this.lesson.id,scenario:this.lesson.title,role:this.lesson.role,finished:this.finished,completedSteps:this.step,totalSteps:this.totalSteps,durationSeconds:this.startedAt===null?0:Math.round(((this.completedAt??this.now())-this.startedAt)/1000),recoverySeconds:null,invalidActions:this.errors,hintsUsed:this.hints,artifact:this.artifact,decisions:this.decisions.map(x=>({...x})),log:this.log.map(x=>({...x}))};}
}
