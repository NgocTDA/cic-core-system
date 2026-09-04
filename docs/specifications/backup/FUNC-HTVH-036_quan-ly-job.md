# Chức năng [FUNC-HTVH-036] Quản lý Job

<!--
  Đặc tả loại UI — soạn theo docs/CHILD_TEMPLATE_UI.md (đề cương v3.0).
  Nguồn đối chiếu: frontend/src/modules/ops-support/JobManagement/
                   frontend/app/ops-support/job-management/
                   frontend/src/context/RoleContext.tsx
  Sơ đồ PlantUML: docs/specifications/diagrams/FUNC-HTVH-036_*.puml
  Kết xuất lại ảnh sau khi sửa .puml:
      cd docs/specifications/diagrams && ./render.sh
      (hoặc PLANTUML_URL=http://10.16.17.7:8787 ./render.sh)
-->

> **Lưu ý về mã tham chiếu.** Bộ đăng ký (`messages.csv`, `roles.csv`, `states.csv`,
> `objects.csv`, `participants.csv`, `components.csv`) chưa được đưa vào kho mã này.
>
> **Đã chốt:** mã chức năng `FUNC-HTVH-036`, nhóm chức năng `GRP-HTVH-05`,
> chức năng kế tiếp `FUNC-HTVH-037`. Các mã nội bộ dẫn xuất từ mã chức năng —
> tính năng `FEAT-HTVH-036-xx`, màn hình `MH-HTVH-036-xxx`, quy tắc `BR-HTVH-036-xxx` —
> đã đồng bộ theo.
>
> **Còn là mã tạm**, đặt đúng dạng thức quy ước nhưng phải đối chiếu và cấp lại số
> khi hợp nhất vào sổ đăng ký: mã use case (`UC-08xx`), mã thông báo
> (`ERR_/SUC_/WAR_/INF_/CONF_`), mã vai trò (`ROLE-`), mã trạng thái (`ST-`),
> mã component (`CMP-`), mã tác nhân hệ thống (`HT-`).
> Xem mục Vấn đề còn mở, dòng 11 và 12.

---

## Mô tả chung

| Hạng mục | Nội dung |
|---|---|
| Loại chức năng | UI |
| Mã chức năng | FUNC-HTVH-036 |
| Tên chức năng | Quản lý Job |
| Nhóm chức năng | GRP-HTVH-05 — Quản trị hệ thống |
| Mô tả chức năng | Cho phép cán bộ quản trị và vận hành tra cứu, thiết lập, điều chỉnh và giám sát các tiến trình xử lý tự động (Job) của hệ thống CIC Core: khai báo thông tin định danh và tham số thực thi, lập lịch chạy bằng biểu thức Cron hoặc theo sự kiện, cấu hình chính sách thử lại khi gặp lỗi và ma trận cảnh báo sự cố, kích hoạt chạy thủ công ngoài lịch, theo dõi tiến độ theo thời gian thực và tra cứu lịch sử các lượt thực thi. |
| Tác nhân chính | ROLE-QTHT (Quản trị hệ thống), ROLE-QLVH (Quản lý vận hành) |
| Tác nhân phụ | ROLE-XEM (Người dùng chỉ xem), HT-SCH (Bộ lập lịch), HT-TB (Dịch vụ thông báo) |
| Vị trí chức năng | Menu: **Hỗ trợ vận hành > Quản trị hệ thống > Quản lý job**<br>Đường dẫn: `/ops-support/job-management` (khoá menu `ops-admin-jobs`) |
| Điều kiện tiên quyết | Người dùng đã đăng nhập, được cấp quyền truy cập phân hệ Hỗ trợ vận hành và có ít nhất quyền `view` trên đối tượng JOB. |
| Hậu điều kiện | Cấu hình Job được lưu và đồng bộ sang bộ lập lịch; mọi thao tác làm thay đổi dữ liệu sinh một bản ghi trong nhật ký thay đổi; mọi lượt kích hoạt chạy sinh một bản ghi lượt chạy. |
| Chức năng tiền đề | Không áp dụng |
| Chức năng kế tiếp | FUNC-HTVH-037 |
| Chức năng dùng chung | CMP-LAYOUT-001 (PageLayout), CMP-FILTER-001 (FilterBar / FilterCol), CMP-GRID-001 (Table + `tablePagination()`), CMP-ACTION-001 (ActionMenu), CMP-TAG-001 (StatusTag), CMP-POPOVER-001 (DisplaySettingPopover), CMP-EXPORT-001 (ExportExcelDropdown), CMP-HIST-001 (ChangeHistoryCollapse), CMP-HEADER-001 (`useHeaderActions`) |
| Yêu cầu đặc thù | Danh sách phản hồi dưới 1 giây với 500 bản ghi. Việc kích hoạt chạy Job là thao tác bất đồng bộ, không được khoá giao diện. Mọi biểu thức Cron hiển thị trên giao diện phải kèm diễn giải tiếng Việt. Ngăn theo dõi tiến độ cập nhật tối thiểu 1 lần/giây. Toàn bộ giá trị màu sắc, khoảng cách, kiểu chữ lấy từ `design-system/tokens.ts`, không khai báo giá trị cứng. |

---

## Truy vết yêu cầu

> Cột *Tên UC* do script build tự đổ từ `usecases.csv`. Các mã UC dưới đây là **mã dự kiến**,
> cần đối chiếu lại với BRD khi sổ đăng ký use case được đưa vào kho.

| Mã UC | Tên UC | Tính năng đáp ứng | Vai trò | Mức đáp ứng | Ghi chú |
|---|---|---|---|---|---|
| UC-0810 | Tra cứu danh sách tiến trình xử lý tự động | FEAT-HTVH-036-01 | Chính | Đầy đủ | Bộ lọc trên thanh, bộ lọc trên tiêu đề cột, diễn giải biểu thức Cron |
| UC-0811 | Kích hoạt chạy tiến trình xử lý thủ công | FEAT-HTVH-036-02 | Chính | Đầy đủ | Chạy đơn lẻ từ menu thao tác và chạy hàng loạt từ thanh tác vụ |
| UC-0812 | Xem chi tiết cấu hình tiến trình xử lý | FEAT-HTVH-036-03 | Chính | Đầy đủ | Ba khối cấu hình + bảng lịch sử thay đổi |
| UC-0813 | Tra cứu lịch sử thực thi tiến trình | FEAT-HTVH-036-04 | Chính | Một phần | Bộ lọc khoảng thời gian chưa gắn logic — xem Vấn đề còn mở, dòng 2 |
| UC-0814 | Thiết lập tham số và lịch chạy tiến trình | FEAT-HTVH-036-05 | Chính | Đầy đủ | Ba khối cấu hình, hỗ trợ nhân bản từ Job có sẵn |
| UC-0815 | Điều chỉnh trạng thái hoạt động của tiến trình | FEAT-HTVH-036-06 | Chính | Một phần | Trạng thái ARCHIVED chưa có thao tác chuyển — xem Vấn đề còn mở, dòng 7 |
| Không thuộc UC | — | FEAT-HTVH-036-07 | Chính | Đầy đủ | Tính năng kỹ thuật dùng chung toàn hệ thống: cấu hình cột hiển thị và kết xuất dữ liệu. Căn cứ: quy ước giao diện chuẩn tại `docs/design-system/patterns.md` |

---

## Ma trận phân quyền

> Mã vai trò trong tài liệu ↔ hằng số trong mã nguồn (`RoleContext.tsx`):
> **ROLE-QTHT** ↔ `ADMIN` · **ROLE-QLVH** ↔ `MANAGER` · **ROLE-XEM** ↔ `VIEWER`.
> Vai trò hiện đang được nạp từ bộ nhớ cục bộ của trình duyệt (khoá `userRole`, mặc định `ADMIN`),
> phải chuyển sang lấy từ phiên đăng nhập thật khi tích hợp xác thực.

| STT | Mã tính năng | Tính năng / Thao tác | ROLE-QTHT | ROLE-QLVH | ROLE-XEM | Phạm vi dữ liệu |
|---|---|---|---|---|---|---|
| 1 | FEAT-HTVH-036-01 | Tra cứu và xem danh sách Job | X | X | X | Toàn hệ thống |
| 2 | FEAT-HTVH-036-02 | Kích hoạt chạy Job thủ công (đơn lẻ / hàng loạt) | X | X |  | Toàn hệ thống |
| 3 | FEAT-HTVH-036-02 | Dừng lượt chạy đang thực thi | X | X |  | Toàn hệ thống |
| 4 | FEAT-HTVH-036-03 | Xem chi tiết cấu hình và lịch sử thay đổi | X | X | X | Toàn hệ thống |
| 5 | FEAT-HTVH-036-04 | Tra cứu lịch sử chạy Job | X | X | X | Toàn hệ thống |
| 6 | FEAT-HTVH-036-05 | Thiết lập Job mới | X | X |  | Toàn hệ thống |
| 7 | FEAT-HTVH-036-05 | Chỉnh sửa cấu hình Job | X | X |  | Toàn hệ thống |
| 8 | FEAT-HTVH-036-05 | Cấu hình ma trận cảnh báo sự cố | X | X |  | Toàn hệ thống |
| 9 | FEAT-HTVH-036-05 | Cấu hình phụ thuộc giữa các Job | X |  |  | Toàn hệ thống |
| 10 | FEAT-HTVH-036-06 | Kích hoạt / Vô hiệu hóa Job | X | X |  | Toàn hệ thống |
| 11 | FEAT-HTVH-036-06 | Xóa Job | X |  |  | Toàn hệ thống |
| 12 | FEAT-HTVH-036-07 | Cấu hình cột hiển thị | X | X | X | Bản ghi được phép xem |
| 13 | FEAT-HTVH-036-07 | Kết xuất Excel và in danh sách | X | X | X | Bản ghi được phép xem |

**Quy tắc dựng giao diện theo quyền**

| Thành phần | Quy tắc |
|---|---|
| Ô chọn dòng (checkbox) | Bị vô hiệu hóa khi vai trò không có quyền `run` **và** không có quyền `delete` |
| Menu thao tác — *Chỉnh sửa*, *Kích hoạt*, *Vô hiệu hóa* | Chỉ hiện khi có quyền `edit` |
| Menu thao tác — *Chạy ngay* | Chỉ hiện khi có quyền `run` |
| Menu thao tác — *Xóa* (kèm đường phân cách phía trên) | Chỉ hiện khi có quyền `delete` |
| Menu thao tác — *Xem chi tiết*, *Lịch sử chạy Job* | Luôn hiện với mọi vai trò |

---

## Danh sách màn hình

| STT | Mã màn hình | Tên màn hình | Tính năng sử dụng | Mô tả |
|---|---|---|---|---|
| 1 | MH-HTVH-036-001 | Danh sách Quản lý Job | FEAT-HTVH-036-01, -02, -03, -04, -06, -07 | Trang chính tại `/ops-support/job-management`. Gồm thanh bộ lọc trong thẻ, bảng dữ liệu 8 cột cấu hình được + cột Thao tác cố định bên phải, và các nút trên thanh tác vụ. |
| 2 | MH-HTVH-036-002 | Popup Chi tiết Job | FEAT-HTVH-036-03 | Cửa sổ nổi rộng `70vw`, căn giữa. Gồm thanh trạng thái + nút *Chạy ngay*, ba khối cấu hình chỉ đọc và khối Lịch sử thay đổi. |
| 4 | MH-HTVH-036-004 | Popup Lịch sử chạy Job | FEAT-HTVH-036-04 | Cửa sổ nổi rộng `70vw`, căn giữa. Gồm thanh lọc theo trạng thái và khoảng thời gian, bảng 8 cột phân trang 10 bản ghi/trang. |
| 5 | MH-HTVH-036-005 | Thiết lập / Cập nhật Job | FEAT-HTVH-036-05 | Trang biểu mẫu tại `/create` và `/{id}/edit`. Ba khối nhập liệu ngăn bằng đường kẻ, hai nút *Lưu* / *Hủy* căn giữa cuối trang. |
| 6 | MH-HTVH-036-006 | Popup Xác nhận thực hiện Job | FEAT-HTVH-036-02 | Cửa sổ xác nhận căn giữa, không icon tiêu đề, hai nút *Hủy* / *Chạy ngay* căn giữa ở chân. |
| 7 | MH-HTVH-036-007 | Trang Chi tiết Job (toàn màn hình) | FEAT-HTVH-036-03 | Trang tại `/{id}`, cùng nội dung với MH-HTVH-036-002 nhưng chiếm trọn màn hình. Hiện **chưa có điều hướng tới** từ danh sách — xem Vấn đề còn mở, dòng 6. |

---

## Luồng màn hình

`[[DIAGRAM: FUNC-HTVH-036_nav-01]]`

![Luồng chuyển màn hình theo thao tác của người dùng](diagrams/FUNC-HTVH-036_nav-01.png)

> *Hình: Luồng chuyển màn hình theo thao tác của người dùng.* Nguồn PlantUML: [FUNC-HTVH-036_nav-01.puml](diagrams/FUNC-HTVH-036_nav-01.puml) · bản vector: [FUNC-HTVH-036_nav-01.svg](diagrams/FUNC-HTVH-036_nav-01.svg)

```
[MH-HTVH-036-001 Danh sách Quản lý Job]
   ├── Nhấp dòng bản ghi / Menu thao tác > "Xem chi tiết"
   │        └──> [MH-HTVH-036-002 Popup Chi tiết Job]
   │                 └── Nút "Chạy ngay"
   │                          └──> [MH-HTVH-036-006 Popup Xác nhận]
   │                                   └── "Chạy ngay"
   │                                            └──> Hiển thị thông báo thành công
   ├── Menu thao tác > "Lịch sử chạy Job"
   │        └──> [MH-HTVH-036-004 Popup Lịch sử chạy Job]
   ├── Menu thao tác > "Chạy ngay"  |  Thanh tác vụ > "Chạy Job (N)"
   │        └──> [MH-HTVH-036-006 Popup Xác nhận] ──> quay về danh sách
   └── Thanh tác vụ > "Thiết lập job mới"  |  Menu thao tác > "Chỉnh sửa"
            └──> [MH-HTVH-036-005 Thiết lập / Cập nhật Job]
                     └── "Lưu" thành công / "Hủy" / biểu tượng quay lại ──> quay về danh sách
```

---

## Sơ đồ trạng thái

**Đối tượng nghiệp vụ `JOB` — trạng thái hoạt động**

`[[DIAGRAM: FUNC-HTVH-036_state-01]]`

![Vòng đời trạng thái hoạt động của đối tượng JOB](diagrams/FUNC-HTVH-036_state-01.png)

> *Hình: Vòng đời trạng thái hoạt động của đối tượng JOB.* Nguồn PlantUML: [FUNC-HTVH-036_state-01.puml](diagrams/FUNC-HTVH-036_state-01.puml) · bản vector: [FUNC-HTVH-036_state-01.svg](diagrams/FUNC-HTVH-036_state-01.svg)

| Mã trạng thái | Giá trị | Nhãn hiển thị | Ý nghĩa |
|---|---|---|---|
| ST-JOB-01 | `ACTIVE` | Hoạt động | Job đang được bộ lập lịch theo dõi và chạy tự động theo biểu thức Cron. |
| ST-JOB-02 | `INACTIVE` | Ngừng hoạt động | Job đã bị gỡ khỏi lịch tự động, vẫn có thể được kích hoạt chạy thủ công. |

**Đối tượng nghiệp vụ `LUOTCHAY` — trạng thái một lượt thực thi**

`[[DIAGRAM: FUNC-HTVH-036_state-02]]`

![Vòng đời một lượt thực thi Job](diagrams/FUNC-HTVH-036_state-02.png)

> *Hình: Vòng đời một lượt thực thi Job.* Nguồn PlantUML: [FUNC-HTVH-036_state-02.puml](diagrams/FUNC-HTVH-036_state-02.puml) · bản vector: [FUNC-HTVH-036_state-02.svg](diagrams/FUNC-HTVH-036_state-02.svg)

| Mã trạng thái | Giá trị | Nhãn hiển thị | Ý nghĩa |
|---|---|---|---|
| ST-LUOTCHAY-01 | `SUCCESS` | Thành công | Lượt chạy xử lý xong toàn bộ bản ghi. |
| ST-LUOTCHAY-02 | `FAILED` | Lỗi | Lượt chạy gặp sự cố hoặc vượt quá thời gian chờ tối đa. |
| ST-LUOTCHAY-03 | `RUNNING` | Đang chạy | Lượt chạy đang được thực thi. |
| ST-LUOTCHAY-04 | `CANCELLED` | Đã hủy | Lượt chạy bị người dùng dừng giữa chừng. |

---

## Luồng nghiệp vụ

`[[DIAGRAM: FUNC-HTVH-036_flow-01]]`

![Luồng nghiệp vụ tổng thể Quản lý Job](diagrams/FUNC-HTVH-036_flow-01.png)

> *Hình: Luồng nghiệp vụ tổng thể Quản lý Job.* Nguồn PlantUML: [FUNC-HTVH-036_flow-01.puml](diagrams/FUNC-HTVH-036_flow-01.puml) · bản vector: [FUNC-HTVH-036_flow-01.svg](diagrams/FUNC-HTVH-036_flow-01.svg)

1. Cán bộ vận hành truy cập **Hỗ trợ vận hành > Quản trị hệ thống > Quản lý job**. Hệ thống nạp danh sách Job, dựng cột hiển thị theo cấu hình và dựng menu thao tác theo quyền của vai trò đang đăng nhập.
2. Cán bộ thu hẹp danh sách bằng thanh bộ lọc (Mã Job, Tên Job, Mã dịch vụ, Loại Job, Trạng thái) và bằng bộ lọc trực tiếp trên tiêu đề cột (Loại Job, Điều kiện kích hoạt, Trạng thái).
3. **Nhánh tra cứu:** mở popup Chi tiết Job để xem ba khối cấu hình và bảng Lịch sử thay đổi; mở popup Lịch sử chạy Job để đối chiếu thời lượng, số bản ghi đã xử lý và số lần thử lại của từng lượt.
4. **Nhánh vận hành khẩn cấp:** tích chọn một hoặc nhiều Job rồi nhấp *Chạy Job (N)*, hoặc chọn *Chạy ngay* trên menu thao tác của một dòng. Hệ thống bật popup xác nhận có hiển thị Mã Job và Tên Job; sau khi xác nhận, Job được đưa vào hàng đợi thực thi, một bản ghi lượt chạy mới được sinh ra và cảnh báo được gửi theo ma trận thông báo đã cấu hình.
5. **Nhánh điều chỉnh cấu hình:** mở màn hình Thiết lập Job, nhập ba khối thông tin, hệ thống kiểm tra ràng buộc rồi ghi cấu hình, ghi nhật ký thay đổi và đăng ký lại lịch chạy với bộ lập lịch.
6. **Nhánh điều chỉnh trạng thái:** chọn *Kích hoạt* hoặc *Vô hiệu hóa* để bật/tắt lịch chạy tự động của Job.
7. Khi cần báo cáo, cán bộ kết xuất danh sách ra tệp Excel theo trang hiện tại hoặc theo bộ lọc đang áp dụng.

---

## Quy tắc nghiệp vụ

| Mã quy tắc | Nội dung quy tắc | Áp dụng cho | Mã thông báo khi vi phạm |
|---|---|---|---|
| BR-HTVH-036-001 | Mã Job là bắt buộc, tối đa 20 ký tự, chỉ gồm chữ in hoa `A–Z`, chữ số `0–9`, dấu gạch ngang `-` và dấu gạch dưới `_`. Ký tự nhập vào được tự động chuyển sang chữ in hoa và loại bỏ ký tự không hợp lệ ngay khi gõ. | FEAT-HTVH-036-05 | ERR_001, ERR_002 |
| BR-HTVH-036-002 | Mã Job là bất biến: ở chế độ cập nhật, ô nhập Mã Job bị khóa và không cho phép chỉnh sửa. | FEAT-HTVH-036-05 | Không áp dụng |
| BR-HTVH-036-003 | Tên Job là bắt buộc, tối đa 100 ký tự. Mã dịch vụ là bắt buộc, tối đa 50 ký tự. Loại Job là bắt buộc, chọn từ 8 giá trị đã định nghĩa. | FEAT-HTVH-036-05 | ERR_003, ERR_004, ERR_005, ERR_006 |
| BR-HTVH-036-004 | Mô tả Job tối đa 1000 ký tự. Tham số bổ sung (YAML/JSON) tối đa 1500 ký tự. Cả hai ô đều hiển thị bộ đếm ký tự. | FEAT-HTVH-036-05 | ERR_007, ERR_008 |
| BR-HTVH-036-005 | Khi Điều kiện kích hoạt là `SCHEDULER` hoặc `MANUAL`, ô **Biểu thức Cron** hiển thị và là bắt buộc. Khi Điều kiện kích hoạt là `EVENT`, ô Biểu thức Cron bị ẩn và thay bằng ô **Tên sự kiện kích hoạt** là bắt buộc. | FEAT-HTVH-036-05 | ERR_011, ERR_012 |
| BR-HTVH-036-006 | Chờ tối đa (giây) là bắt buộc, giá trị nguyên trong khoảng 1 đến 86400 giây. | FEAT-HTVH-036-05 | ERR_009, ERR_010 |
| BR-HTVH-036-007 | Số lần thử lại tối đa là giá trị nguyên trong khoảng 0 đến 10 lần. | FEAT-HTVH-036-05 | ERR_013 |
| BR-HTVH-036-008 | Chờ ban đầu (giây) là giá trị nguyên trong khoảng 1 đến 86400 giây. Khai báo thêm các Job cần hoàn thành trước (nếu có) thông qua droplist đa chọn. | FEAT-HTVH-036-05 | ERR_010 |
| BR-HTVH-036-009 | Khi bật "Khóa chạy song song", hệ thống không khởi tạo lượt chạy mới nếu Job đang có một lượt ở trạng thái `RUNNING`. | FEAT-HTVH-036-02 | ERR_016 |
| BR-HTVH-036-010 | Mọi thao tác kích hoạt chạy Job — đơn lẻ hay hàng loạt, từ danh sách hay từ popup chi tiết — đều phải qua popup xác nhận. Popup không có icon tiêu đề, hai nút được căn giữa ở chân. | FEAT-HTVH-036-02 | CONF_001, CONF_002 |
| BR-HTVH-036-011 | Nút *Chạy Job (N)* chỉ xuất hiện trên thanh tác vụ khi số dòng được chọn lớn hơn 0, và biến mất ngay khi bỏ chọn hết. Sau khi kích hoạt thành công, danh sách chọn được xóa trắng. | FEAT-HTVH-036-02 | Không áp dụng |
| BR-HTVH-036-012 | Ô chọn dòng chỉ khả dụng với vai trò có quyền `run` hoặc `delete`. Các mục trên menu thao tác được dựng theo quyền — xem bảng quy tắc ở mục Ma trận phân quyền. | FEAT-HTVH-036-01, -02, -06 | Không áp dụng |
| BR-HTVH-036-013 | Cấu hình cột hiển thị phải luôn giữ tối thiểu một cột. Nút *Bỏ chọn* giữ lại cột đầu tiên. Cột *Thao tác* không nằm trong danh sách cấu hình và luôn hiển thị, cố định bên phải. | FEAT-HTVH-036-07 | Không áp dụng |
| BR-HTVH-036-014 | Mọi vị trí hiển thị biểu thức Cron phải kèm diễn giải tiếng Việt. Biểu thức có ít hơn 5 trường được diễn giải là "Biểu thức Cron không đúng định dạng"; biểu thức rỗng được diễn giải là "Chưa thiết lập biểu thức Cron". | FEAT-HTVH-036-01, -03, -05 | Không áp dụng |
| BR-HTVH-036-015 | Mọi thao tác làm thay đổi dữ liệu cấu hình Job phải sinh một bản ghi trong Bảng Lịch sử thay đổi với đủ 8 cột chuẩn. Bảng đặt trong khối thu gọn, mặc định đóng, hiển thị tối đa 20 bản ghi mới nhất xếp trên cùng, vùng cuộn cao 250px, không phân trang. | FEAT-HTVH-036-03, -05, -06 | Không áp dụng |
| BR-HTVH-036-016 | Khi nhân bản Job từ bản ghi có sẵn, hệ thống điền sẵn Mã Job là `{mã gốc}_COPY` và Tên Job là `{tên gốc} (Bản sao)`; các tham số còn lại sao chép nguyên vẹn. | FEAT-HTVH-036-05 | Không áp dụng |
| BR-HTVH-036-017 | Trạng thái Job chuyển đổi hai chiều giữa `ACTIVE` và `INACTIVE`. Chuyển sang `INACTIVE` thì gỡ lịch chạy tự động; chuyển sang `ACTIVE` thì đăng ký lại lịch theo biểu thức Cron hiện hành. | FEAT-HTVH-036-06 | Không áp dụng |
| BR-HTVH-036-018 | Số lần thử lại của một lượt chạy hiển thị dưới dạng số nguyên thuần túy, căn giữa, không dùng thẻ màu hay nhãn. | FEAT-HTVH-036-04 | Không áp dụng |
| BR-HTVH-036-019 | Thanh tác vụ chỉ có **một** nút mang kiểu nút chính tại mỗi thời điểm. Khi chưa chọn dòng nào, nút chính là *Thiết lập job mới*. Khi đã chọn ít nhất một dòng, nút *Chạy Job (N)* giành vị trí nút chính và *Thiết lập job mới* lùi về kiểu nút thường. Trên màn hình nhỏ, các nút phụ dạng nhãn chữ bị ẩn, chỉ giữ nút chính dạng biểu tượng tròn và các nút dạng thành phần tự dựng (*Cài đặt hiển thị*, *Xuất Excel*). | FEAT-HTVH-036-02, FEAT-HTVH-036-05, FEAT-HTVH-036-07 | Không áp dụng |

---

## Tính năng [FEAT-HTVH-036-01] Tra cứu và xem danh sách Job

### Mô tả yêu cầu

Người dùng tra cứu danh sách Job trong hệ thống theo Mã Job, Tên Job, Mã dịch vụ, Loại Job và Trạng thái. Hệ thống hiển thị kết quả dưới dạng bảng gồm 8 cột có thể cấu hình ẩn/hiện, kèm cột Thao tác cố định bên phải. Mỗi ô biểu thức Cron có tooltip diễn giải lịch chạy bằng tiếng Việt. Ba cột *Loại Job*, *Điều kiện kích hoạt*, *Trạng thái* hỗ trợ lọc trực tiếp bằng biểu tượng phễu trên tiêu đề cột, áp dụng chồng lên kết quả của thanh bộ lọc.

Thanh bộ lọc cho phép người dùng chủ động thêm hoặc bớt các ô tìm kiếm hiển thị. Khi một ô bị ẩn, giá trị đang nhập trong ô đó được xóa để tránh lọc ngầm.

Ràng buộc: người dùng thuộc mọi vai trò đều xem được toàn bộ danh sách Job trên hệ thống; việc phân quyền chỉ tác động tới các thao tác, không tác động tới phạm vi dữ liệu hiển thị.

### Luồng xử lý

`[[DIAGRAM: FUNC-HTVH-036_seq-01]]`

![Trình tự — Tra cứu và xem danh sách Job](diagrams/FUNC-HTVH-036_seq-01.png)

> *Hình: Trình tự — Tra cứu và xem danh sách Job.* Nguồn PlantUML: [FUNC-HTVH-036_seq-01.puml](diagrams/FUNC-HTVH-036_seq-01.puml) · bản vector: [FUNC-HTVH-036_seq-01.svg](diagrams/FUNC-HTVH-036_seq-01.svg)

**Luồng chính**

| Bước | Tác nhân | Hành động | Phản hồi của hệ thống |
|---|---|---|---|
| 1 | Người dùng | Chọn menu **Hỗ trợ vận hành > Quản trị hệ thống > Quản lý job** | Hệ thống mở MH-HTVH-036-001, đặt tiêu đề trang là "Quản lý Job", nạp danh sách Job và hiển thị bảng phân trang 20 bản ghi/trang. |
| 2 | Người dùng | Nhập từ khóa vào ô *Mã Job*, *Tên Job* hoặc *Mã dịch vụ* | Hệ thống lọc danh sách theo phép so khớp chuỗi con, không phân biệt chữ hoa chữ thường, áp dụng ngay theo từng ký tự nhập vào. |
| 3 | Người dùng | Chọn giá trị tại ô *Loại Job* hoặc *Trạng thái* | Hệ thống lọc danh sách theo phép so khớp chính xác và kết hợp với các điều kiện đang có bằng phép **và**. |
| 4 | Người dùng | Nhấp biểu tượng phễu trên tiêu đề cột *Loại Job*, *Điều kiện kích hoạt* hoặc *Trạng thái* | Hệ thống hiển thị danh sách ô chọn tương ứng và lọc trực tiếp trên tập bản ghi đang hiển thị. |
| 5 | Người dùng | Rê chuột vào ô biểu thức Cron của một dòng | Sau 0,15 giây, hệ thống hiển thị tooltip "💡 Diễn giải: {mô tả lịch chạy bằng tiếng Việt}". |
| 6 | Người dùng | Chuyển trang hoặc đổi số bản ghi mỗi trang | Hệ thống hiển thị trang tương ứng và cập nhật dòng tổng kết "Hiển thị {từ}-{đến} trong tổng {tổng} bản ghi". |

**Luồng thay thế**

| Mã luồng | Điều kiện rẽ nhánh | Xử lý | Quay về bước |
|---|---|---|---|
| ALT-01-01 | Không có bản ghi nào thỏa điều kiện lọc | Hiển thị bảng rỗng kèm thông báo không có dữ liệu, giữ nguyên các giá trị đang nhập trên thanh bộ lọc | Bước 2 |
| ALT-01-02 | Người dùng nhấp nút **Làm mới** trên thanh bộ lọc | Xóa toàn bộ giá trị của các ô lọc, danh sách trở về trạng thái ban đầu | Bước 1 |
| ALT-01-03 | Người dùng nhấp **Thêm bộ lọc** và bỏ tích một ô lọc | Ẩn ô lọc khỏi thanh bộ lọc và xóa giá trị đang nhập trong ô đó | Bước 2 |
| ALT-01-04 | Người dùng nhấp **Thêm bộ lọc** và tích lại một ô lọc đã ẩn | Hiển thị lại ô lọc với giá trị rỗng | Bước 2 |
| ALT-01-05 | Ô biểu thức Cron của Job trống | Hệ thống lấy giá trị từ cấu hình lập lịch của Job; nếu vẫn trống thì hiển thị giá trị mặc định `0 0 1 * * *` | Bước 5 |

**Luồng ngoại lệ**

| Mã luồng | Tình huống ngoại lệ | Xử lý của hệ thống | Mã thông báo |
|---|---|---|---|
| EXC-01-01 | Không kết nối được dịch vụ lấy danh sách Job | Hiển thị trạng thái lỗi kèm nút **Thử lại**, giữ nguyên thanh bộ lọc | ERR_017 |
| EXC-01-02 | Biểu thức Cron của Job sai định dạng (dưới 5 trường) | Vẫn hiển thị biểu thức nguyên văn; tooltip ghi "Biểu thức Cron không đúng định dạng" | Không áp dụng |
| EXC-01-03 | Phiên đăng nhập hết hạn khi đang thao tác | Chuyển hướng về màn hình đăng nhập, không lưu điều kiện lọc | ERR_018 |

### Thiết kế giao diện

Ảnh mockup: `FEAT-HTVH-036-01_danh-sach-job.png` (MH-HTVH-036-001)

Bố cục từ trên xuống:

```
┌─ Thanh tác vụ ─────────────────────────────────────────────────────────────┐
│ Quản lý Job          [Cài đặt hiển thị] [Xuất Excel] [+ Thiết lập job mới] │
├─ Thẻ bộ lọc ───────────────────────────────────────────────────────────────┤
│ [Mã Job…] [Tên Job…] [Mã dịch vụ…] [Loại Job ▾] [Trạng thái ▾]            │
│                              [Tìm kiếm] [Làm mới] [⚙ Thêm bộ lọc]         │
├─ Bảng dữ liệu ─────────────────────────────────────────────────────────────┤
│ ☐ │STT│ Mã Job │ Tên Job │ Mã dịch vụ │ Loại Job ▽│ ĐK kích hoạt ▽│ Cron │ │
│   │   │        │         │            │           │               │      │ │
│ Trạng thái ▽ │ Thao tác ⋮  (cố định bên phải)                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Hiển thị 1-20 trong tổng {N} bản ghi        [10▾] ‹ 1 2 3 › [Đến trang __]│
└────────────────────────────────────────────────────────────────────────────┘
```

### Mô tả các thành phần trên giao diện

| STT | Tên thành phần | Kiểu dữ liệu / Loại control | Bắt buộc / Giá trị mặc định | Giới hạn | Mô tả ràng buộc |
|---|---|---|---|---|---|
| 1 | Mã Job (ô lọc) | Ô nhập chữ, có nút xóa nhanh | Không / Rỗng | Tối đa 20 ký tự | So khớp chuỗi con, không phân biệt hoa thường, trên trường Mã Job |
| 2 | Tên Job (ô lọc) | Ô nhập chữ, có nút xóa nhanh | Không / Rỗng | Tối đa 100 ký tự | So khớp chuỗi con, không phân biệt hoa thường, trên trường Tên Job |
| 3 | Mã dịch vụ (ô lọc) | Ô nhập chữ, có nút xóa nhanh | Không / Rỗng | Tối đa 50 ký tự | So khớp chuỗi con, không phân biệt hoa thường, trên trường Mã dịch vụ |
| 4 | Loại Job (ô lọc) | Danh sách chọn một, có nút xóa nhanh | Không / Rỗng | 8 tùy chọn | `DATA_SYNC`, `REPORT`, `CLEANUP`, `VALIDATION`, `BATCH`, `SPRING_BEAN`, `REST_API`, `SQL_SCRIPT` |
| 5 | Trạng thái (ô lọc) | Danh sách chọn một, có nút xóa nhanh | Không / Rỗng | 2 tùy chọn | `ACTIVE` — Hoạt động; `INACTIVE` — Ngừng hoạt động |
| 6 | Nút *Thêm bộ lọc* | Nút mở popover | Bắt buộc | 5 mục | Bật/tắt hiển thị 5 ô lọc trên thanh; bỏ tích thì xóa giá trị đang nhập của ô đó (BR-HTVH-036-014 không áp dụng) |
| 7 | Nút *Tìm kiếm* / *Làm mới* | Nút | Bắt buộc | — | *Làm mới* xóa toàn bộ điều kiện lọc về mặc định |
| 8 | Ô chọn dòng | Ô đánh dấu | Không / Bỏ chọn | 0..N dòng | Bị vô hiệu hóa khi vai trò không có quyền `run` và `delete` (BR-HTVH-036-012) |
| 9 | Cột **STT** | Số thứ tự dòng | Bắt buộc | Rộng 60px, căn giữa | Đánh số theo thứ tự dòng trong trang đang hiển thị |
| 10 | Cột **Mã Job** | Chữ dạng mã, in đậm | Bắt buộc | Rộng 150px | Hiển thị bằng phông chữ đơn cách |
| 11 | Cột **Tên Job** | Chữ in đậm | Bắt buộc | Rộng 220px | Cắt bớt bằng dấu ba chấm khi vượt quá bề rộng cột |
| 12 | Cột **Mã dịch vụ** | Chữ dạng mã | Bắt buộc | Rộng 170px | Trống thì hiển thị giá trị mặc định `SVC_CIC_CORE_SYNC` |
| 13 | Cột **Loại Job** | Chữ | Bắt buộc | Rộng 170px | Hiển thị nhãn tiếng Việt; có bộ lọc tiêu đề cột với 5 tùy chọn |
| 14 | Cột **Điều kiện kích hoạt** | Chữ | Bắt buộc | Rộng 175px | `SCHEDULER` — Bộ lập lịch; `EVENT` — Theo sự kiện; `MANUAL` — Thủ công. Trống thì hiển thị "Bộ lập lịch" |
| 15 | Cột **Biểu thức Cron** | Chữ dạng mã có nền, kèm tooltip | Bắt buộc | Rộng 140px | Tooltip diễn giải tiếng Việt, hiện sau 0,15 giây (BR-HTVH-036-014) |
| 16 | Cột **Trạng thái** | Thẻ trạng thái dùng chung | Bắt buộc | Rộng 140px | `ACTIVE` — thẻ xanh "Hoạt động"; `INACTIVE` — thẻ xám "Ngừng hoạt động". Có bộ lọc tiêu đề cột |
| 17 | Cột **Thao tác** | Menu ba chấm | Bắt buộc | Rộng 80px, cố định bên phải | Không nằm trong danh sách cấu hình cột (BR-HTVH-036-013) |
| 18 | Thanh phân trang | Bộ phân trang dùng chung | Bắt buộc / 20 bản ghi/trang | 10 / 20 / 50 / 100 | Có nút đổi số bản ghi mỗi trang, ô nhảy tới trang và dòng tổng kết |

### Xử lý sự kiện và thao tác

| STT | Sự kiện / Thao tác | Điều kiện | Xử lý của hệ thống | Kết quả / Mã thông báo |
|---|---|---|---|---|
| 1 | Mở trang | Người dùng có quyền `view` | Nạp danh sách Job, đăng ký các nút trên thanh tác vụ, dựng cột theo cấu hình hiển thị | Bảng dữ liệu hiển thị |
| 2 | Gõ ký tự vào ô lọc chữ | Ô lọc đang hiển thị | Lọc lại danh sách theo phép so khớp chuỗi con | Bảng cập nhật ngay |
| 3 | Chọn giá trị ô lọc danh sách | Ô lọc đang hiển thị | Lọc lại danh sách theo phép so khớp chính xác | Bảng cập nhật ngay |
| 4 | Nhấp **Làm mới** | Luôn khả dụng | Xóa toàn bộ giá trị lọc | Danh sách trở về trạng thái đầy đủ |
| 5 | Nhấp **Thêm bộ lọc** rồi bỏ tích một mục | Luôn khả dụng | Ẩn ô lọc và xóa giá trị của ô đó | Thanh bộ lọc thu gọn |
| 6 | Nhấp phễu trên tiêu đề cột và chọn giá trị | Cột có hỗ trợ lọc | Áp dụng điều kiện lọc trên tập bản ghi đang hiển thị | Bảng chỉ còn dòng thỏa điều kiện |
| 7 | Rê chuột vào ô biểu thức Cron | Luôn khả dụng | Diễn giải biểu thức sang tiếng Việt | Hiển thị tooltip diễn giải |
| 8 | Nhấp vào một dòng bản ghi | Luôn khả dụng | Mở popup Chi tiết Job của dòng đó | Mở MH-HTVH-036-002 |
| 9 | Đổi trang / đổi số bản ghi mỗi trang | Có nhiều hơn một trang | Hiển thị tập bản ghi tương ứng | Bảng và dòng tổng kết cập nhật |

### Thông báo

| STT | Mã thông báo | Loại | Nội dung | Điều kiện phát sinh |
|---|---|---|---|---|
| 1 | INF_001 | INF | Không có dữ liệu phù hợp với điều kiện tra cứu | Danh sách sau lọc không còn bản ghi nào |
| 2 | ERR_017 | ERR | Không thể kết nối tới hệ thống, vui lòng thử lại sau | Lỗi khi gọi dịch vụ lấy danh sách Job |
| 3 | ERR_018 | ERR | Phiên làm việc đã hết hạn, vui lòng đăng nhập lại | Phiên đăng nhập hết hiệu lực |

### Tiêu chí chấp nhận

| STT | Tiêu chí — «Khi … thì hệ thống phải …» | Mã BR liên quan |
|---|---|---|
| 1 | Khi mở trang, hệ thống phải hiển thị đủ 8 cột dữ liệu cùng cột Thao tác cố định bên phải, phân trang 20 bản ghi/trang. | BR-HTVH-036-013 |
| 2 | Khi nhập đồng thời Mã Job và Trạng thái, hệ thống phải chỉ trả về các Job thỏa **cả hai** điều kiện. | Không áp dụng |
| 3 | Khi rê chuột vào ô biểu thức Cron `0 0 1 * * *`, hệ thống phải hiển thị tooltip "Chạy hằng ngày vào lúc 01:00:00 AM". | BR-HTVH-036-014 |
| 4 | Khi rê chuột vào biểu thức Cron chỉ có 3 trường, hệ thống phải hiển thị tooltip "Biểu thức Cron không đúng định dạng". | BR-HTVH-036-014 |
| 5 | Khi bỏ tích ô lọc *Mã dịch vụ* đang có giá trị, hệ thống phải ẩn ô đó và trả danh sách về trạng thái không lọc theo Mã dịch vụ. | Không áp dụng |
| 6 | Khi lọc tiêu đề cột *Trạng thái* chọn "Hoạt động", hệ thống phải chỉ hiển thị các Job có thẻ trạng thái "Hoạt động". | Không áp dụng |

---

## Tính năng [FEAT-HTVH-036-02] Kích hoạt chạy Job thủ công và theo dõi tiến độ

### Mô tả yêu cầu

Cho phép người dùng có quyền `run` kích hoạt Job chạy ngay ngoài lịch định sẵn, theo hai cách: chạy đơn lẻ từ menu thao tác của một dòng, hoặc chạy hàng loạt bằng cách tích chọn nhiều dòng rồi nhấp nút *Chạy Job (N)* trên thanh tác vụ. Nút này chỉ xuất hiện khi có ít nhất một dòng được chọn.

Cả hai cách đều bắt buộc đi qua popup xác nhận. Khi chọn đúng một Job, popup hiển thị Mã Job và Tên Job của bản ghi đó để người dùng đối chiếu; khi chọn nhiều Job, popup hiển thị tổng số Job sẽ được kích hoạt.

Sau khi kích hoạt từ màn hình hoặc popup Chi tiết Job, hệ thống đưa Job vào hàng đợi thực thi và hiển thị thông báo "Job {mã Job} đã bắt đầu chạy thành công". Trang/popup Chi tiết Job giữ nguyên, không đóng.

Trường hợp ngoại lệ: Job có bật "Khóa chạy song song" và đang có lượt chạy dở dang thì không được kích hoạt thêm lượt mới.

### Luồng xử lý

`[[DIAGRAM: FUNC-HTVH-036_seq-02]]`

![Trình tự — Kích hoạt chạy Job thủ công (đơn lẻ và hàng loạt)](diagrams/FUNC-HTVH-036_seq-02.png)

> *Hình: Trình tự — Kích hoạt chạy Job thủ công (đơn lẻ và hàng loạt).* Nguồn PlantUML: [FUNC-HTVH-036_seq-02.puml](diagrams/FUNC-HTVH-036_seq-02.puml) · bản vector: [FUNC-HTVH-036_seq-02.svg](diagrams/FUNC-HTVH-036_seq-02.svg)

**Luồng chính — chạy hàng loạt**

| Bước | Tác nhân | Hành động | Phản hồi của hệ thống |
|---|---|---|---|
| 1 | Người dùng | Tích chọn N dòng bằng ô đánh dấu trên bảng | Hệ thống ghi nhận danh sách chọn và hiển thị nút **Chạy Job (N)** ở vị trí nút chính trên thanh tác vụ; nút *Thiết lập job mới* lùi về kiểu nút thường (xem BR-HTVH-036-019). |
| 2 | Người dùng | Nhấp **Chạy Job (N)** | Hệ thống mở MH-HTVH-036-006 căn giữa màn hình, tiêu đề "Xác nhận thực hiện Job", không có icon tiêu đề. |
| 3 | Hệ thống | — | Nếu N = 1, hiển thị thêm khối thông tin Mã Job và Tên Job của bản ghi đã chọn; nếu N > 1, hiển thị câu hỏi kèm tổng số Job. |
| 4 | Người dùng | Nhấp **Chạy ngay** | Hệ thống lần lượt đưa từng Job vào hàng đợi thực thi, sinh bản ghi lượt chạy mới với điều kiện kích hoạt là *Thủ công* và người kích hoạt là tài khoản đang đăng nhập. |
| 5 | Hệ thống | — | Đặt trạng thái chạy của các Job là `RUNNING`, xóa trắng danh sách chọn, ẩn nút *Chạy Job (N)* và hiển thị SUC_001. |

**Luồng chính — chạy đơn lẻ**

| Bước | Tác nhân | Hành động | Phản hồi của hệ thống |
|---|---|---|---|
| 1 | Người dùng | Mở menu thao tác của một dòng và chọn **Chạy ngay** | Hệ thống mở popup xác nhận kèm Mã Job và Tên Job của dòng đó. |
| 2 | Người dùng | Nhấp **Chạy ngay** | Hệ thống đưa Job vào hàng đợi thực thi, sinh bản ghi lượt chạy mới và hiển thị SUC_002. |



**Luồng thay thế**

| Mã luồng | Điều kiện rẽ nhánh | Xử lý | Quay về bước |
|---|---|---|---|
| ALT-02-01 | Người dùng nhấp **Hủy** trên popup xác nhận | Đóng popup, không kích hoạt Job nào, **giữ nguyên** danh sách dòng đang chọn | Bước 1 (chạy hàng loạt) |
| ALT-02-02 | Người dùng bỏ chọn hết các dòng | Ẩn nút *Chạy Job (N)* khỏi thanh tác vụ | Bước 1 |
| ALT-02-03 | Người dùng nhấp **Dừng** trên ngăn theo dõi tiến độ | Hệ thống yêu cầu dừng lượt chạy, đặt lượt chạy về trạng thái `CANCELLED` và hiển thị SUC_008 | Bước 4 (theo dõi tiến độ) |
| ALT-02-04 | Người dùng nhấp **Tải** trên ngăn theo dõi tiến độ | Kết xuất toàn bộ dòng nhật ký đang hiển thị thành tệp `{mã Job}-progress.log` và tải về máy | Bước 3 |
| ALT-02-05 | Người dùng nhấp **Sao** trên ngăn theo dõi tiến độ | Sao chép toàn bộ nhật ký vào bộ nhớ tạm của hệ điều hành | Bước 3 |
| ALT-02-06 | Người dùng đóng ngăn theo dõi tiến độ khi lượt chạy chưa xong | Đóng ngăn, lượt chạy vẫn tiếp tục ở phía máy chủ | Danh sách Job |

**Luồng ngoại lệ**

| Mã luồng | Tình huống ngoại lệ | Xử lý của hệ thống | Mã thông báo |
|---|---|---|---|
| EXC-02-01 | Job bật "Khóa chạy song song" và đang có lượt chạy ở trạng thái `RUNNING` | Từ chối kích hoạt Job đó, các Job còn lại trong lô vẫn được kích hoạt bình thường | ERR_016 |
| EXC-02-02 | Vai trò đăng nhập không có quyền `run` | Không hiển thị mục *Chạy ngay* trên menu thao tác; ô chọn dòng bị vô hiệu hóa nếu cũng không có quyền `delete` | Không áp dụng |
| EXC-02-03 | Lỗi khi gửi yêu cầu kích hoạt tới dịch vụ Job | Hiển thị thông báo lỗi, không sinh bản ghi lượt chạy, giữ nguyên trạng thái Job | ERR_019 |
| EXC-02-04 | Lượt chạy vượt quá Thời gian chờ tối đa | Dừng lượt chạy, ghi trạng thái `FAILED`, kích hoạt chính sách thử lại nếu còn lượt thử | ERR_020 |
| EXC-02-05 | Lượt chạy kết thúc với trạng thái `FAILED` | Gửi cảnh báo theo dòng *Khi gặp sự cố / Thất bại* của ma trận thông báo đã cấu hình | Không áp dụng |

### Thiết kế giao diện

Ảnh mockup: `FEAT-HTVH-036-02_xac-nhan-chay-job.png` (MH-HTVH-036-006), `FEAT-HTVH-036-02_tien-do-chay-job.png` (MH-HTVH-036-003)

```
MH-HTVH-036-006 — Popup xác nhận (căn giữa, không icon tiêu đề)
┌────────────────────────────────────────────────┐
│ Xác nhận thực hiện Job                      ✕ │
├────────────────────────────────────────────────┤
│ Bạn có chắc chắn muốn kích hoạt chạy Job đã   │
│ chọn ngay bây giờ không?                       │
│ ┌────────────────────────────────────────────┐ │
│ │ Mã Job:  SYNC_CUSTOMER_DB                  │ │
│ │ Tên Job: Đồng bộ dữ liệu khách hàng        │ │
│ └────────────────────────────────────────────┘ │
│              [  Hủy  ] [ Chạy ngay ]           │  ← căn giữa
└────────────────────────────────────────────────┘
```

### Mô tả các thành phần trên giao diện

| STT | Tên thành phần | Kiểu dữ liệu / Loại control | Bắt buộc / Giá trị mặc định | Giới hạn | Mô tả ràng buộc |
|---|---|---|---|---|---|
| 1 | Ô chọn dòng | Ô đánh dấu | Không / Bỏ chọn | 0..N dòng | Vô hiệu hóa khi vai trò thiếu cả hai quyền `run` và `delete` (BR-HTVH-036-012) |
| 2 | Nút *Chạy Job (N)* | Nút, biểu tượng nút chạy | Xuất hiện tự động | Nhãn kèm số lượng đang chọn | Chỉ hiện khi N ≥ 1. Khi hiện thì chiếm vị trí nút chính của thanh tác vụ (BR-HTVH-036-011, BR-HTVH-036-019) |
| 3 | Mục menu *Chạy ngay* | Mục menu thao tác | Không | — | Chỉ hiện khi vai trò có quyền `run` |
| 4 | Popup xác nhận | Cửa sổ xác nhận | Bắt buộc | Căn giữa màn hình | Không có icon tiêu đề; hai nút căn giữa ở chân, mỗi nút rộng tối thiểu 90px (BR-HTVH-036-010) |
| 5 | Khối thông tin Job trên popup | Khối chữ nền nhạt | Chỉ khi chọn đúng 1 Job | 2 dòng | Dòng 1 Mã Job (phông đơn cách, in đậm), dòng 2 Tên Job (in đậm) |
| 6 | Nút *Chạy ngay* / *Hủy* | Nút | Bắt buộc | Rộng tối thiểu 90px | *Chạy ngay* là nút chính, đặt bên phải |
| 7 | Ngăn theo dõi tiến độ | Ngăn trượt bên phải | Bắt buộc | Rộng 700px | Tiêu đề "Tiến độ: {tên Job}" |
| 8 | Dải thông báo trạng thái | Dải thông báo | Bắt buộc | 2 trạng thái | Đang chạy (thông tin) / Đã hoàn thành (thành công) |
| 9 | Thanh tiến độ | Thanh tiến độ | Bắt buộc / 0% | 0–100% | Trạng thái hoạt hình khi đang chạy, chuyển sang thành công khi đạt 100% |
| 10 | Chỉ số *Thời gian (giây)* | Số | Bắt buộc / 0 | Số nguyên không âm | Đếm từ lúc bắt đầu lượt chạy |
| 11 | Chỉ số *Bản ghi xử lý* | Số | Bắt buộc / 0 | Số nguyên không âm | Lũy kế số bản ghi đã xử lý |
| 12 | Thẻ *Bước hiện tại* | Thẻ | Bắt buộc | 1 giá trị | Tên bước đang thực hiện của lượt chạy. **Mã nguồn hiện chưa cập nhật giá trị này** — thẻ luôn giữ nguyên chuỗi khởi tạo, xem Vấn đề còn mở dòng 14 |
| 13 | Khung nhật ký thời gian thực | Vùng cuộn nền tối | Bắt buộc | Cao 300px | Mỗi dòng gồm dấu thời gian, mức nhật ký và nội dung; tô màu theo mức `ERROR` / `WARN` / `INFO` / `DEBUG`; tự cuộn xuống dòng cuối |
| 14 | Nút *Dừng* / *Tải* / *Sao* | Nút nhỏ trên đầu ngăn | *Dừng* chỉ hiện khi đang chạy | — | *Dừng* mang kiểu cảnh báo; *Tải* kết xuất tệp `.log`; *Sao* chép nhật ký vào bộ nhớ tạm |

### Xử lý sự kiện và thao tác

| STT | Sự kiện / Thao tác | Điều kiện | Xử lý của hệ thống | Kết quả / Mã thông báo |
|---|---|---|---|---|
| 1 | Tích chọn ô đánh dấu | Vai trò có quyền `run` hoặc `delete` | Cập nhật danh sách dòng đang chọn | Hiện nút *Chạy Job (N)* trên thanh tác vụ |
| 2 | Bỏ chọn toàn bộ | Đang có dòng được chọn | Xóa danh sách chọn | Ẩn nút *Chạy Job (N)* |
| 3 | Nhấp *Chạy Job (N)* | N ≥ 1 | Mở popup xác nhận | Hiển thị MH-HTVH-036-006 |
| 4 | Nhấp *Chạy ngay* trên popup | Đã xác nhận | Kích hoạt lần lượt từng Job, sinh bản ghi lượt chạy, xóa danh sách chọn | SUC_001 |
| 5 | Nhấp *Hủy* trên popup | — | Đóng popup, giữ nguyên danh sách chọn | Không có thông báo |
| 6 | Chọn *Chạy ngay* trên menu thao tác | Có quyền `run` | Mở popup xác nhận cho một Job | SUC_002 sau khi xác nhận |
| 7 | Nhấp *Chạy ngay* trên popup Chi tiết Job | Có quyền `run` | Mở popup xác nhận rồi mở ngăn theo dõi tiến độ | SUC_002, INF_002 |
| 8 | Nhấp *Dừng* trên ngăn tiến độ | Lượt chạy đang ở `RUNNING` | Yêu cầu dừng lượt chạy, đặt trạng thái `CANCELLED` | SUC_008 |
| 9 | Nhấp *Tải* trên ngăn tiến độ | Có ít nhất một dòng nhật ký | Kết xuất nhật ký thành tệp văn bản | Tệp `{mã Job}-progress.log` |
| 10 | Nhấp *Sao* trên ngăn tiến độ | Có ít nhất một dòng nhật ký | Sao chép nhật ký vào bộ nhớ tạm | Nhật ký đã nằm trong bộ nhớ tạm |
| 11 | Lượt chạy đạt 100% | — | Kết thúc lượt chạy, ghi trạng thái `SUCCESS` | INF_003 |

### Thông báo

| STT | Mã thông báo | Loại | Nội dung | Điều kiện phát sinh |
|---|---|---|---|---|
| 1 | CONF_001 | CONF | Bạn có chắc chắn muốn kích hoạt chạy Job này ngay bây giờ không? | Kích hoạt một Job đơn lẻ |
| 2 | CONF_002 | CONF | Bạn có chắc chắn muốn kích hoạt chạy {N} Job đã chọn ngay bây giờ không? | Kích hoạt nhiều Job cùng lúc |
| 3 | SUC_001 | SUC | Đã kích hoạt chạy {N} Job thành công | Xác nhận chạy hàng loạt thành công |
| 4 | SUC_002 | SUC | Job {mã Job} đã bắt đầu chạy thành công | Xác nhận chạy đơn lẻ thành công |
| 5 | SUC_008 | SUC | Đã dừng Job thành công | Dừng lượt chạy đang thực thi |
| 6 | INF_002 | INF | Job đang chạy — theo dõi tiến độ và nhật ký bên dưới | Mở ngăn theo dõi tiến độ |
| 7 | INF_003 | INF | Job đã hoàn thành trong {n} giây với {m} bản ghi xử lý | Lượt chạy kết thúc thành công |
| 8 | ERR_016 | ERR | Job đang có lượt chạy dở dang, không thể kích hoạt song song | Job bật khóa chạy song song và đang chạy |
| 9 | ERR_019 | ERR | Không thể kích hoạt Job, vui lòng thử lại sau | Lỗi khi gửi yêu cầu tới dịch vụ Job |
| 10 | ERR_020 | ERR | Lượt chạy đã vượt quá thời gian chờ tối đa và bị dừng | Lượt chạy quá thời gian cho phép |

### Tiêu chí chấp nhận

| STT | Tiêu chí — «Khi … thì hệ thống phải …» | Mã BR liên quan |
|---|---|---|
| 1 | Khi tích chọn ít nhất một dòng, hệ thống phải hiển thị nút *Chạy Job (N)* trên thanh tác vụ với N đúng bằng số dòng đang chọn. | BR-HTVH-036-011 |
| 2 | Khi bỏ chọn hết các dòng, hệ thống phải ẩn nút *Chạy Job (N)* khỏi thanh tác vụ. | BR-HTVH-036-011 |
| 3 | Khi nhấp *Chạy Job (1)*, popup xác nhận phải hiển thị đúng Mã Job và Tên Job của bản ghi đang chọn. | BR-HTVH-036-010 |
| 4 | Khi nhấp *Hủy* trên popup xác nhận, hệ thống phải giữ nguyên các dòng đang chọn và không kích hoạt Job nào. | BR-HTVH-036-010 |
| 5 | Khi xác nhận chạy thành công, hệ thống phải xóa trắng danh sách chọn và hiển thị thông báo kèm đúng số lượng Job đã kích hoạt. | BR-HTVH-036-011 |
| 6 | Khi vai trò đăng nhập không có quyền `run` và không có quyền `delete`, ô chọn dòng phải ở trạng thái vô hiệu hóa. | BR-HTVH-036-012 |
| 7 | Khi kích hoạt Job đang có lượt chạy dở dang và Job bật khóa chạy song song, hệ thống phải từ chối và hiển thị ERR_016. | BR-HTVH-036-009 |

---

## Tính năng [FEAT-HTVH-036-03] Xem chi tiết cấu hình Job

### Mô tả yêu cầu

Hiển thị toàn bộ cấu hình của một Job dưới dạng chỉ đọc trong popup rộng `70vw`, mở ra khi người dùng nhấp vào một dòng bản ghi hoặc chọn *Xem chi tiết* trên menu thao tác. Nội dung gồm bốn khối: Thông tin chung, Lập lịch và xử lý lỗi, Thiết lập cảnh báo sự cố, và Lịch sử thay đổi.

Trên đầu popup có thanh thao tác nhanh gồm thẻ trạng thái hoạt động và nút *Chạy ngay*. Khối Lịch sử thay đổi tuân thủ quy định bảng nhật ký chuẩn 8 cột: đặt trong khối thu gọn mặc định đóng, hiển thị tối đa 20 bản ghi mới nhất, vùng cuộn cao 250px, không phân trang.

Ràng buộc: mọi trường trên popup này đều ở chế độ chỉ đọc; các ô đánh dấu của ma trận cảnh báo bị vô hiệu hóa để phản ánh đúng cấu hình mà không cho phép sửa tại chỗ.

### Luồng xử lý

`[[DIAGRAM: FUNC-HTVH-036_seq-03]]`

![Trình tự — Xem chi tiết cấu hình Job và theo dõi tiến độ chạy](diagrams/FUNC-HTVH-036_seq-03.png)

> *Hình: Trình tự — Xem chi tiết cấu hình Job và theo dõi tiến độ chạy.* Nguồn PlantUML: [FUNC-HTVH-036_seq-03.puml](diagrams/FUNC-HTVH-036_seq-03.puml) · bản vector: [FUNC-HTVH-036_seq-03.svg](diagrams/FUNC-HTVH-036_seq-03.svg)

**Luồng chính**

| Bước | Tác nhân | Hành động | Phản hồi của hệ thống |
|---|---|---|---|
| 1 | Người dùng | Nhấp vào một dòng bản ghi hoặc chọn **Xem chi tiết** trên menu thao tác | Hệ thống lấy cấu hình Job và mở MH-HTVH-036-002 rộng `70vw`, căn giữa, tiêu đề "Chi tiết Job: {tên Job}". |
| 2 | Hệ thống | — | Hiển thị thanh thao tác nhanh (thẻ trạng thái + nút *Chạy ngay*), tiếp theo là ba khối cấu hình chỉ đọc và khối Lịch sử thay đổi ở cuối. |
| 3 | Người dùng | Cuộn nội dung popup | Vùng nội dung cuộn độc lập, chân popup với nút *Đóng* luôn cố định. |
| 4 | Người dùng | Mở khối thu gọn **Lịch sử thay đổi** | Hệ thống hiển thị bảng 8 cột chuẩn với tối đa 20 bản ghi mới nhất xếp trên cùng, vùng cuộn cao 250px. |
| 5 | Người dùng | Rê chuột vào cột *Thời gian* hoặc *Người cập nhật* của bảng lịch sử | Hiển thị tooltip: ngày giờ đầy đủ đến giây, hoặc họ và tên đầy đủ của người cập nhật. |
| 6 | Người dùng | Nhấp **Đóng** | Đóng popup, trở về danh sách với nguyên trạng bộ lọc và trang đang xem. |

**Luồng thay thế**

| Mã luồng | Điều kiện rẽ nhánh | Xử lý | Quay về bước |
|---|---|---|---|
| ALT-03-01 | Người dùng nhấp **Chạy ngay** trên popup chi tiết | Mở popup xác nhận; sau khi xác nhận thì mở ngăn theo dõi tiến độ (FEAT-HTVH-036-02) | Bước 2 |
| ALT-03-02 | Job không có tham số bổ sung | Khối tham số hiển thị "# Không có tham số bổ sung" | Bước 2 |
| ALT-03-03 | Job không có mô tả | Ô Mô tả Job hiển thị "Không có mô tả" | Bước 2 |
| ALT-03-04 | Ô *Mô tả* trong bảng lịch sử dài quá 60 ký tự | Cắt bớt nội dung và hiển thị liên kết **Xem tiếp** để mở rộng | Bước 4 |
| ALT-03-05 | Bản ghi lịch sử có tệp đính kèm | Hiển thị tên tệp dưới dạng liên kết tải về ở cột Mô tả | Bước 4 |
| ALT-03-06 | Job chưa có bản ghi lịch sử thay đổi nào | Bảng lịch sử hiển thị trạng thái rỗng | Bước 4 |

**Luồng ngoại lệ**

| Mã luồng | Tình huống ngoại lệ | Xử lý của hệ thống | Mã thông báo |
|---|---|---|---|
| EXC-03-01 | Job đã bị xóa bởi người dùng khác trong lúc đang mở danh sách | Đóng popup và làm mới danh sách | ERR_015 |
| EXC-03-02 | Lỗi khi lấy nhật ký thay đổi | Khối Lịch sử thay đổi hiển thị trạng thái lỗi, các khối còn lại vẫn hiển thị bình thường | ERR_017 |

### Thiết kế giao diện

Ảnh mockup: `FEAT-HTVH-036-03_chi-tiet-job.png` (MH-HTVH-036-002)

```
┌─ Chi tiết Job: Đồng bộ dữ liệu khách hàng ──────────────── 70vw ── ✕ ─┐
│                            [ĐANG HOẠT ĐỘNG]  [▶ Chạy ngay]           │
├──────────────────────────────────────────────────────────────────────┤
│ ◇ THÔNG TIN CHUNG                                                    │
│   Mã Job │ Tên Job │ Loại Job │ Mã dịch vụ                           │
│   Mô tả Job                                                          │
│   Tham số bổ sung (YAML/JSON)  ← khối mã, cuộn tối đa 180px          │
├──────────────────────────────────────────────────────────────────────┤
│ ◇ LẬP LỊCH VÀ XỬ LÝ LỖI                                              │
│   ĐK kích hoạt │ Job cần hoàn thành trước │ Chờ ban đầu (giây) │ Chờ tối đa (giây) │
│   Biểu thức Cron │ Số lần thử lại │ Chạy song song │ Xử lý khi bỏ lỡ │
│     💡 Diễn giải: Chạy hằng ngày vào lúc 01:00:00 AM                 │
├──────────────────────────────────────────────────────────────────────┤
│ ◇ THIẾT LẬP CẢNH BÁO SỰ CỐ                                           │
│   Email nhận cảnh báo chung: [thẻ] [thẻ]                             │
│   Bảng ma trận 4 sự kiện × (SMS │ Push │ Email │ Người nhận riêng)   │
├──────────────────────────────────────────────────────────────────────┤
│ ▸ Lịch sử thay đổi  (khối thu gọn, mặc định đóng)                    │
├──────────────────────────────────────────────────────────────────────┤
│                            [ Đóng ]                    ← căn giữa    │
└──────────────────────────────────────────────────────────────────────┘
```

### Mô tả các thành phần trên giao diện

| STT | Tên thành phần | Kiểu dữ liệu / Loại control | Bắt buộc / Giá trị mặc định | Giới hạn | Mô tả ràng buộc |
|---|---|---|---|---|---|
| 1 | Popup Chi tiết Job | Cửa sổ nổi | Bắt buộc | Rộng `70vw`, căn giữa | Vùng nội dung cuộn tối đa `80vh − 110px`; hủy nội dung khi đóng |
| 2 | Thẻ trạng thái hoạt động | Thẻ | Bắt buộc | 2 giá trị | `ACTIVE` → "ĐANG HOẠT ĐỘNG" (xanh); `INACTIVE` → "TẠM DỪNG" (xám) |
| 3 | Nút *Chạy ngay* | Nút chính, biểu tượng nút chạy | Bắt buộc | — | Kích hoạt luồng xác nhận của FEAT-HTVH-036-02 |
| 4 | **Mã Job** | Chữ dạng mã, chỉ đọc | Bắt buộc | Tối đa 20 ký tự | Phông đơn cách, in đậm |
| 5 | **Tên Job** | Chữ in đậm, chỉ đọc | Bắt buộc | Tối đa 100 ký tự | — |
| 6 | **Loại Job** | Chữ, chỉ đọc | Bắt buộc | 8 giá trị | Hiển thị dạng "Nhãn tiếng Việt (MÃ)" |
| 7 | **Mã dịch vụ** | Chữ dạng mã, chỉ đọc | Bắt buộc | Tối đa 50 ký tự | Trống thì hiển thị `SVC_CIC_CORE_SYNC` |
| 8 | **Mô tả Job** | Chữ, chỉ đọc | Không | Tối đa 1000 ký tự | Trống thì hiển thị "Không có mô tả" |
| 9 | **Tham số bổ sung** | Khối mã cuộn được, chỉ đọc | Không | Tối đa 1500 ký tự, cao tối đa 180px | Giữ nguyên xuống dòng và thụt đầu dòng của YAML/JSON |
| 10 | **Điều kiện kích hoạt** | Chữ, chỉ đọc | Bắt buộc | 3 giá trị | Bộ lập lịch (Scheduler) / Theo sự kiện (Event-driven) / Thủ công (Manual) |
| 11 | **Chờ tối đa (giây)** | Chữ, chỉ đọc | Bắt buộc / 300 | 1–86400 | — |
| 12 | **Xử lý khi bỏ lỡ lượt chạy** | Chữ, chỉ đọc | Bắt buộc / FIRE_NOW | 2 giá trị | "Chạy bù ngay khi đủ điều kiện" / "Bỏ qua lượt lỗi, chờ lịch tiếp theo" |
| 13 | **Chạy song song** | Chữ, chỉ đọc | Bắt buộc | 2 giá trị | "Khóa chạy song song" / "Cho phép chạy song song" |
| 14 | **Biểu thức Cron** | Chữ dạng mã có nền, chỉ đọc | Bắt buộc | Cú pháp Cron 5 hoặc 6 trường | Kèm dòng diễn giải tiếng Việt ngay bên dưới (BR-HTVH-036-014) |
| 15 | **Số lần thử lại tối đa** | Chữ, chỉ đọc | Bắt buộc / 3 | 0–10 | Hiển thị kèm đơn vị "lần" |
| 16 | **Chờ ban đầu (giây)** | Chữ, chỉ đọc | Bắt buộc / 60 | 1–86400 | — |
| 17 | **Job cần hoàn thành trước** | Danh sách thẻ, chỉ đọc | Không | Chọn nhiều Job | Tách bằng dấu phẩy, mỗi Job một thẻ |
| 18 | **Email nhận cảnh báo chung** | Danh sách thẻ, chỉ đọc | Không | Nhiều địa chỉ | Tách bằng dấu phẩy hoặc chấm phẩy, mỗi địa chỉ một thẻ |
| 19 | **Bảng ma trận cảnh báo** | Bảng, chỉ đọc | Bắt buộc | 4 dòng × 5 cột | Bốn sự kiện: Khi bắt đầu chạy / Khi hoàn tất thành công / Khi gặp sự cố / Khi thử lại. Ba cột kênh dùng ô đánh dấu bị vô hiệu hóa; cột cuối liệt kê người nhận riêng dạng thẻ, trống thì ghi "Chưa cấu hình" |
| 20 | **Khối Lịch sử thay đổi** | Khối thu gọn chứa bảng | Bắt buộc / Đóng | 20 bản ghi, cuộn cao 250px | Đủ 8 cột chuẩn theo BR-HTVH-036-015, không phân trang |
| 21 | Nút *Đóng* | Nút | Bắt buộc | Rộng tối thiểu 100px | Đặt ở chân popup, căn giữa |

**Chi tiết 8 cột chuẩn của Bảng Lịch sử thay đổi**

| STT | Cột | Bề rộng | Quy tắc hiển thị |
|---|---|---|---|
| 1 | STT | 50px | Căn giữa |
| 2 | Thời gian | 170px | Hiển thị `dd/mm/yyyy`, tooltip hiện `dd/mm/yyyy hh:mm:ss` |
| 3 | Người cập nhật | 160px | Hiển thị tên đăng nhập, tooltip hiện họ và tên đầy đủ |
| 4 | Hành động | 140px | Tên thao tác đã tác động tới dữ liệu |
| 5 | Giá trị cũ | 220px | Giá trị trước khi thay đổi |
| 6 | Giá trị mới | 220px | Giá trị sau khi thay đổi thành công |
| 7 | Địa chỉ IP | 130px | Địa chỉ thiết bị thực hiện thao tác |
| 8 | Mô tả | 240px | Lý do hoặc ghi chú; dài quá 60 ký tự thì cắt bớt kèm liên kết *Xem tiếp*; tệp đính kèm hiển thị dạng liên kết tải về |

### Xử lý sự kiện và thao tác

| STT | Sự kiện / Thao tác | Điều kiện | Xử lý của hệ thống | Kết quả / Mã thông báo |
|---|---|---|---|---|
| 1 | Nhấp vào dòng bản ghi | Luôn khả dụng | Lấy cấu hình Job và mở popup chi tiết | Mở MH-HTVH-036-002 |
| 2 | Chọn *Xem chi tiết* trên menu thao tác | Luôn khả dụng | Chặn sự kiện lan lên dòng, mở popup chi tiết | Mở MH-HTVH-036-002 |
| 3 | Mở khối *Lịch sử thay đổi* | Job có bản ghi lịch sử | Lấy 20 bản ghi mới nhất và dựng bảng 8 cột | Bảng lịch sử hiển thị |
| 4 | Rê chuột vào ô *Thời gian* | — | Hiển thị tooltip ngày giờ đầy đủ đến giây | Tooltip hiển thị |
| 5 | Rê chuột vào ô *Người cập nhật* | — | Hiển thị tooltip họ và tên đầy đủ | Tooltip hiển thị |
| 6 | Nhấp *Xem tiếp* trong ô Mô tả | Nội dung dài quá 60 ký tự | Mở rộng hiển thị toàn bộ nội dung | Nội dung đầy đủ hiển thị |
| 7 | Nhấp liên kết tệp đính kèm | Bản ghi có tệp đính kèm | Tải tệp về máy người dùng | Tệp được tải về |
| 8 | Nhấp *Chạy ngay* | Có quyền `run` | Chuyển sang luồng xác nhận của FEAT-HTVH-036-02 | Mở MH-HTVH-036-006 |
| 9 | Nhấp *Đóng* | — | Đóng popup và hủy nội dung đã dựng | Trở về danh sách |

### Thông báo

| STT | Mã thông báo | Loại | Nội dung | Điều kiện phát sinh |
|---|---|---|---|---|
| 1 | ERR_015 | ERR | Job không tồn tại | Job đã bị xóa trước khi mở chi tiết |
| 2 | ERR_017 | ERR | Không thể kết nối tới hệ thống, vui lòng thử lại sau | Lỗi khi lấy dữ liệu chi tiết hoặc nhật ký thay đổi |

### Tiêu chí chấp nhận

| STT | Tiêu chí — «Khi … thì hệ thống phải …» | Mã BR liên quan |
|---|---|---|
| 1 | Khi mở popup chi tiết, hệ thống phải hiển thị đủ bốn khối theo đúng thứ tự: Thông tin chung, Lập lịch và xử lý lỗi, Thiết lập cảnh báo sự cố, Lịch sử thay đổi. | Không áp dụng |
| 2 | Khi mở popup chi tiết, khối Lịch sử thay đổi phải ở trạng thái thu gọn. | BR-HTVH-036-015 |
| 3 | Khi mở khối Lịch sử thay đổi, bảng phải hiển thị đủ 8 cột chuẩn, không phân trang, tối đa 20 bản ghi xếp mới nhất trên cùng. | BR-HTVH-036-015 |
| 4 | Khi Job có biểu thức Cron, popup phải hiển thị dòng diễn giải tiếng Việt ngay bên dưới ô biểu thức. | BR-HTVH-036-014 |
| 5 | Khi Job không có tham số bổ sung, khối tham số phải hiển thị "# Không có tham số bổ sung" thay vì để trống. | Không áp dụng |
| 6 | Mọi ô đánh dấu trên bảng ma trận cảnh báo phải ở trạng thái vô hiệu hóa, không cho phép sửa tại popup chi tiết. | Không áp dụng |

---

## Tính năng [FEAT-HTVH-036-04] Tra cứu lịch sử chạy Job

### Mô tả yêu cầu

Cho phép người dùng tra cứu các lượt thực thi đã diễn ra của một Job qua popup rộng `70vw`, mở từ mục *Lịch sử chạy Job* trên menu thao tác. Bảng kết quả gồm 8 cột, phân trang 10 bản ghi mỗi trang, có thanh lọc theo trạng thái lượt chạy và khoảng thời gian.

Cột *Bản ghi xử lý* hiển thị đồng thời số bản ghi thành công (dấu ✓, màu xanh) và số bản ghi lỗi (dấu ✗, màu đỏ, chỉ hiện khi lớn hơn 0). Cột *Số lần thử lại* hiển thị dạng số nguyên thuần túy, căn giữa, không dùng thẻ màu. Cột *Thời lượng* quy đổi từ mili giây sang định dạng `{phút}m {giây}s` khi vượt quá 60 giây, ngược lại hiển thị `{giây}s`; lượt chạy chưa kết thúc hiển thị dấu gạch ngang.

### Luồng xử lý

`[[DIAGRAM: FUNC-HTVH-036_seq-04]]`

![Trình tự — Tra cứu lịch sử chạy Job](diagrams/FUNC-HTVH-036_seq-04.png)

> *Hình: Trình tự — Tra cứu lịch sử chạy Job.* Nguồn PlantUML: [FUNC-HTVH-036_seq-04.puml](diagrams/FUNC-HTVH-036_seq-04.puml) · bản vector: [FUNC-HTVH-036_seq-04.svg](diagrams/FUNC-HTVH-036_seq-04.svg)

**Luồng chính**

| Bước | Tác nhân | Hành động | Phản hồi của hệ thống |
|---|---|---|---|
| 1 | Người dùng | Mở menu thao tác của một dòng và chọn **Lịch sử chạy Job** | Hệ thống mở MH-HTVH-036-004 rộng `70vw`, căn giữa, tiêu đề "Lịch sử chạy Job: {tên Job} ({mã Job})". |
| 2 | Hệ thống | — | Lấy danh sách lượt chạy của Job, sắp xếp giảm dần theo thời gian bắt đầu và hiển thị bảng 8 cột phân trang 10 bản ghi/trang. |
| 3 | Người dùng | Chọn giá trị tại ô lọc **Trạng thái chạy** | Hệ thống lọc lại danh sách lượt chạy theo trạng thái đã chọn. |
| 4 | Người dùng | Chọn khoảng ngày tại ô **Từ ngày – Đến ngày** | Hệ thống lọc các lượt chạy có thời gian bắt đầu nằm trong khoảng đã chọn. |
| 5 | Người dùng | Chuyển trang | Hệ thống hiển thị tập lượt chạy của trang tương ứng. |
| 6 | Người dùng | Nhấp **Đóng** | Đóng popup, trở về danh sách Job. |

**Luồng thay thế**

| Mã luồng | Điều kiện rẽ nhánh | Xử lý | Quay về bước |
|---|---|---|---|
| ALT-04-01 | Người dùng nhấp **Làm mới** trên thanh lọc | Xóa điều kiện lọc trạng thái và khoảng thời gian, trở về toàn bộ danh sách lượt chạy | Bước 2 |
| ALT-04-02 | Job chưa có lượt chạy nào | Hiển thị bảng rỗng kèm thông báo không có dữ liệu | Bước 2 |
| ALT-04-03 | Lượt chạy đang ở trạng thái `RUNNING` | Cột *Thời gian kết thúc* và *Thời lượng* hiển thị dấu gạch ngang | Bước 2 |
| ALT-04-04 | Lượt chạy có số bản ghi lỗi bằng 0 | Cột *Bản ghi xử lý* chỉ hiển thị phần thành công, không hiển thị phần lỗi | Bước 2 |

**Luồng ngoại lệ**

| Mã luồng | Tình huống ngoại lệ | Xử lý của hệ thống | Mã thông báo |
|---|---|---|---|
| EXC-04-01 | Lỗi khi lấy danh sách lượt chạy | Hiển thị trạng thái lỗi trong popup, giữ nguyên thanh lọc | ERR_017 |
| EXC-04-02 | Người dùng chọn khoảng thời gian có ngày bắt đầu sau ngày kết thúc | Bộ chọn ngày tự chặn, không cho phép chọn giá trị không hợp lệ | Không áp dụng |

### Thiết kế giao diện

Ảnh mockup: `FEAT-HTVH-036-04_lich-su-chay-job.png` (MH-HTVH-036-004)

```
┌─ Lịch sử chạy Job: Đồng bộ dữ liệu khách hàng (SYNC_CUSTOMER_DB) ─ 70vw ─ ✕ ┐
├─────────────────────────────────────────────────────────────────────────────┤
│ [Trạng thái chạy ▾]  [Từ ngày – Đến ngày]     [Tìm kiếm] [Làm mới]         │
├─────────────────────────────────────────────────────────────────────────────┤
│ STT│Mã lượt chạy│TG bắt đầu│TG kết thúc│Thời lượng│Bản ghi xử lý│Thử lại│TT │
│  1 │ run-001    │ …        │ …         │ 20m 20s  │ ✓5.000      │   0   │ ● │
│  2 │ run-003    │ …        │ …         │ 13m 45s  │ ✓3.200 ✗45  │   3   │ ● │
├─────────────────────────────────────────────────────────────────────────────┤
│ Hiển thị 1-10 trong tổng {N} bản ghi              ‹ 1 2 › [Đến trang __]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                 [ Đóng ]                    ← căn giữa      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mô tả các thành phần trên giao diện

| STT | Tên thành phần | Kiểu dữ liệu / Loại control | Bắt buộc / Giá trị mặc định | Giới hạn | Mô tả ràng buộc |
|---|---|---|---|---|---|
| 1 | Popup Lịch sử chạy Job | Cửa sổ nổi | Bắt buộc | Rộng `70vw`, căn giữa | Tiêu đề kèm Tên Job và Mã Job; hủy nội dung khi đóng |
| 2 | Ô lọc *Trạng thái chạy* | Danh sách chọn một, có nút xóa nhanh | Không / Rỗng | 3 tùy chọn | `SUCCESS` — Thành công; `FAILED` — Lỗi; `RUNNING` — Đang chạy |
| 3 | Ô lọc *Từ ngày – Đến ngày* | Bộ chọn khoảng ngày | Không / Rỗng | Ngày bắt đầu ≤ ngày kết thúc | Lọc theo thời gian bắt đầu của lượt chạy |
| 4 | Cột **STT** | Số thứ tự dòng | Bắt buộc | Rộng 50px, căn giữa | Đánh số theo trang đang hiển thị |
| 5 | Cột **Mã lượt chạy** | Chữ dạng mã | Bắt buộc | Rộng 120px | Định danh duy nhất của lượt thực thi |
| 6 | Cột **Thời gian bắt đầu** | Chữ dạng mã | Bắt buộc | Rộng 160px | Định dạng `yyyy-mm-dd hh:mm:ss` |
| 7 | Cột **Thời gian kết thúc** | Chữ dạng mã | Không | Rộng 160px | Trống khi lượt chạy chưa kết thúc |
| 8 | Cột **Thời lượng** | Chữ | Không | Rộng 110px | Dưới 60 giây hiển thị `{n}s`, từ 60 giây trở lên hiển thị `{m}m {s}s`; chưa kết thúc hiển thị `—` |
| 9 | Cột **Bản ghi xử lý** | Chữ hai phần | Bắt buộc / 0 | Rộng 150px | `✓ {số thành công}` màu xanh; `✗ {số lỗi}` màu đỏ chỉ hiện khi lớn hơn 0; số có dấu phân cách hàng nghìn |
| 10 | Cột **Số lần thử lại** | Số | Bắt buộc / 0 | Rộng 120px, căn giữa | Số nguyên thuần túy, không dùng thẻ màu (BR-HTVH-036-018) |
| 11 | Cột **Trạng thái** | Thẻ trạng thái dùng chung | Bắt buộc | Rộng 120px | Theo bảng trạng thái `LUOTCHAY` |
| 12 | Thanh phân trang | Bộ phân trang dùng chung | Bắt buộc / 10 bản ghi/trang | 10 / 20 / 50 / 100 | Kèm dòng tổng kết số bản ghi |
| 13 | Nút *Đóng* | Nút | Bắt buộc | Rộng tối thiểu 100px | Đặt ở chân popup, căn giữa |

### Xử lý sự kiện và thao tác

| STT | Sự kiện / Thao tác | Điều kiện | Xử lý của hệ thống | Kết quả / Mã thông báo |
|---|---|---|---|---|
| 1 | Chọn *Lịch sử chạy Job* trên menu thao tác | Luôn khả dụng | Chặn sự kiện lan lên dòng, lấy danh sách lượt chạy của Job | Mở MH-HTVH-036-004 |
| 2 | Chọn *Trạng thái chạy* | Popup đang mở | Lọc lại danh sách theo trạng thái | Bảng cập nhật ngay |
| 3 | Chọn khoảng ngày | Popup đang mở | Lọc lại danh sách theo thời gian bắt đầu | Bảng cập nhật ngay |
| 4 | Nhấp *Làm mới* | Popup đang mở | Xóa toàn bộ điều kiện lọc trong popup | Danh sách trở về đầy đủ |
| 5 | Đổi trang | Có nhiều hơn một trang | Hiển thị tập lượt chạy tương ứng | Bảng cập nhật |
| 6 | Nhấp *Đóng* | — | Đóng popup và hủy nội dung đã dựng | Trở về danh sách Job |

### Thông báo

| STT | Mã thông báo | Loại | Nội dung | Điều kiện phát sinh |
|---|---|---|---|---|
| 1 | INF_001 | INF | Không có dữ liệu phù hợp với điều kiện tra cứu | Không có lượt chạy nào thỏa điều kiện lọc |
| 2 | ERR_017 | ERR | Không thể kết nối tới hệ thống, vui lòng thử lại sau | Lỗi khi lấy danh sách lượt chạy |

### Tiêu chí chấp nhận

| STT | Tiêu chí — «Khi … thì hệ thống phải …» | Mã BR liên quan |
|---|---|---|
| 1 | Khi mở popup lịch sử, hệ thống phải hiển thị đủ 8 cột và phân trang 10 bản ghi mỗi trang. | Không áp dụng |
| 2 | Khi hiển thị cột *Số lần thử lại*, hệ thống phải in số nguyên thuần túy căn giữa, không dùng thẻ màu hay nhãn. | BR-HTVH-036-018 |
| 3 | Khi lượt chạy có thời lượng 1.220.000 mili giây, cột *Thời lượng* phải hiển thị "20m 20s". | Không áp dụng |
| 4 | Khi lượt chạy có số bản ghi lỗi bằng 0, cột *Bản ghi xử lý* phải chỉ hiển thị phần thành công. | Không áp dụng |
| 5 | Khi chọn lọc trạng thái "Lỗi (FAILED)", bảng phải chỉ còn các lượt chạy có trạng thái tương ứng. | Không áp dụng |
| 6 | Khi Job chưa có lượt chạy nào, bảng phải hiển thị trạng thái rỗng thay vì dữ liệu của Job khác. | Không áp dụng |

---

## Tính năng [FEAT-HTVH-036-05] Thiết lập và chỉnh sửa cấu hình Job

### Mô tả yêu cầu

Cho phép người dùng có quyền `create` hoặc `edit` khai báo Job mới hoặc điều chỉnh cấu hình của Job đã có, trên màn hình biểu mẫu toàn trang chia thành ba khối: Thông tin chung, Lập lịch và xử lý lỗi, Thiết lập cảnh báo sự cố.

Ở chế độ cập nhật, ô Mã Job bị khóa vì đây là định danh bất biến của Job. Màn hình cũng hỗ trợ nhân bản: khi mở kèm tham số `cloneId`, hệ thống nạp toàn bộ cấu hình của Job nguồn nhưng điền sẵn Mã Job là `{mã gốc}_COPY` và Tên Job là `{tên gốc} (Bản sao)`.

Ô Điều kiện kích hoạt điều khiển ô kế bên: chọn *Theo sự kiện* thì ô Biểu thức Cron được thay bằng ô Tên sự kiện kích hoạt. Ô Biểu thức Cron luôn kèm dòng diễn giải tiếng Việt cập nhật theo từng ký tự người dùng gõ vào.

Ràng buộc: toàn bộ kiểm tra dữ liệu thực hiện trước khi ghi; nếu có ô không hợp lệ, hệ thống giữ người dùng ở lại màn hình và đánh dấu từng ô lỗi. Ghi thành công thì đồng thời sinh bản ghi nhật ký thay đổi và đăng ký lại lịch chạy với bộ lập lịch.

### Luồng xử lý

`[[DIAGRAM: FUNC-HTVH-036_seq-05]]`

![Trình tự — Thiết lập mới và cập nhật cấu hình Job](diagrams/FUNC-HTVH-036_seq-05.png)

> *Hình: Trình tự — Thiết lập mới và cập nhật cấu hình Job.* Nguồn PlantUML: [FUNC-HTVH-036_seq-05.puml](diagrams/FUNC-HTVH-036_seq-05.puml) · bản vector: [FUNC-HTVH-036_seq-05.svg](diagrams/FUNC-HTVH-036_seq-05.svg)

**Luồng chính**

| Bước | Tác nhân | Hành động | Phản hồi của hệ thống |
|---|---|---|---|
| 1 | Người dùng | Nhấp **Thiết lập job mới** trên thanh tác vụ, hoặc chọn **Chỉnh sửa** trên menu thao tác | Hệ thống chuyển tới MH-HTVH-036-005 tại `/create` hoặc `/{id}/edit`, đặt tiêu đề trang và đường dẫn phân cấp tương ứng, hiển thị biểu tượng quay lại trước tiêu đề. |
| 2 | Hệ thống | — | Ở chế độ tạo mới: nạp giá trị mặc định. Ở chế độ cập nhật: nạp cấu hình hiện hành của Job và khóa ô Mã Job. |
| 3 | Người dùng | Nhập khối **Thông tin chung** | Ô Mã Job tự chuyển ký tự sang chữ in hoa và loại bỏ ký tự ngoài tập cho phép ngay khi gõ. Ô Mô tả và Tham số bổ sung hiển thị bộ đếm ký tự. |
| 4 | Người dùng | Chọn **Điều kiện kích hoạt** | Nếu chọn *Theo sự kiện*, hệ thống thay ô Biểu thức Cron bằng ô Tên sự kiện kích hoạt; nếu chọn *Bộ lập lịch* hoặc *Thủ công*, hệ thống hiển thị ô Biểu thức Cron kèm dòng diễn giải tiếng Việt. |
| 5 | Người dùng | Nhập khối **Lập lịch và xử lý lỗi** | Hệ thống chặn giá trị nằm ngoài khoảng cho phép ngay tại ô nhập số. |
| 6 | Người dùng | Nhập khối **Thiết lập cảnh báo sự cố** | Ô Email nhận cảnh báo chung nhận nhiều địa chỉ, tự tách khi gõ dấu chấm phẩy hoặc dấu phẩy. Bảng ma trận cho phép tích chọn kênh và chọn người nhận riêng cho từng sự kiện. |
| 7 | Người dùng | Nhấp **Lưu** | Hệ thống kiểm tra toàn bộ ràng buộc BR-HTVH-036-001 đến BR-HTVH-036-008. |
| 8 | Hệ thống | — | Dữ liệu hợp lệ: ghi cấu hình Job, sinh bản ghi nhật ký thay đổi (giá trị cũ, giá trị mới, địa chỉ IP), đăng ký lại lịch chạy, hiển thị SUC_005 hoặc SUC_006 rồi chuyển về danh sách. |

**Luồng thay thế**

| Mã luồng | Điều kiện rẽ nhánh | Xử lý | Quay về bước |
|---|---|---|---|
| ALT-05-01 | Người dùng nhấp **Hủy** hoặc biểu tượng quay lại | Trở về danh sách Quản lý Job, không ghi bất kỳ thay đổi nào | Danh sách Job |
| ALT-05-02 | Mở màn hình kèm tham số `cloneId` | Nạp cấu hình Job nguồn, điền Mã Job `{mã gốc}_COPY` và Tên Job `{tên gốc} (Bản sao)`, để ô Mã Job mở cho phép sửa | Bước 3 |
| ALT-05-03 | Điều kiện kích hoạt là *Theo sự kiện* | Ẩn ô Biểu thức Cron, hiện ô Tên sự kiện kích hoạt là bắt buộc | Bước 5 |
| ALT-05-04 | Người dùng gõ biểu thức Cron mới | Cập nhật dòng diễn giải tiếng Việt ngay dưới ô nhập theo từng ký tự | Bước 5 |
| ALT-05-05 | Người dùng gõ ký tự thường hoặc ký tự đặc biệt vào ô Mã Job | Tự chuyển sang chữ in hoa và loại bỏ ký tự ngoài tập `A–Z 0–9 - _` | Bước 3 |

**Luồng ngoại lệ**

| Mã luồng | Tình huống ngoại lệ | Xử lý của hệ thống | Mã thông báo |
|---|---|---|---|
| EXC-05-01 | Có ô bắt buộc bỏ trống hoặc giá trị sai định dạng | Giữ người dùng ở lại màn hình, đánh dấu từng ô lỗi kèm thông điệp cụ thể, không ghi dữ liệu | ERR_014 và các mã ERR_001–ERR_013 tương ứng |
| EXC-05-02 | Mở chế độ cập nhật với định danh Job không tồn tại | Hiển thị thông báo lỗi và tự chuyển về danh sách Quản lý Job | ERR_015 |
| EXC-05-03 | Mã Job nhập vào đã tồn tại trên hệ thống | Đánh dấu ô Mã Job là lỗi, không ghi dữ liệu | ERR_021 |
| EXC-05-04 | Lỗi khi ghi cấu hình xuống cơ sở dữ liệu | Giữ nguyên dữ liệu người dùng đã nhập, hiển thị thông báo lỗi | ERR_022 |
| EXC-05-05 | Ghi cấu hình thành công nhưng đăng ký lịch với bộ lập lịch thất bại | Ghi nhận cảnh báo, thông báo cho người dùng rằng cấu hình đã lưu nhưng lịch chạy chưa được cập nhật | WAR_001 |

### Thiết kế giao diện

Ảnh mockup: `FEAT-HTVH-036-05_form-job.png` (MH-HTVH-036-005)

```
← Thiết lập Job mới          Hỗ trợ vận hành > Quản lý Job > Thiết lập Job mới
┌──────────────────────────────────────────────────────────────────────────┐
│ ◇ THÔNG TIN CHUNG                                                        │
│ [Mã Job*      ] [Tên Job*      ] [Loại Job* ▾  ] [Mã dịch vụ*         ]  │
│ [Mô tả Job                                              0/1000        ]  │
│ [Tham số bổ sung (YAML/JSON)                            0/1500        ]  │
├──────────────────────────────────────────────────────────────────────────┤
│ ◇ LẬP LỊCH VÀ XỬ LÝ LỖI                                                  │
│ [ĐK kích hoạt*▾] [Job hoàn thành trước ▾] [Chờ ban đầu  ] [Chờ tối đa*  ] │
│ [Biểu thức Cron*] [Số lần thử lại] [Chạy song song ▾] [Xử lý khi bỏ lỡ ▾] │
│  💡 Diễn giải: Chạy hằng ngày vào lúc 01:00:00 AM                        │
├──────────────────────────────────────────────────────────────────────────┤
│ ◇ THIẾT LẬP CẢNH BÁO SỰ CỐ                                               │
│ [Email nhận cảnh báo chung (thẻ, tách bằng ; hoặc ,)                   ]  │
│ ┌──────────────────────┬─────┬──────────┬───────┬──────────────────────┐ │
│ │ Sự kiện kích hoạt    │ SMS │Push (Web)│ Email │ Người / Email riêng  │ │
│ │ Khi bắt đầu chạy Job │ ☐   │ ☐        │ ☑     │ [chọn…]              │ │
│ │ Khi hoàn tất thành…  │ ☐   │ ☐        │ ☑     │ [chọn…]              │ │
│ │ Khi gặp sự cố / Thất…│ ☑   │ ☑        │ ☑     │ [alert_group@…]      │ │
│ │ Khi thử lại (Retry)  │ ☐   │ ☑        │ ☐     │ [chọn…]              │ │
│ └──────────────────────┴─────┴──────────┴───────┴──────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────┤
│                        [ Lưu ]  [ Hủy ]              ← căn giữa          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Mô tả các thành phần trên giao diện

| STT | Tên thành phần | Kiểu dữ liệu / Loại control | Bắt buộc / Giá trị mặc định | Giới hạn | Mô tả ràng buộc |
|---|---|---|---|---|---|
| 1 | Biểu tượng quay lại | Nút biểu tượng trên thanh tác vụ | Bắt buộc | Đặt trước tiêu đề trang | Trở về danh sách Quản lý Job, không ghi dữ liệu |
| 2 | **Mã Job** | Ô nhập chữ | Bắt buộc / `JOB_DATA_PROCESS` khi tạo mới | Tối đa 20 ký tự | Chỉ nhận `A–Z`, `0–9`, `-`, `_`; tự chuyển in hoa và lọc ký tự; bị khóa ở chế độ cập nhật (BR-HTVH-036-001, BR-HTVH-036-002) |
| 3 | **Tên Job** | Ô nhập chữ | Bắt buộc | Tối đa 100 ký tự | Tên nghiệp vụ mô tả Job (BR-HTVH-036-003) |
| 4 | **Loại Job** | Danh sách chọn một | Bắt buộc / `DATA_SYNC` | 8 tùy chọn | `DATA_SYNC`, `REPORT`, `CLEANUP`, `VALIDATION`, `BATCH`, `SPRING_BEAN`, `REST_API`, `SQL_SCRIPT` (BR-HTVH-036-003) |
| 5 | **Mã dịch vụ** | Ô nhập chữ | Bắt buộc / `SVC_CIC_CORE_SYNC` | Tối đa 50 ký tự | Định danh dịch vụ thực thi Job, phông đơn cách (BR-HTVH-036-003) |
| 6 | **Mô tả Job** | Ô nhập nhiều dòng, 3 dòng | Không | Tối đa 1000 ký tự | Hiển thị bộ đếm ký tự (BR-HTVH-036-004) |
| 7 | **Tham số bổ sung** | Ô nhập nhiều dòng, 4 dòng, phông đơn cách | Không | Tối đa 1500 ký tự | Nội dung dạng YAML hoặc JSON, hiển thị bộ đếm ký tự (BR-HTVH-036-004) |
| 8 | **Điều kiện kích hoạt** | Danh sách chọn một | Bắt buộc / `SCHEDULER` | 3 tùy chọn | Bộ lập lịch (Scheduler) / Theo sự kiện (Event-driven) / Thủ công (Manual). Điều khiển hiển thị ô Biểu thức Cron (BR-HTVH-036-005) |
| 9 | **Chờ tối đa (giây)** | Ô nhập số | Bắt buộc / 300 | 1–86400, số nguyên | Quá thời gian này thì lượt chạy bị dừng và ghi trạng thái lỗi (BR-HTVH-036-006) |
| 10 | **Xử lý khi bỏ lỡ lượt chạy** | Danh sách chọn một | Không / `FIRE_NOW` | 2 tùy chọn | "Chạy bù ngay khi đủ điều kiện" / "Bỏ qua lượt lỗi, chờ lịch tiếp theo" |
| 11 | **Chạy song song** | Danh sách chọn một | Không / "Khóa chạy song song" | 2 tùy chọn | "Khóa chạy song song" chặn lượt chạy mới khi Job đang chạy (BR-HTVH-036-009) |
| 12 | **Biểu thức Cron** | Ô nhập chữ, phông đơn cách in đậm | Bắt buộc khi ĐK kích hoạt ≠ EVENT / `0 0 1 * * *` | Cú pháp Cron 5 hoặc 6 trường | Kèm dòng diễn giải tiếng Việt cập nhật theo từng ký tự (BR-HTVH-036-005, BR-HTVH-036-014) |
| 13 | **Tên sự kiện kích hoạt** | Ô nhập chữ, phông đơn cách | Bắt buộc khi ĐK kích hoạt = EVENT / `EVT_DATA_IMPORTED` | — | Thay thế ô Biểu thức Cron ở cùng vị trí (BR-HTVH-036-005) |
| 14 | **Số lần thử lại tối đa** | Ô nhập số | Không / 3 | 0–10, số nguyên | Đơn vị "lần" (BR-HTVH-036-007) |
| 15 | **Chờ ban đầu (giây)** | Ô nhập số | Không / 60 | 1–86400, số nguyên | Khoảng chờ trước lần thử lại đầu tiên (BR-HTVH-036-008) |
| 16 | **Job cần hoàn thành trước** | Danh sách chọn nhiều | Không | Chọn nhiều Job | Chọn các Job phụ thuộc từ danh sách (BR-HTVH-036-008) |
| 17 | **Email nhận cảnh báo chung** | Ô nhập nhiều thẻ | Không / `admin@cic.org.vn`, `alert@cic.org.vn` | Nhiều địa chỉ | Tự tách thẻ khi gõ dấu chấm phẩy hoặc dấu phẩy |
| 18 | **Bảng ma trận cảnh báo** | Bảng có ô nhập | Bắt buộc | 4 dòng × 5 cột | Bốn sự kiện × ba kênh (SMS / Push (Web) / Email) + cột người nhận riêng |
| 19 | Ô chọn kênh trên ma trận | Ô đánh dấu | Không / theo mặc định từng sự kiện | — | Mặc định: bắt đầu và thành công bật Email; thất bại bật cả ba kênh; thử lại bật Push |
| 20 | Ô *Người dùng / Email nhận riêng* | Ô chọn nhiều, cho phép nhập tự do | Không | Nhiều giá trị | Chọn từ danh mục người dùng hệ thống hoặc gõ địa chỉ tự do; thu gọn thẻ theo bề rộng |
| 21 | Nút *Lưu* | Nút chính | Bắt buộc | Rộng tối thiểu 100px | Hiển thị trạng thái đang xử lý khi đang ghi dữ liệu |
| 22 | Nút *Hủy* | Nút | Bắt buộc | Rộng tối thiểu 100px | Trở về danh sách, không ghi dữ liệu |

### Xử lý sự kiện và thao tác

| STT | Sự kiện / Thao tác | Điều kiện | Xử lý của hệ thống | Kết quả / Mã thông báo |
|---|---|---|---|---|
| 1 | Nhấp *Thiết lập job mới* | Có quyền `create` | Chuyển tới `/create` và nạp giá trị mặc định | Mở MH-HTVH-036-005 ở chế độ tạo mới |
| 2 | Chọn *Chỉnh sửa* trên menu thao tác | Có quyền `edit` | Chuyển tới `/{id}/edit`, nạp cấu hình hiện hành, khóa ô Mã Job | Mở MH-HTVH-036-005 ở chế độ cập nhật |
| 3 | Mở màn hình kèm tham số `cloneId` | — | Nạp cấu hình Job nguồn và điền Mã Job, Tên Job theo quy tắc nhân bản | Biểu mẫu điền sẵn (BR-HTVH-036-016) |
| 4 | Gõ ký tự vào ô Mã Job | Chế độ tạo mới | Chuyển sang chữ in hoa và loại bỏ ký tự không hợp lệ | Ô hiển thị giá trị đã chuẩn hóa |
| 5 | Đổi giá trị *Điều kiện kích hoạt* | — | Chuyển đổi giữa ô Biểu thức Cron và ô Tên sự kiện kích hoạt | Biểu mẫu đổi ô nhập tương ứng |
| 6 | Gõ vào ô Biểu thức Cron | ĐK kích hoạt ≠ EVENT | Diễn giải biểu thức sang tiếng Việt | Dòng diễn giải cập nhật ngay |
| 7 | Nhấp *Lưu* — dữ liệu hợp lệ | Toàn bộ ràng buộc thỏa | Ghi cấu hình, ghi nhật ký thay đổi, đăng ký lại lịch chạy | SUC_005 / SUC_006, chuyển về danh sách |
| 8 | Nhấp *Lưu* — dữ liệu không hợp lệ | Có ít nhất một ô sai | Đánh dấu ô lỗi, giữ nguyên dữ liệu đã nhập | ERR_014 và các mã lỗi ô tương ứng |
| 9 | Nhấp *Hủy* hoặc biểu tượng quay lại | — | Rời màn hình, không ghi dữ liệu | Trở về MH-HTVH-036-001 |

### Thông báo

| STT | Mã thông báo | Loại | Nội dung | Điều kiện phát sinh |
|---|---|---|---|---|
| 1 | ERR_001 | ERR | Vui lòng nhập mã Job | Ô Mã Job bỏ trống |
| 2 | ERR_002 | ERR | Tối đa 20 ký tự, chỉ gồm chữ in hoa, số, (-), (_) | Mã Job sai định dạng |
| 3 | ERR_003 | ERR | Vui lòng nhập tên Job | Ô Tên Job bỏ trống |
| 4 | ERR_004 | ERR | Tên Job không vượt quá 100 ký tự | Tên Job quá dài |
| 5 | ERR_005 | ERR | Vui lòng chọn loại Job | Ô Loại Job bỏ trống |
| 6 | ERR_006 | ERR | Vui lòng nhập mã dịch vụ | Ô Mã dịch vụ bỏ trống |
| 7 | ERR_007 | ERR | Mô tả không vượt quá 1000 ký tự | Mô tả quá dài |
| 8 | ERR_008 | ERR | Tham số bổ sung không vượt quá 1500 ký tự | Tham số bổ sung quá dài |
| 9 | ERR_009 | ERR | Vui lòng nhập thời gian chờ | Ô Thời gian chờ tối đa bỏ trống |
| 10 | ERR_010 | ERR | Giá trị phải nằm trong khoảng từ 1 đến 86400 giây | Thời gian chờ hoặc Khoảng chờ ban đầu ngoài khoảng |
| 11 | ERR_011 | ERR | Vui lòng nhập biểu thức Cron | Ô Biểu thức Cron bỏ trống khi ĐK kích hoạt ≠ EVENT |
| 12 | ERR_012 | ERR | Vui lòng nhập tên sự kiện | Ô Tên sự kiện bỏ trống khi ĐK kích hoạt = EVENT |
| 13 | ERR_013 | ERR | Số lần thử lại phải nằm trong khoảng từ 0 đến 10 lần | Số lần thử lại ngoài khoảng |
| 14 | ERR_014 | ERR | Vui lòng kiểm tra lại các trường thông tin chưa hợp lệ | Biểu mẫu còn ô không hợp lệ khi nhấp Lưu |
| 15 | ERR_015 | ERR | Job không tồn tại | Mở chế độ cập nhật với định danh không có trên hệ thống |
| 16 | ERR_021 | ERR | Mã Job đã tồn tại trên hệ thống | Mã Job trùng với bản ghi đã có |
| 17 | ERR_022 | ERR | Không thể lưu cấu hình Job, vui lòng thử lại sau | Lỗi khi ghi dữ liệu |
| 18 | WAR_001 | WAR | Đã lưu cấu hình nhưng chưa cập nhật được lịch chạy tự động | Đăng ký lịch với bộ lập lịch thất bại |
| 19 | SUC_005 | SUC | Lưu cấu hình Job {mã Job} thành công | Cập nhật Job thành công |
| 20 | SUC_006 | SUC | Lưu Job mới {mã Job} thành công | Tạo Job mới thành công |

### Tiêu chí chấp nhận

| STT | Tiêu chí — «Khi … thì hệ thống phải …» | Mã BR liên quan |
|---|---|---|
| 1 | Khi gõ chuỗi `job export 01` vào ô Mã Job, hệ thống phải hiển thị `JOBEXPORT01` — chuyển in hoa và loại bỏ ký tự không hợp lệ. | BR-HTVH-036-001 |
| 2 | Khi mở màn hình ở chế độ cập nhật, ô Mã Job phải ở trạng thái bị khóa. | BR-HTVH-036-002 |
| 3 | Khi đổi Điều kiện kích hoạt sang *Theo sự kiện*, hệ thống phải ẩn ô Biểu thức Cron và hiện ô Tên sự kiện kích hoạt là bắt buộc. | BR-HTVH-036-005 |
| 4 | Khi nhập Số lần thử lại tối đa là 11, hệ thống phải chặn giá trị và không cho phép ghi dữ liệu. | BR-HTVH-036-007 |
| 5 | Khi nhấp Lưu với biểu mẫu còn ô bắt buộc bỏ trống, hệ thống phải giữ người dùng ở lại màn hình và đánh dấu từng ô lỗi. | BR-HTVH-036-001 đến BR-HTVH-036-008 |
| 6 | Khi lưu thành công, hệ thống phải sinh một bản ghi trong Bảng Lịch sử thay đổi ghi rõ giá trị cũ, giá trị mới và địa chỉ IP. | BR-HTVH-036-015 |
| 7 | Khi mở màn hình kèm tham số nhân bản, ô Mã Job phải hiển thị `{mã gốc}_COPY` và ô Tên Job phải hiển thị `{tên gốc} (Bản sao)`. | BR-HTVH-036-016 |

---

## Tính năng [FEAT-HTVH-036-06] Điều chỉnh trạng thái hoạt động và xóa Job

### Mô tả yêu cầu

Cho phép người dùng có quyền `edit` bật hoặc tắt lịch chạy tự động của một Job trực tiếp từ menu thao tác trên danh sách, và cho phép người dùng có quyền `delete` xóa Job khỏi hệ thống.

Mục menu hiển thị theo trạng thái hiện tại của Job: Job đang ở trạng thái Hoạt động thì hiện mục *Vô hiệu hóa*; Job đang ở trạng thái Ngừng hoạt động thì hiện mục *Kích hoạt*. Sau khi đổi trạng thái, thẻ trạng thái trên dòng bản ghi cập nhật ngay và hệ thống hiển thị thông báo tương ứng.

Job ở trạng thái Ngừng hoạt động vẫn có thể được kích hoạt chạy thủ công; việc vô hiệu hóa chỉ gỡ Job khỏi lịch chạy tự động.

### Luồng xử lý

`[[DIAGRAM: FUNC-HTVH-036_seq-06]]`

![Trình tự — Điều chỉnh trạng thái hoạt động và xóa Job](diagrams/FUNC-HTVH-036_seq-06.png)

> *Hình: Trình tự — Điều chỉnh trạng thái hoạt động và xóa Job.* Nguồn PlantUML: [FUNC-HTVH-036_seq-06.puml](diagrams/FUNC-HTVH-036_seq-06.puml) · bản vector: [FUNC-HTVH-036_seq-06.svg](diagrams/FUNC-HTVH-036_seq-06.svg)

**Luồng chính**

| Bước | Tác nhân | Hành động | Phản hồi của hệ thống |
|---|---|---|---|
| 1 | Người dùng | Mở menu thao tác của một dòng bản ghi | Hệ thống dựng danh sách mục menu theo quyền của vai trò đang đăng nhập và theo trạng thái hiện tại của Job. |
| 2 | Người dùng | Chọn **Vô hiệu hóa** (Job đang Hoạt động) | Hệ thống đổi trạng thái Job sang `INACTIVE`, gỡ lịch chạy tự động, sinh bản ghi nhật ký thay đổi và hiển thị SUC_004. |
| 3 | Người dùng | Chọn **Kích hoạt** (Job đang Ngừng hoạt động) | Hệ thống đổi trạng thái Job sang `ACTIVE`, đăng ký lại lịch chạy theo biểu thức Cron hiện hành, sinh bản ghi nhật ký thay đổi và hiển thị SUC_003. |
| 4 | Hệ thống | — | Cập nhật thẻ trạng thái trên dòng bản ghi và cập nhật lại mục menu thao tác cho lần mở tiếp theo. |

**Luồng thay thế**

| Mã luồng | Điều kiện rẽ nhánh | Xử lý | Quay về bước |
|---|---|---|---|
| ALT-06-01 | Vai trò đăng nhập không có quyền `edit` | Không hiển thị mục *Kích hoạt* và *Vô hiệu hóa* trên menu thao tác | Bước 1 |
| ALT-06-02 | Người dùng chọn **Xóa** và có quyền `delete` | Xóa Job khỏi hệ thống, sinh bản ghi nhật ký thay đổi, hiển thị SUC_007 và làm mới danh sách | Bước 1 |
| ALT-06-03 | Vai trò đăng nhập không có quyền `delete` | Không hiển thị mục *Xóa* và đường phân cách phía trên nó | Bước 1 |
| ALT-06-04 | Đang có bộ lọc trạng thái và Job vừa đổi trạng thái không còn thỏa điều kiện | Bản ghi biến mất khỏi danh sách sau khi cập nhật | Bước 4 |

**Luồng ngoại lệ**

| Mã luồng | Tình huống ngoại lệ | Xử lý của hệ thống | Mã thông báo |
|---|---|---|---|
| EXC-06-01 | Vô hiệu hóa Job đang có lượt chạy dở dang | Lượt chạy hiện tại vẫn chạy tới khi kết thúc; Job chỉ bị gỡ khỏi lịch chạy các lượt tiếp theo | WAR_002 |
| EXC-06-02 | Xóa Job đang được Job khác khai báo là phụ thuộc | Từ chối xóa và nêu rõ danh sách Job đang phụ thuộc | ERR_023 |
| EXC-06-03 | Lỗi khi ghi trạng thái xuống cơ sở dữ liệu | Khôi phục trạng thái hiển thị về giá trị trước thao tác | ERR_022 |

### Thiết kế giao diện

Ảnh mockup: `FEAT-HTVH-036-06_menu-thao-tac.png` (MH-HTVH-036-001)

```
Menu thao tác (biểu tượng ba chấm, cột cố định bên phải)
┌──────────────────────────┐
│ 👁  Xem chi tiết          │  ← mọi vai trò
│ ✎  Chỉnh sửa             │  ← quyền edit
│ ▶  Chạy ngay             │  ← quyền run
│ ⏻  Vô hiệu hóa / Kích hoạt│  ← quyền edit, nhãn theo trạng thái
│ 🕘 Lịch sử chạy Job       │  ← mọi vai trò
│ ──────────────────────── │  ← đường phân cách, chỉ khi có quyền delete
│ 🗑  Xóa                   │  ← quyền delete, kiểu cảnh báo
└──────────────────────────┘
```

### Mô tả các thành phần trên giao diện

| STT | Tên thành phần | Kiểu dữ liệu / Loại control | Bắt buộc / Giá trị mặc định | Giới hạn | Mô tả ràng buộc |
|---|---|---|---|---|---|
| 1 | Menu thao tác | Menu thả xuống dùng chung | Bắt buộc | Tối đa 6 mục + 1 đường phân cách | Biểu tượng ba chấm, đặt ở cột cố định bên phải |
| 2 | Mục *Xem chi tiết* | Mục menu | Bắt buộc | — | Luôn hiển thị với mọi vai trò |
| 3 | Mục *Chỉnh sửa* | Mục menu | Không | — | Chỉ hiện khi có quyền `edit` |
| 4 | Mục *Chạy ngay* | Mục menu | Không | — | Chỉ hiện khi có quyền `run` |
| 5 | Mục *Vô hiệu hóa* / *Kích hoạt* | Mục menu | Không | 1 trong 2 nhãn | Chỉ hiện khi có quyền `edit`; nhãn phụ thuộc trạng thái hiện tại của Job (BR-HTVH-036-017) |
| 6 | Mục *Lịch sử chạy Job* | Mục menu | Bắt buộc | — | Luôn hiển thị với mọi vai trò |
| 7 | Mục *Xóa* | Mục menu kiểu cảnh báo | Không | — | Chỉ hiện khi có quyền `delete`, kèm đường phân cách phía trên |
| 8 | Thẻ trạng thái trên dòng | Thẻ trạng thái dùng chung | Bắt buộc | 2 giá trị | Cập nhật ngay sau khi đổi trạng thái thành công |

### Xử lý sự kiện và thao tác

| STT | Sự kiện / Thao tác | Điều kiện | Xử lý của hệ thống | Kết quả / Mã thông báo |
|---|---|---|---|---|
| 1 | Mở menu thao tác | Luôn khả dụng | Dựng mục menu theo quyền và theo trạng thái Job | Menu hiển thị đúng tập mục |
| 2 | Chọn *Vô hiệu hóa* | Job đang `ACTIVE`, có quyền `edit` | Đổi trạng thái sang `INACTIVE`, gỡ lịch chạy tự động, ghi nhật ký thay đổi | SUC_004 |
| 3 | Chọn *Kích hoạt* | Job đang `INACTIVE`, có quyền `edit` | Đổi trạng thái sang `ACTIVE`, đăng ký lại lịch chạy, ghi nhật ký thay đổi | SUC_003 |
| 4 | Chọn *Xóa* | Có quyền `delete` | Xóa Job, ghi nhật ký thay đổi, làm mới danh sách | SUC_007 |
| 5 | Chọn mục menu bất kỳ | — | Chặn sự kiện lan lên dòng để không mở popup chi tiết ngoài ý muốn | Chỉ thao tác đã chọn được thực hiện |

### Thông báo

| STT | Mã thông báo | Loại | Nội dung | Điều kiện phát sinh |
|---|---|---|---|---|
| 1 | SUC_003 | SUC | Đã kích hoạt Job {mã Job} | Đổi trạng thái sang Hoạt động thành công |
| 2 | SUC_004 | SUC | Đã vô hiệu hóa Job {mã Job} | Đổi trạng thái sang Ngừng hoạt động thành công |
| 3 | SUC_007 | SUC | Đã xóa Job {mã Job} | Xóa Job thành công |
| 4 | WAR_002 | WAR | Job đang có lượt chạy dở dang, lượt chạy hiện tại vẫn tiếp tục tới khi kết thúc | Vô hiệu hóa Job đang chạy |
| 5 | ERR_022 | ERR | Không thể cập nhật trạng thái Job, vui lòng thử lại sau | Lỗi khi ghi trạng thái |
| 6 | ERR_023 | ERR | Không thể xóa Job vì đang có Job khác phụ thuộc | Job là điều kiện tiên quyết của Job khác |

### Tiêu chí chấp nhận

| STT | Tiêu chí — «Khi … thì hệ thống phải …» | Mã BR liên quan |
|---|---|---|
| 1 | Khi Job đang ở trạng thái Hoạt động, menu thao tác phải hiển thị mục *Vô hiệu hóa* và không hiển thị mục *Kích hoạt*. | BR-HTVH-036-017 |
| 2 | Khi vô hiệu hóa thành công, thẻ trạng thái trên dòng bản ghi phải chuyển sang "Ngừng hoạt động" ngay mà không cần tải lại trang. | BR-HTVH-036-017 |
| 3 | Khi vai trò đăng nhập không có quyền `delete`, menu thao tác phải không có mục *Xóa* và không có đường phân cách phía trên nó. | BR-HTVH-036-012 |
| 4 | Khi chọn một mục trên menu thao tác, hệ thống phải không đồng thời mở popup Chi tiết Job của dòng đó. | Không áp dụng |
| 5 | Khi đổi trạng thái thành công, hệ thống phải sinh một bản ghi trong Bảng Lịch sử thay đổi. | BR-HTVH-036-015 |

---

## Tính năng [FEAT-HTVH-036-07] Cấu hình cột hiển thị và kết xuất dữ liệu

### Mô tả yêu cầu

Cung cấp hai công cụ trên thanh tác vụ của màn hình danh sách. **Cài đặt hiển thị** mở một popover cho phép tìm kiếm theo tên cột, chọn tất cả, bỏ chọn và bật/tắt hiển thị từng cột trong 8 cột dữ liệu — kể cả cột STT. **Xuất Excel** mở một menu ba tùy chọn: xuất trang hiện tại, xuất theo bộ lọc đang áp dụng và in trang hiện tại.

Ràng buộc: cấu hình cột phải luôn giữ tối thiểu một cột đang hiển thị; nút *Bỏ chọn* giữ lại cột đầu tiên trong danh sách. Cột *Thao tác* không nằm trong danh sách cấu hình và luôn hiển thị.

### Luồng xử lý

`[[DIAGRAM: FUNC-HTVH-036_seq-07]]`

![Trình tự — Cấu hình cột hiển thị và kết xuất dữ liệu](diagrams/FUNC-HTVH-036_seq-07.png)

> *Hình: Trình tự — Cấu hình cột hiển thị và kết xuất dữ liệu.* Nguồn PlantUML: [FUNC-HTVH-036_seq-07.puml](diagrams/FUNC-HTVH-036_seq-07.puml) · bản vector: [FUNC-HTVH-036_seq-07.svg](diagrams/FUNC-HTVH-036_seq-07.svg)

**Luồng chính**

| Bước | Tác nhân | Hành động | Phản hồi của hệ thống |
|---|---|---|---|
| 1 | Người dùng | Nhấp **Cài đặt hiển thị** trên thanh tác vụ | Hệ thống mở popover rộng 260px gồm ô tìm kiếm, dòng thống kê số cột đang chọn, hai nút *Chọn tất cả* / *Bỏ chọn* và danh sách 8 ô đánh dấu. |
| 2 | Người dùng | Nhập từ khóa vào ô tìm kiếm | Hệ thống lọc danh sách cột theo tên, không phân biệt chữ hoa chữ thường. |
| 3 | Người dùng | Bỏ tích một cột | Hệ thống ẩn cột tương ứng khỏi bảng ngay lập tức. |
| 4 | Người dùng | Nhấp **Xuất Excel** trên thanh tác vụ | Hệ thống mở menu ba tùy chọn kết xuất. |
| 5 | Người dùng | Chọn **Xuất theo bộ lọc** | Hệ thống kết xuất toàn bộ bản ghi thỏa điều kiện lọc hiện hành thành tệp `.xlsx` và tải về máy. |

**Luồng thay thế**

| Mã luồng | Điều kiện rẽ nhánh | Xử lý | Quay về bước |
|---|---|---|---|
| ALT-07-01 | Người dùng nhấp **Chọn tất cả** | Bật hiển thị toàn bộ 8 cột | Bước 3 |
| ALT-07-02 | Người dùng nhấp **Bỏ chọn** | Ẩn tất cả trừ cột đầu tiên trong danh sách | Bước 3 |
| ALT-07-03 | Người dùng bỏ tích cột cuối cùng còn hiển thị | Không thực hiện thao tác, giữ nguyên cột đó (BR-HTVH-036-013) | Bước 3 |
| ALT-07-04 | Người dùng chọn **Xuất trang hiện tại** | Kết xuất các bản ghi đang hiển thị trên trang hiện tại thành tệp `.xlsx` | Bước 4 |
| ALT-07-05 | Người dùng chọn **In trang hiện tại** | Mở hộp thoại in của trình duyệt với nội dung trang hiện tại | Bước 4 |

**Luồng ngoại lệ**

| Mã luồng | Tình huống ngoại lệ | Xử lý của hệ thống | Mã thông báo |
|---|---|---|---|
| EXC-07-01 | Danh sách sau lọc không có bản ghi nào | Không sinh tệp, hiển thị thông báo không có dữ liệu để kết xuất | WAR_003 |
| EXC-07-02 | Lỗi khi sinh tệp kết xuất | Hiển thị thông báo lỗi, không tải tệp về | ERR_024 |

### Thiết kế giao diện

Ảnh mockup: `FEAT-HTVH-036-07_cai-dat-hien-thi.png`, `FEAT-HTVH-036-07_xuat-excel.png`

```
Popover Cài đặt hiển thị (rộng 260px)   Menu Xuất Excel
┌──────────────────────────────┐        ┌───────────────────────┐
│ Cài đặt hiển thị             │        │ 📄 Xuất trang hiện tại│
│ [🔍 Tìm kiếm trường thông tin]│        │ ▽  Xuất theo bộ lọc   │
│ Đã chọn 8/8   [Bỏ chọn][Tất cả]│      │ 🖨  In trang hiện tại  │
│ ☑ STT           ☑ Loại Job    │       └───────────────────────┘
│ ☑ Mã Job        ☑ ĐK kích hoạt│
│ ☑ Tên Job       ☑ Biểu thức Cron│
│ ☑ Mã dịch vụ    ☑ Trạng thái  │
└──────────────────────────────┘
```

### Mô tả các thành phần trên giao diện

| STT | Tên thành phần | Kiểu dữ liệu / Loại control | Bắt buộc / Giá trị mặc định | Giới hạn | Mô tả ràng buộc |
|---|---|---|---|---|---|
| 1 | Nút *Cài đặt hiển thị* | Nút mở popover | Bắt buộc | Đặt trên thanh tác vụ | Mở popover rộng 260px |
| 2 | Ô tìm kiếm tên cột | Ô nhập chữ, có nút xóa nhanh | Không / Rỗng | — | So khớp chuỗi con trên nhãn cột, không phân biệt hoa thường |
| 3 | Dòng thống kê số cột | Chữ | Bắt buộc | — | Hiển thị số cột đang chọn trên tổng số cột |
| 4 | Nút *Chọn tất cả* / *Bỏ chọn* | Liên kết dạng nút | Bắt buộc | — | *Bỏ chọn* giữ lại cột đầu tiên (BR-HTVH-036-013) |
| 5 | Danh sách ô đánh dấu cột | Ô đánh dấu | Bắt buộc / 8 cột đều bật | 8 mục | STT, Mã Job, Tên Job, Mã dịch vụ, Loại Job, Điều kiện kích hoạt, Biểu thức Cron, Trạng thái |
| 6 | Nút *Xuất Excel* | Nút mở menu | Bắt buộc | Đặt trên thanh tác vụ | Menu 3 mục, thả xuống từ mép phải |
| 7 | Mục *Xuất trang hiện tại* | Mục menu | Bắt buộc | — | Kết xuất bản ghi đang hiển thị trên trang hiện tại |
| 8 | Mục *Xuất theo bộ lọc* | Mục menu | Bắt buộc | — | Kết xuất toàn bộ bản ghi thỏa điều kiện lọc hiện hành |
| 9 | Mục *In trang hiện tại* | Mục menu | Bắt buộc | — | Mở hộp thoại in của trình duyệt |

### Xử lý sự kiện và thao tác

| STT | Sự kiện / Thao tác | Điều kiện | Xử lý của hệ thống | Kết quả / Mã thông báo |
|---|---|---|---|---|
| 1 | Nhấp *Cài đặt hiển thị* | Luôn khả dụng | Mở popover cấu hình cột | Popover hiển thị |
| 2 | Nhập từ khóa tên cột | Popover đang mở | Lọc danh sách cột theo tên | Danh sách cột thu hẹp |
| 3 | Tích / bỏ tích một cột | Còn nhiều hơn một cột đang hiện | Cập nhật danh sách cột hiển thị của bảng | Bảng ẩn/hiện cột ngay |
| 4 | Bỏ tích cột cuối cùng | Chỉ còn một cột đang hiện | Không thực hiện, giữ nguyên cột đó | Không có thay đổi |
| 5 | Nhấp *Chọn tất cả* | Popover đang mở | Bật hiển thị toàn bộ 8 cột | Bảng hiển thị đủ cột |
| 6 | Nhấp *Bỏ chọn* | Popover đang mở | Ẩn tất cả trừ cột đầu tiên | Bảng chỉ còn một cột dữ liệu và cột Thao tác |
| 7 | Chọn *Xuất trang hiện tại* | Có ít nhất một bản ghi | Sinh tệp `.xlsx` chứa bản ghi của trang hiện tại | SUC_009 |
| 8 | Chọn *Xuất theo bộ lọc* | Có ít nhất một bản ghi | Sinh tệp `.xlsx` chứa toàn bộ bản ghi thỏa điều kiện lọc | SUC_010 |
| 9 | Chọn *In trang hiện tại* | Luôn khả dụng | Mở hộp thoại in của trình duyệt | Hộp thoại in hiển thị |

### Thông báo

| STT | Mã thông báo | Loại | Nội dung | Điều kiện phát sinh |
|---|---|---|---|---|
| 1 | SUC_009 | SUC | Đã xuất file Excel cho trang hiện tại | Kết xuất trang hiện tại thành công |
| 2 | SUC_010 | SUC | Đã xuất file Excel theo bộ lọc đã chọn | Kết xuất theo bộ lọc thành công |
| 3 | WAR_003 | WAR | Không có dữ liệu để kết xuất | Danh sách sau lọc rỗng |
| 4 | ERR_024 | ERR | Không thể tạo tệp kết xuất, vui lòng thử lại sau | Lỗi khi sinh tệp |

### Tiêu chí chấp nhận

| STT | Tiêu chí — «Khi … thì hệ thống phải …» | Mã BR liên quan |
|---|---|---|
| 1 | Khi nhập "cron" vào ô tìm kiếm của popover, hệ thống phải chỉ hiển thị mục *Biểu thức Cron*. | Không áp dụng |
| 2 | Khi bỏ tích cột *Mã dịch vụ*, bảng phải ẩn cột đó ngay mà không cần tải lại trang. | BR-HTVH-036-013 |
| 3 | Khi chỉ còn một cột đang hiển thị, hệ thống phải không cho phép bỏ tích cột đó. | BR-HTVH-036-013 |
| 4 | Khi ẩn toàn bộ cột dữ liệu bằng nút *Bỏ chọn*, cột *Thao tác* vẫn phải hiển thị. | BR-HTVH-036-013 |
| 5 | Khi chọn *Xuất theo bộ lọc* trong lúc đang lọc theo Trạng thái "Hoạt động", tệp kết xuất phải chỉ chứa các Job có trạng thái đó. | Không áp dụng |

---

## Dữ liệu và tích hợp

| STT | Loại | Tên đối tượng | Chiều | Mô tả / Ghi chú |
|---|---|---|---|---|
| 1 | Bảng CSDL | `JOB_DEFINITION` | Đọc / Ghi | Cấu hình Job: mã, tên, loại, mã dịch vụ, mô tả, tham số bổ sung, điều kiện kích hoạt, biểu thức Cron, thời gian chờ, chính sách xử lý khi bỏ lỡ, khóa chạy song song, chính sách thử lại, trạng thái hoạt động |
| 2 | Bảng CSDL | `JOB_NOTIFICATION_MATRIX` | Đọc / Ghi | Ma trận cảnh báo: 4 sự kiện × 3 kênh (SMS / Push / Email) và danh sách người nhận riêng cho từng sự kiện |
| 3 | Bảng CSDL | `JOB_EXECUTION_LOG` | Đọc / Ghi | Nhật ký lượt chạy: mã lượt chạy, thời gian bắt đầu / kết thúc, thời lượng, số lần thử lại, người kích hoạt, điều kiện kích hoạt, số bản ghi xử lý / lỗi, trạng thái, thông điệp lỗi |
| 4 | Bảng CSDL | `JOB_RUN_LOG_DETAIL` | Đọc / Ghi | Các dòng nhật ký chi tiết của lượt chạy: dấu thời gian, mức nhật ký, tên bước, nội dung |
| 5 | Bảng CSDL | `JOB_AUDIT_HISTORY` | Đọc / Ghi | Nhật ký thay đổi cấu hình theo 8 cột chuẩn, phục vụ Bảng Lịch sử thay đổi |
| 6 | Bảng CSDL | `JOB_DEPENDENCY` | Đọc / Ghi | Quan hệ phụ thuộc giữa các Job (phụ thuộc cứng / mềm, điều kiện kích hoạt tiếp theo) |
| 7 | Bảng CSDL | `SYS_USER` | Đọc | Danh mục người dùng hệ thống, phục vụ ô chọn người nhận cảnh báo riêng |
| 8 | API | `GET /api/v1/jobs` | Ra | Lấy danh sách Job kèm điều kiện lọc và phân trang |
| 9 | API | `GET /api/v1/jobs/{id}` | Ra | Lấy cấu hình chi tiết của một Job |
| 10 | API | `POST /api/v1/jobs` | Ra | Tạo Job mới |
| 11 | API | `PUT /api/v1/jobs/{id}` | Ra | Cập nhật cấu hình Job |
| 12 | API | `PATCH /api/v1/jobs/{id}/status` | Ra | Đổi trạng thái hoạt động của Job |
| 13 | API | `DELETE /api/v1/jobs/{id}` | Ra | Xóa Job |
| 14 | API | `POST /api/v1/jobs/{id}/execute` | Ra | Kích hoạt Job chạy ngay ngoài lịch |
| 15 | API | `POST /api/v1/job-runs/{runId}/stop` | Ra | Dừng một lượt chạy đang thực thi |
| 16 | API | `GET /api/v1/jobs/{id}/runs` | Ra | Lấy danh sách lượt chạy của một Job |
| 17 | API | `GET /api/v1/jobs/{id}/audit-history` | Ra | Lấy nhật ký thay đổi cấu hình của một Job |
| 18 | Hàng đợi | Hàng đợi thực thi Job (HT-SCH) | Ra | Đưa yêu cầu chạy Job vào hàng đợi của bộ lập lịch |
| 19 | API | Dịch vụ thông báo (HT-TB) | Ra | Gửi cảnh báo qua SMS / Push / Email theo ma trận đã cấu hình |
| 20 | File | Tệp `.xlsx` kết xuất danh sách Job | Ra | Sinh tại phía người dùng hoặc phía máy chủ tùy khối lượng dữ liệu |
| 21 | File | Tệp `{mã Job}-progress.log` | Ra | Kết xuất nhật ký thời gian thực từ ngăn theo dõi tiến độ |

---

## Phân loại dữ liệu

| STT | Trường / Nhóm dữ liệu | Phân loại | Quy tắc che | Ghi nhật ký | Thời hạn lưu |
|---|---|---|---|---|---|
| 1 | Mã Job, Tên Job, Loại Job, Mã dịch vụ | Nội bộ | Hiển thị đầy đủ | Ghi khi tạo mới và khi sửa | Theo vòng đời của Job |
| 2 | Mô tả Job, cấu hình lập lịch và chính sách thử lại | Nội bộ | Hiển thị đầy đủ | Ghi khi sửa | Theo vòng đời của Job |
| 3 | Tham số bổ sung (YAML/JSON) | Nhạy cảm | Che các khóa có tên chứa `password`, `secret`, `token`, `key` bằng `******`; chỉ ROLE-QTHT xem được bản đầy đủ | Ghi khi sửa, không ghi nội dung giá trị bị che | Theo vòng đời của Job |
| 4 | Chuỗi kết nối, mật khẩu, mã thông báo truy cập | Nhạy cảm | Che 100% trên mọi màn hình | Ghi thao tác truy cập, không ghi giá trị | Theo vòng đời của Job |
| 5 | Email nhận cảnh báo và danh sách người nhận riêng | Định danh cá nhân | Hiển thị đầy đủ với ROLE-QTHT và ROLE-QLVH; che phần trước ký tự `@` với ROLE-XEM | Ghi khi sửa | Theo vòng đời của Job |
| 6 | Tên đăng nhập và họ tên người cập nhật trong nhật ký thay đổi | Định danh cá nhân | Hiển thị tên đăng nhập; họ tên đầy đủ chỉ hiện qua tooltip | Ghi | 5 năm |
| 7 | Địa chỉ IP thiết bị thực hiện thao tác | Định danh cá nhân | Hiển thị đầy đủ với ROLE-QTHT và ROLE-QLVH | Ghi | 5 năm |
| 8 | Nhật ký lượt chạy (thời gian, thời lượng, số bản ghi, trạng thái) | Nội bộ | Hiển thị đầy đủ | Ghi | 2 năm |
| 9 | Nội dung nhật ký chi tiết của lượt chạy | Nhạy cảm | Không được ghi dữ liệu định danh khách hàng vào nhật ký; nếu có thì phải che trước khi lưu | Ghi | 90 ngày |
| 10 | Tệp kết xuất Excel danh sách Job | Nội bộ | Theo phạm vi dữ liệu của vai trò kết xuất | Ghi thao tác kết xuất kèm tên tài khoản và thời điểm | Không lưu phía máy chủ |

---

## Vấn đề còn mở

> Mục này phải rỗng thì chức năng mới được chuyển sang trạng thái đã phê duyệt.
> Các dòng dưới đây là chênh lệch giữa mã nguồn hiện tại và đặc tả này, hoặc điểm cần người quyết định.

| STT | Nội dung vấn đề | Người quyết định | Hạn chốt | Trạng thái |
|---|---|---|---|---|
| 1 | **Bộ lọc trên thanh không tác động tới bảng dữ liệu.** `JobFilter.tsx` gọi `useJobManagement()` tạo một bản trạng thái riêng, độc lập với bản mà `index.tsx` dùng để cấp dữ liệu cho bảng. Cần nâng trạng thái lọc lên trang cha hoặc bọc bằng context dùng chung. | Trưởng nhóm phát triển |  | Mở |
| 2 | **Ô lọc khoảng thời gian trên popup Lịch sử chạy chưa gắn logic.** Bộ chọn ngày đã hiển thị nhưng giá trị chọn không tham gia lọc dữ liệu. | Trưởng nhóm phát triển |  | Mở |
| 3 | **Popup Lịch sử chạy hiển thị dữ liệu của Job khác khi Job hiện tại chưa có lượt chạy.** Mã nguồn dự phòng bằng cách trả về toàn bộ danh sách mẫu — phải đổi thành trạng thái rỗng. | Trưởng nhóm phát triển |  | Mở |
| 4 | **Nhãn "Cho phép chạy song song" mang ngữ nghĩa ngược với giá trị.** Giá trị `true` hiển thị nhãn "Khóa chạy song song". Cần thống nhất: đổi tên trường thành "Khóa chạy song song", hoặc đảo giá trị. | Chủ nhiệm nghiệp vụ |  | Mở |
| 5 | **Đơn vị Thời gian chờ tối đa không nhất quán.** Dữ liệu mẫu lưu mili giây (`3600000`) trong khi biểu mẫu và popup chi tiết diễn giải là giây (1–86400). Phải chốt một đơn vị lưu trữ duy nhất. | Chủ nhiệm nghiệp vụ |  | Mở |
| 6 | **Đường dẫn `/ops-support/job-management/{id}` chưa có điều hướng tới.** Trang chi tiết toàn màn hình đã được hiện thực nhưng danh sách đang mở popup. Cần quyết định giữ một trong hai để tránh trùng đặc tả (MH-HTVH-036-002 và MH-HTVH-036-007). | Chủ nhiệm nghiệp vụ |  | Mở |
| 7 | **Trạng thái `ARCHIVED` (ST-JOB-03) chưa có thao tác chuyển trên giao diện.** Cần bổ sung thao tác đưa vào lưu trữ, hoặc gỡ trạng thái này khỏi mô hình dữ liệu. | Chủ nhiệm nghiệp vụ |  | Mở |
| 8 | **Thao tác xóa Job mới dừng ở thông báo, chưa loại bản ghi khỏi danh sách.** Cần hiện thực đầy đủ kèm popup xác nhận và kiểm tra ràng buộc phụ thuộc (ERR_023). | Trưởng nhóm phát triển |  | Mở |
| 9 | **Nút *Tìm kiếm* trên thanh bộ lọc không gắn hành vi.** Danh sách hiện lọc tức thời theo từng ký tự; cần chốt: bỏ nút này, hay chuyển sang cơ chế lọc theo lệnh tìm kiếm. | Chủ nhiệm nghiệp vụ |  | Mở |
| 10 | **Danh mục Loại Job lệch giữa hai nơi.** Ô lọc trên thanh có 8 tùy chọn, bộ lọc tiêu đề cột chỉ có 5 (thiếu `SPRING_BEAN`, `REST_API`, `SQL_SCRIPT`). Cần thống nhất về một danh mục dùng chung. | Chủ nhiệm nghiệp vụ |  | Mở |
| 11 | **Mã thông báo, mã vai trò, mã trạng thái trong tài liệu này là mã tạm.** Phải đối chiếu `messages.csv`, `roles.csv`, `states.csv`, `groups.csv`, `participants.csv`, `components.csv` và cấp lại số trong cùng yêu cầu hợp nhất. | Ban chuẩn hóa tài liệu |  | Mở |
| 12 | **Mã UC trong mục Truy vết yêu cầu là mã dự kiến.** Cần đối chiếu BRD và `usecases.csv` để xác nhận hoặc thay bằng mã thật. | Ban chuẩn hóa tài liệu |  | Mở |
| 13 | **Vai trò đang lấy từ bộ nhớ cục bộ của trình duyệt**, mặc định là `ADMIN`. Phải chuyển sang lấy từ phiên đăng nhập thật khi tích hợp mô-đun xác thực; trước đó không được đưa lên môi trường thật. | Trưởng nhóm phát triển |  | Mở |
| 14 | **Thẻ *Bước hiện tại* trên ngăn theo dõi tiến độ không bao giờ đổi giá trị** — khởi tạo bằng chuỗi tiếng Trung `初始化` và hàm cập nhật không được gọi ở bất kỳ đâu, nên thẻ luôn hiển thị đúng chuỗi đó suốt lượt chạy. Phải đổi sang tiếng Việt và lấy giá trị từ dữ liệu lượt chạy thay vì hằng số. | Trưởng nhóm phát triển |  | Mở |
| 15 | **Toàn bộ dữ liệu hiện là dữ liệu mẫu tĩnh** trong `mockData.ts`. Danh sách API tại mục Dữ liệu và tích hợp là đề xuất, cần chốt hợp đồng giao diện với nhóm phát triển phía máy chủ. | Kiến trúc sư hệ thống |  | Mở |
| 16 | **`modals/JobRunModal.tsx` là thành phần chết** — không tệp nào nhập nó, không có lối vào từ giao diện. Cần xoá khỏi mã nguồn để không gây nhầm khi đối chiếu đặc tả. | Trưởng nhóm phát triển |  | Mở |
| 17 | **Thanh thao tác hàng loạt trong `JobList.tsx` là mã chết** — hai hàm `handleBulkRun` và `handleBulkDelete` được định nghĩa nhưng không nút nào gọi tới; kéo theo hai thuộc tính `onBulkRun` / `onBulkDelete` truyền từ trang cha, biến trạng thái `isDeleting` và các thành phần nhập thừa (`Button`, `Space`, `Popconfirm`, `CopyOutlined`) đều không dùng. Cần chốt: bổ sung thanh thao tác hàng loạt vào thiết kế, hay xoá hẳn mã thừa. | Chủ nhiệm nghiệp vụ |  | Mở |
| 18 | **Nút *Chạy ngay* trên popup Chi tiết Job không thực sự kích hoạt Job** — chỉ mở ngăn theo dõi tiến độ và hiện thông báo, không gọi hàm chạy Job nên không sinh bản ghi lượt chạy. Hành vi đặc tả tại FEAT-HTVH-036-02 là hành vi đích, chưa khớp mã nguồn. | Trưởng nhóm phát triển |  | Mở |
| 19 | **Ngăn theo dõi tiến độ (MH-HTVH-036-003) hiện là mô phỏng hoàn toàn** — tiến độ, thời lượng, số bản ghi và dòng nhật ký đều sinh bằng số ngẫu nhiên theo chu kỳ 800ms, không đọc dữ liệu thật; nút *Dừng* chỉ hiện thông báo chứ không dừng lượt chạy nào. Ngoài ra thành phần dùng mã màu cứng, vi phạm quy tắc bắt buộc dùng design token. Cần chốt: giữ trong phạm vi và hiện thực thật, hay gỡ khỏi thiết kế. | Chủ nhiệm nghiệp vụ |  | Mở |

---

## Lịch sử thay đổi

> Script build tự đổ nội dung từ Git log của chính file này. Không gõ tay.

| Phiên bản | Ngày | Người thực hiện | Mô tả thay đổi |
|---|---|---|---|
| 2.0.0 | 07/08/2026 | — | Soạn lại toàn bộ theo mẫu UI v3.0 trên cơ sở đọc mã nguồn thực tế: tách thành 7 tính năng, bổ sung 7 màn hình, 18 quy tắc nghiệp vụ, 11 sơ đồ PlantUML và 15 vấn đề còn mở |
| 1.0.0 | 06/08/2026 | — | Bản đặc tả đầu tiên |
