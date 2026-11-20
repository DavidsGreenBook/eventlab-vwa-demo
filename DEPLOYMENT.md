# Đưa EventLab VWA lên GitHub và website

## Chọn phương án

| Mục tiêu | Phương án |
| --- | --- |
| Lưu mã nguồn, xem lịch sử sửa và có website demo được phép công khai | GitHub và GitHub Pages |
| Có link trình bày nhanh, tải thư mục từ máy lên | Netlify Drop |
| Giữ repository riêng tư, quản lý người xem website | GitHub private kết hợp hosting có kiểm soát truy cập theo gói được chọn |

GitHub là nơi quản lý mã nguồn. GitHub Pages hoặc Netlify là nơi chạy website. Việc lưu repository private không mặc định làm website riêng tư. Chỉ chọn Public và website công khai khi phạm vi chia sẻ đã được thống nhất.

Gói `EventLab_VWA_GitHub_Web_Ready.zip` đã được sắp xếp để `index.html` nằm ngay ở thư mục gốc. Gói mã nguồn đầu tiên trước đây có `index.html` trong `dist`; dùng gói mới này để làm theo hướng dẫn dưới đây. Không cần npm install hoặc build cho website hiện tại.

## A. GitHub Pages bằng trình duyệt

1. Giải nén gói mới. Mở thư mục có `index.html`, `app.js`, `scenario.js`, `fallback.js`, `style.css`, `vendor`, `tests` và các hướng dẫn.
2. Đăng nhập GitHub, chọn New repository. Đặt tên ví dụ `eventlab-vwa-demo`. Chọn chủ sở hữu là tài khoản hoặc tổ chức được giao quản lý. Chọn Public nếu mã và demo được phép công khai; GitHub Free hỗ trợ Pages cho repository public.
3. Chọn Add file > Upload files. Kéo các tệp và thư mục BÊN TRONG thư mục giải nén vào GitHub, không kéo cả thư mục cha hoặc chỉ tải tệp ZIP. `index.html` phải xuất hiện ngay trang gốc của repository, cùng cấp với `vendor`.
4. Chọn Commit changes, lưu lên nhánh `main`. Nếu repository dùng nhánh khác, chọn nhánh thực tế ở bước cấu hình tiếp theo.
5. Mở Settings > Pages. Trong Build and deployment, chọn Source = Deploy from a branch; Branch = main; Folder = /(root); chọn Save.
6. Theo dõi mục Actions nếu cần kiểm tra trạng thái xuất bản. Sau khi thành công, mở Settings > Pages > Visit site để lấy link thực tế.
7. Link project site thường có dạng `https://TEN_TAI_KHOAN.github.io/eventlab-vwa-demo/`. Dùng địa chỉ GitHub trả về, không suy ra link chỉ từ tên repository.
8. Bật Enforce HTTPS nếu tùy chọn khả dụng. Mở link trực tiếp trên trình duyệt trong kính để thử WebXR; một iframe có thể cần quyền bổ sung.

`.nojekyll` là tệp hỗ trợ xuất bản tĩnh. Nếu trình quản lý tệp ẩn tệp này, có thể tạo tệp rỗng tên `.nojekyll` bằng Add file > Create new file trên GitHub. Giữ nguyên `vendor/three.module.js` và `vendor/THREE-LICENSE.txt`.

## B. Cập nhật website GitHub Pages

Với thay đổi nhỏ, mở tệp trên GitHub, chọn Edit, sửa và Commit changes. Với thay đổi nhiều tệp, dùng Upload files hoặc GitHub Desktop. Giữ nguyên cấu trúc thư mục; mỗi lần cập nhật nhánh được chọn sẽ kích hoạt xuất bản lại. GitHub Desktop cần thực hiện Commit rồi Push origin để website nhận thay đổi.

Đợi triển khai thành công, tải lại trang và chạy đủ một lượt thực hành. Nếu trình duyệt còn bản cũ, tải lại không dùng cache. Link website giữ nguyên nếu repository và cấu hình Pages giữ nguyên.

| Muốn thay đổi | Tệp chính |
| --- | --- |
| Checklist, điều kiện sẵn sàng, quy tắc sự cố, báo cáo | `scenario.js` |
| Cảnh 3D, tương tác, kết nối giao diện, thời điểm tạo sự cố | `app.js` |
| Màu sắc, kích thước và bố trí giao diện | `style.css` |
| Hội trường khám phá 0.3 | `index.html`, `venue.js`, `venue-model.js`, `venue-renderer.js`, `venue.css` |
| Tiêu đề, nút và bố cục bài thực hành | `practice.html` |
| Hình minh họa dùng khi thiếu WebGL | `fallback.js` |

## C. Netlify Drop

1. Giải nén gói. Xác định thư mục có `index.html` ngay bên trong.
2. Đăng nhập Netlify ở đúng team sẽ quản lý demo.
3. Mở https://app.netlify.com/drop và kéo thư mục đó vào vùng tải lên.
4. Chờ hoàn tất, lấy URL trong dashboard. Kiểm tra quyền xem project; việc công khai phụ thuộc cấu hình và gói của team.
5. Để cập nhật, mở đúng project cũ, tải thư mục đã sửa vào vùng Production deploys. Tránh tạo project mới mỗi lần nếu muốn giữ link.

Gói có `netlify.toml` đặt publish directory là `.` và không yêu cầu build. Nếu sau này kết nối Netlify với repository GitHub này, chọn nhánh đúng, không đặt build command; publish directory là `.`. Mỗi lần push có thể triển khai lại theo cấu hình Git integration.

## D. Máy chủ hoặc website của Học viện

Cán bộ CNTT có thể đưa các tệp website lên một thư mục static qua HTTPS, giữ nguyên đường dẫn tương đối. Máy chủ cần trả JavaScript bằng MIME type phù hợp và không chặn WebXR cho origin đó. Nếu nhúng iframe, cấu hình quyền `xr-spatial-tracking` và thử thực tế trên kính. Mở website thành tab trực tiếp là cách kiểm thử ban đầu đơn giản hơn.

## E. Chạy cục bộ và kiểm tra

Tại thư mục đã giải nén, có thể chạy `python -m http.server 8000`, sau đó mở `http://localhost:8000` trên cùng máy để xem. WebXR trên kính ở thiết bị khác cần origin HTTPS phù hợp; không mở `index.html` bằng `file://`.

Nếu có Node.js, chạy:

```sh
npm test
node --check app.js
node --check fallback.js
```

Các bài kiểm tra hiện xác nhận logic nhiệm vụ, không xác nhận phần dựng WebGL hoặc khả năng vận hành trên kính. Chưa có kính thật để kiểm thử WebXR. Khi trình duyệt thiếu WebGL, trang tự dùng chế độ minh họa 2D có nhãn.

## F. Dùng lại khi làm việc cùng trợ lý

Gửi link repository và mô tả thay đổi mong muốn. Để trợ lý thao tác trực tiếp với repository trong tài khoản của bạn, cần kết nối GitHub phù hợp. Nếu chưa kết nối, có thể gửi bản ZIP mới nhất để sửa và nhận lại các tệp cập nhật. Giữ một repository chính làm nguồn chuẩn sau khi chuyển sang GitHub; các bản trên hosting khác không tự đồng bộ nếu chưa được cấu hình.

## Nguồn hướng dẫn

- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Tải tệp lên GitHub: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- Netlify Drop: https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/
- WebXR và HTTPS: https://developers.meta.com/vr/documentation/web/port-vr-xr/
