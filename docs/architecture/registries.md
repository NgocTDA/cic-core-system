# Lưu trữ sổ đăng ký SRS

API dùng `SRS_REGISTRY_DIR`; mặc định là `data/registries` tính từ thư mục chạy frontend. Docker Compose dùng named volume `srs-registries` tại `/app/data/registries`; cấu hình và key vẫn mount chỉ đọc.

## Chuyển dữ liệu hiện có

Trước khi đổi phiên bản, sao lưu các CSV đang dùng. Đặt `SRS_REGISTRY_DIR` trỏ tới thư mục dữ liệu hiện có, hoặc sao chép CSV vào thư mục/volume mới khi ứng dụng đã dừng. Không ghi đè dữ liệu mới bằng mẫu trong docs. Kiểm tra số dòng và nội dung trước khi mở quyền chỉnh sửa.

Ứng dụng không còn tự đọc đường dẫn Windows cá nhân hoặc `config/registries`. Nếu chưa chuyển dữ liệu, giao diện sẽ hiển thị sổ rỗng; file cũ không bị xóa.

Header trong CSV hiện có được giữ làm schema. Khi chưa có file, schema mặc định nằm trong `app/api/srs/registries/store.ts`; cần đối chiếu các schema mặc định với quy ước nghiệp vụ trước khi nhập dữ liệu thật.

## Ghi dữ liệu và xung đột

POST nhận thao tác add/update/delete, revision và rowId thay vì nhận toàn bộ bảng. ID hàng có hiệu lực trong snapshot cùng revision; sau mỗi thay đổi phải dùng snapshot mới. Phiên bản cũ nhận 409, người dùng cần tải lại và áp dụng thay đổi lên bản mới.

Ghi dữ liệu dùng lock độc quyền và file tạm cùng thư mục, sau đó rename. Nếu process chết khi giữ lock, chỉ xóa file `.lock` sau khi xác minh không còn process nào ghi sổ đó và đã sao lưu. Không tự phá lock theo timeout.

Xác thực và phân quyền server chưa được triển khai trong đợt sửa này. Không coi khả năng chọn role trên giao diện là biện pháp bảo vệ API ghi dữ liệu.
