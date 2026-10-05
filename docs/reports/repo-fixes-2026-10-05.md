# Kết quả đợt sửa lỗi song song

Đối chiếu báo cáo `repo-audit-2026-10-05.md`. Ba agent Codex thực hiện nhóm registry, Confluence và UI; agent điều phối hoàn thiện ca còn sót và kiểm tra tích hợp. Các agent gặp giới hạn sử dụng trước khi tổng kết; kết quả dưới đây dựa trên mã hiện tại và kiểm tra chạy lại.

## Đã sửa

- F01: Space không còn nhận CSS string qua prop size.
- F02–F04, F07–F08: registry ghi theo thao tác và ID snapshot; kiểm tra revision, lock và atomic rename; không ghi đè tập kết quả lọc; CSV giữ quote/multiline/ô rỗng; schema độc lập dữ liệu; xóa dòng cuối; giao diện giữ dữ liệu khi lưu lỗi; thư mục dữ liệu và volume riêng.
- F05, F09–F10: Confluence so sánh origin chính xác, kiểm soát redirect, giới hạn byte trong stream và timeout; bỏ ảnh ngoài origin cấu hình; loại config PAT/data khỏi Docker context; bỏ hook tự kill process và xóa cache.
- F11: menu chưa triển khai có thông báo trung thực, URL không khớp menu vẫn 404; Portal giữ layout; link quên mật khẩu có trang hướng dẫn; route new-template chuyển hướng về create.
- F12: audit không tự bịa IP hoặc thời gian thiếu; cột ngày căn giữa, username nowrap.
- F13–F15 (một phần): sửa CSS variables thiếu, đồng bộ hướng dẫn Forest và hai guide, pagination điều khiển ở Product/Variable, FilterBar chỉ hiện nút thêm lọc khi có callback thật, registry dùng ActionMenu và footer Modal căn giữa.
- F16: includeChildren được tôn trọng; collection phân trang có giới hạn và báo lỗi khi vượt giới hạn.
- F17 (một phần): thêm scripts typecheck/test, sửa hai cảnh báo hook.

## Kiểm chứng

- `npm test`: **12/12 đạt**, gồm CSV round-trip, row identity trang sau, giữ dòng không hiển thị, revision cũ, cạnh tranh ghi, xóa cuối cùng, chặn origin giả/redirect, giới hạn stream, pagination và fallback route.
- `npm run typecheck`: **đạt**.
- `next lint --no-cache`: **không lỗi/cảnh báo**.
- `npm run build`: **đạt**, sinh 43 trang. Còn cảnh báo cache Webpack không snapshot được dependency và Browserslist cũ; chưa cập nhật dependency trong đợt này.
- Chưa chạy browser end-to-end, Docker build hoặc Confluence thật. Không đọc key/PAT thật.

## Lưu ý vận hành

Đọc [hướng dẫn registry](../architecture/registries.md) trước khi dùng dữ liệu hiện có: cấu hình `SRS_REGISTRY_DIR` hoặc chuyển CSV vào volume mới. Không tự di chuyển/xóa dữ liệu cũ. ID hàng chỉ có hiệu lực với revision tương ứng. Process chết khi giữ lock cần xử lý lock thủ công sau khi kiểm tra và sao lưu.

Ảnh ngoài origin Confluence hiện bị bỏ qua có chủ đích. Các API ghi/AI chưa có xác thực server (F06); không coi hệ thống sẵn sàng production.

## Chưa hoàn tất trong đợt này

- F06: cần chốt tích hợp identity/SSO và phân quyền server thực tế.
- F13/F15: chưa hợp nhất toàn bộ màu legacy, chưa chuyển mọi màn hình chi tiết sang ChangeHistoryCollapse; CollectBalance vẫn còn Timeline, Product detail chưa có nguồn audit đầy đủ.
- F17: chưa dọn toàn bộ 195 chẩn đoán unused, chưa thêm pipeline CI.
- Chưa xóa file/archive/template trùng hoặc dependency; giữ danh sách đề xuất trong báo cáo gốc. Không commit hoặc triển khai.
- Build đã cập nhật output `.next` và có thể cập nhật cache TypeScript đang tracked; file cache đã có thay đổi từ trước nên không reset để tránh ghi đè công việc hiện hữu.
