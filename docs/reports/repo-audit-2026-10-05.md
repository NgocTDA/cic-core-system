# Báo cáo rà soát repository CIC Core System

Ngày rà soát: **05/10/2026**. Phạm vi: trạng thái working tree hiện tại, bao gồm thay đổi chưa commit. **Chỉ lập báo cáo; chưa sửa mã nguồn, dependency, cấu hình hoặc xóa file.**

## 1. Kết quả chính

Repo có lỗi cần sửa trước khi dọn: lỗi TypeScript, nguy cơ ghi đè mất dữ liệu sổ đăng ký, thao tác sai dòng khi phân trang, xử lý CSV sai và kiểm tra nguồn tải ảnh Confluence không chặt chẽ. Nhiều phần vẫn là prototype/mock; không nên coi việc xóa mock là một bước dọn rác độc lập.

Các kết quả đo được:

| Kiểm tra | Kết quả |
|---|---|
| Kiểm kê file tracked + untracked không bị ignore, còn tồn tại | 477 file trước khi tạo báo cáo |
| Phân bố | frontend 276; docs 135; .agents 54; .claude 2; .github 2; .stitch 3; 5 file gốc |
| Mã TS/TSX/JS/JSX dưới app + src | 226 file |
| App Router | 36 page, 11 API route handler |
| TypeScript với cấu hình hiện hành | **Không đạt: 1 lỗi TS2322** |
| Next lint, không dùng cache | Thành công, **2 cảnh báo dependency của hook** |
| Bật thêm noUnusedLocals + noUnusedParameters để chẩn đoán | **195 chẩn đoán không dùng trong 61 file**, ngoài lỗi TS2322 |
| Đường dẫn literal trong navigation.tsx | 241; **181 chưa khớp page**, đã tính route động của Design System |
| Đường dẫn menu so với docs/menu.md | Tất cả 241 đường dẫn xuất hiện trong tài liệu; chưa phát hiện thiếu đường dẫn bằng phép đối chiếu này |
| Đồ thị import từ entrypoint Next.js | 6 file mã nguồn ứng viên không còn được dùng; không tính file khai báo .d.ts |
| SHA-256 file nội dung, bỏ thư mục công cụ ẩn | 11 nhóm trùng byte: 10 cặp template và 1 cặp outline.json |

**Giới hạn:** đây là rà soát tĩnh toàn cây file kết hợp đọc các luồng trọng yếu và kiểm tra cục bộ. Không đồng nghĩa đã kiểm thử từng màn hình/từng dòng mã. Chưa chạy trình duyệt, Docker, gọi API thật, đánh giá CVE trực tuyến hay xem toàn bộ bố cục tài liệu nhị phân. Không đọc/in nội dung cấu hình bí mật. Không chạy `npm run dev`/`npm run build` vì hook hiện tại chủ động kill process/xóa `.next`; kiểm tra kiểu chạy với `--incremental false` để không ghi lại cache. Git có cảnh báo không đọc được global ignore của máy; kiểm kê dựa trên file repository và exclude khả dụng.

## 2. Nội dung sai hoặc cần sửa

Mức độ: **P1** sửa sớm do mất dữ liệu, bảo mật hoặc chặn build; **P2** lỗi chức năng/triển khai/chuẩn giao diện; **P3** vệ sinh và tài liệu. Mức chắc chắn được ghi riêng với các phát hiện phụ thuộc môi trường.

### F01 — P1 — TypeScript không đạt

- Bằng chứng: `frontend/src/layouts/AppHeader.tsx:66,210` đặt `userInfoGap = 'var(--spacing-8)'`, truyền vào `Space.size`.
- Kết quả thực tế: `TS2322: Type '"var(--spacing-8)"' is not assignable to type 'SpaceSize | [SpaceSize, SpaceSize]'`.
- Tác động: chặn typecheck; cấu hình Next hiện tại không bỏ qua lỗi TypeScript nên là trở ngại cho build chuẩn. Chưa chạy full build.
- Đề xuất: dùng giá trị số/token tương thích với API `Space` hoặc áp dụng CSS gap đúng chỗ. Không ép kiểu để che lỗi.

### F02 — P1 — Lưu kết quả tìm kiếm có thể xóa các dòng khác trong CSV

- Bằng chứng: `frontend/src/modules/tools/SrsRegistries/index.tsx:46-62,76-98` tải dữ liệu theo `q` vào `items`; sửa/xóa gửi toàn bộ `items` này. `frontend/app/api/srs/registries/route.ts:100-104` lọc phía server, rồi POST tại `:145-147` ghi đè file bằng dữ liệu nhận được.
- Tình huống: CSV có A/B/C; tìm A; sửa A; POST chỉ gửi A; file sau lưu không còn B/C.
- Đề xuất: thao tác theo khóa ổn định trên server, hoặc tách dữ liệu đầy đủ khỏi tập hiển thị. Bổ sung kiểm soát phiên bản khi lưu và ghi file nguyên tử để tránh hai người ghi đè nhau.
- Chắc chắn cao từ đường đi dữ liệu; không thử ghi vào CSV thật.

### F03 — P1 — Sửa/xóa nhầm dòng từ trang 2 của sổ đăng ký

- Bằng chứng: `SrsRegistries/index.tsx:70-78,127-128,172` sử dụng `index` từ render cột để truy cập/splice mảng đầy đủ; bảng có `pageSize: 15`.
- Đã đối chiếu mã Ant Design/rc-table đang cài: Ant Design cắt `pageData` trước khi chuyển xuống table; chỉ số render thuộc tập trang hiện tại.
- Tình huống: dòng đầu trang 2 có index 0, thao tác cập nhật/xóa phần tử 0 của toàn bộ `items`.
- Đề xuất: sử dụng mã định danh bản ghi, đồng thời bỏ `rowKey` dựa trên index.

### F04 — P1 — Bộ đọc/ghi CSV làm biến đổi dữ liệu

- Bằng chứng: `frontend/app/api/srs/registries/route.ts:20-74`: parse tách dòng trước khi xử lý quote; mỗi dấu `"` chỉ đảo trạng thái và bị bỏ; stringify chỉ quote khi có dấu phẩy.
- Đã chạy round-trip trực tiếp các hàm được trích từ source, không đọc/ghi dữ liệu thật:
  - `a"b` trở thành `ab`.
  - Chuỗi `a\nb` trở thành hai bản ghi `a` và `b`.
  - `a,"b"` trở thành `a,b`.
- Đề xuất: dùng parser/stringifier hỗ trợ đúng CSV, khai báo schema cột, kiểm tra payload trước ghi; kiểm thử quote, xuống dòng, comma, Unicode và ô rỗng.

### F05 — P1 — Kiểm tra host tải ảnh Confluence có thể gửi PAT sai đích

- Bằng chứng: `frontend/app/api/confluence/confluenceClient.ts:76-81` sử dụng `absolute.startsWith(base)` để quyết định gắn Bearer token. Helper được dùng trong `frontend/app/api/confluence/docx/route.ts:325,330` khi xử lý ảnh.
- Kiểm chứng chuỗi: với base `https://wiki.example`, URL `https://wiki.example.evil.test/image.png` vẫn trả `true` khi dùng startsWith.
- `cfFetch` cũng chấp nhận URL tuyệt đối và luôn gắn Bearer; cần kiểm tra các đường dẫn attachment mà server trả về.
- Đề xuất: parse URL và so sánh origin chính xác, kiểm soát redirect và các đích ảnh ngoài. Không gửi PAT đến origin ngoài allowlist.
- Lỗi so sánh chắc chắn; khả năng khai thác phụ thuộc việc nội dung Confluence có đưa được URL ảnh đó vào luồng xử lý hay không. Chưa gửi token hay gọi mạng để thử.

### F06 — P1 khi triển khai dữ liệu thật — Chưa có biên xác thực/phân quyền phía server trong repo

- `frontend/app/auth/login/LoginClient.tsx:85-97` là mock `admin/admin`, chỉ chuyển trang, không tạo session xác thực.
- `frontend/src/context/RoleContext.tsx:14-25` mặc định ADMIN, lưu role ở localStorage; đây là trạng thái UI do người dùng kiểm soát.
- Các POST AI, Confluence, sổ đăng ký không thấy kiểm tra session/quyền server; không tìm thấy middleware xác thực trong cây app. Sổ đăng ký có khả năng ghi file, AI sử dụng key server, Confluence có fallback PAT server.
- Đề xuất: giữ rõ nhãn prototype; trước khi dùng thật phải có xác thực và authorization phía server cho từng thao tác. Kiểm tra thêm gateway/SSO bên ngoài repo trước khi kết luận về mức phơi lộ thực tế.
- Không coi mock login hoặc RoleContext là file có thể xóa ngay: các màn hình đang phụ thuộc vào chúng.

### F07 — P2 — Registry không có đường dẫn triển khai khả dụng và volume không ghi được

- `frontend/app/api/srs/registries/route.ts:8-16` ưu tiên `C:\Users\ngoct\Downloads\srs-pipeline`, fallback `config/registries`; nếu cả hai không có, trả lại đường dẫn Windows.
- Cây file được kiểm kê không có `frontend/config/registries`; CSV mẫu hiện nằm trong `docs/srs-pipeline/srs-pipeline/srs/`.
- `docker-compose.yml` mount toàn bộ `/app/config:ro`; ngay cả thêm CSV vào fallback thì POST vẫn không thể ghi vào mount đó.
- Đề xuất: biến môi trường cho thư mục dữ liệu, khởi tạo schema rõ ràng, volume dữ liệu riêng được phép ghi. Giữ config/key chỉ đọc.

### F08 — P2 — Luồng tạo/xóa sổ đăng ký rỗng không hoạt động nhất quán

- Form tại `SrsRegistries/index.tsx:192-197` lấy schema từ `Object.keys(items[0])` và chỉ tạo input khi có dữ liệu: registry rỗng không có trường để nhập bản ghi đầu tiên.
- POST `registries/route.ts:138-140` từ chối mảng rỗng: không xóa được bản ghi cuối cùng.
- `handleDelete` cập nhật UI trước khi server trả lỗi và không rollback; `registryService.ts:26-37` nuốt lỗi tải thành `[]`, làm lỗi máy chủ giống dữ liệu trống.
- Đề xuất: schema độc lập dữ liệu, phân biệt trạng thái lỗi/rỗng, chỉ cập nhật sau khi lưu thành công hoặc có rollback.

### F09 — P2 — Docker build context chưa loại cấu hình Confluence chứa PAT

- `frontend/.dockerignore` chỉ loại `config/ai-providers.json`, chưa loại `config/confluence.json`; Dockerfile có `COPY . .` vào builder.
- Khi file PAT tồn tại trên máy build, nó có thể vào build context/layer cache. Không khẳng định PAT đã tồn tại hoặc đã lọt vào runtime image.
- Đề xuất: ignore đầy đủ cấu hình bí mật và `.env*` cần thiết, giữ các example an toàn; kiểm tra image/cache nếu trước đây đã build với secret.

### F10 — P2 — Lệnh dev tự kill process theo port, cache bị xóa mỗi lần chạy

- `frontend/package.json:7-10`, `scripts/cleanup-port.js:9-24`: trên Windows dùng `findstr :3000` rồi kill PID, không kiểm tra đúng local port, trạng thái LISTENING hoặc process thuộc repo. Có thể khớp port 30000 hoặc kết nối có remote port 3000.
- `scripts/clean-cache.js` được gọi trước cả dev/build, xóa `.next`; có thể gián đoạn dev đang chạy và luôn mất cache.
- Đề xuất: bỏ auto-kill; để lỗi port hiển thị hoặc yêu cầu thao tác riêng xác định đúng process. Chuyển clear cache thành lệnh sửa lỗi chủ động.
- Chỉ đọc script; không chạy các hook này trong lần rà soát.

### F11 — P2 — 181 liên kết menu chưa có trang

- Đối chiếu 241 path literal trong `frontend/src/config/navigation.tsx` với 36 page, có xử lý `[group]/[component]` và các route động.
- `frontend/src/layouts/AppSidebar.tsx:141-145` tạo Link trực tiếp. Ví dụ: `/kkn/channel-setup`, `/ops-support/users`, `/product-mgmt/catalog/indicators`.
- Danh sách đầy đủ: [missing-routes.txt](repo-audit-2026-10-05/missing-routes.txt).
- Có thể là menu roadmap có chủ đích; không đề xuất xóa hàng loạt. Nên ẩn/disable hoặc dẫn tới trang “Chưa triển khai”. Chưa duyệt browser để xác nhận phản hồi HTTP từng URL.
- Ngoài menu, link `/auth/forgot-password` tại `LoginClient.tsx:192` chưa có page tương ứng.

### F12 — P2 — Lịch sử thay đổi tự điền dữ liệu không có thật

- `frontend/src/components/ui/ChangeHistoryCollapse.tsx:105` thay timestamp rỗng bằng thời điểm hiện tại; `:181` thay IP rỗng bằng `192.168.1.100`.
- Điều này làm dữ liệu thiếu trông như bằng chứng audit có thật; fallback timestamp còn không đồng nhất với thứ tự sort dựa trên timestamp gốc.
- Đề xuất: hiển thị `—`/“Không ghi nhận”; dữ liệu audit phải do nguồn dữ liệu cung cấp. Component đã đúng phần thu gọn mặc định, sort mới nhất, giới hạn 20, không pagination và scroll 250/1300; không cần viết lại toàn bộ.

### F13 — P2 — Chuyển đổi design system chưa đồng bộ

- Working tree đã xóa `frontend/src/design-system/tokens.ts`; barrel chỉ export theme; root layout nạp Forest CSS và fonts.
- `docs/design-system/tokens.md` đã mô tả Forest v1.4.0 nhưng `docs/design-system/README.md:9-21`, `docs/architecture/README.md:97-105`, README gốc và AGENTS/CLAUDE vẫn chỉ dẫn sửa/import file tokens.ts đã không còn.
- `frontend/app/globals.css:18-27` vẫn định nghĩa `--color-primary-500: #1677ff`; theme mới dùng `#2c795b`. Theme cũng khai báo lại nhiều giá trị sau khi spread Forest theme, tạo nhiều nguồn giá trị cần bảo trì.
- Quét khai báo CSS trong app + package Forest đang cài không thấy `--text-secondary` và `--text-disabled`, nhưng source đang sử dụng chúng; `--spacing-3` cũng không tìm thấy, hiện nằm trong CSS cron cũ.
- Đề xuất: chốt hợp đồng token theo docs/design-system, sửa tên biến thiếu, hợp nhất lớp tương thích và cập nhật docs đồng bộ. Không khôi phục/xóa token cũ mù quáng trong lúc migration chưa hoàn tất.

### F14 — P2 — Nút “Thêm bộ lọc” của shared FilterBar chưa có hành vi

- `frontend/src/components/ui/FilterBar.tsx:91-99` hiển thị Button nhưng không có onClick/popover; props cũng không cung cấp callback riêng để thực hiện yêu cầu ẩn/hiện trường.
- Đề xuất: triển khai control thực sự hoặc ẩn nút khi màn hình không hỗ trợ. Đây là vấn đề shared component ảnh hưởng nhiều trang.

### F15 — P2 — Các màn hình chưa đạt quy chuẩn UI của repo

Các ví dụ đã xác định trong source, chưa đánh giá toàn bộ bằng ảnh chụp:

| File | Sai lệch |
|---|---|
| `modules/product-mgmt/ProductCatalog/ProductFilter.tsx:41` | FilterBar chưa dùng inCard/variant context |
| `modules/kkn/NotificationTemplate/TemplateTable.tsx:118` | Trạng thái dùng Tag tự cấu hình thay StatusTag |
| `modules/tools/SrsRegistries/index.tsx:127-128` | Icon sửa/xóa rời thay ActionMenu; footer Modal mặc định chưa căn giữa theo chuẩn |
| `modules/product-mgmt/ProductCatalog/ProductList.tsx:172` | Pagination helper có dùng nhưng chưa điều khiển current/pageSize/reset như Rule 9 |
| `modules/kkn/VariableRegistry/VariableTable.tsx:145` | Tương tự, pagination chỉ truyền pageSize |
| `modules/data-collection/CollectBalance/CollectBalanceDetailPage.tsx:256-277` | Lịch sử xử lý là Timeline riêng, chưa có ChangeHistoryCollapse theo Rule 8 |
| `modules/product-mgmt/ProductCatalog/ProductFormPage.tsx` | Không thấy tích hợp ChangeHistoryCollapse cho luồng xem chi tiết; cần bổ sung nguồn audit |
| `components/ui/ChangeHistoryCollapse.tsx:101-140` | Cột ngày chưa align center; username chưa nowrap |

Các đường dẫn trong bảng thuộc `frontend/src/`. Các literal màu/khoảng cách vẫn xuất hiện nhiều, kể cả trong component chung. Cần sửa theo từng nhóm, tránh thay regex toàn repo vì prop như Space.size không nhận CSS string (F01).

### F16 — P2 — Confluence nhận includeChildren nhưng không sử dụng

- `frontend/app/api/confluence/page/route.ts:78` khai báo `includeChildren`; đoạn lấy children tại `:114` trở đi luôn chạy.
- Gửi `includeChildren: false` vẫn kéo trang con. API hiện chỉ lấy một trang kết quả tối đa 50 children và 100 attachments, không theo pagination tiếp theo.
- Đề xuất: thực hiện đúng flag và xử lý pagination hoặc công khai giới hạn; thêm timeout và giới hạn byte trong lúc đọc stream. Hiện MAX_IMAGE_BYTES chỉ được kiểm tra sau khi `arrayBuffer()` đã tải hết ảnh.

### F17 — P3 — Mã dư và thiếu hàng rào kiểm tra tự động

- Chẩn đoán mở rộng: 190 TS6133 + 4 TS6192 + 1 TS6196, trong 61 file. Đây là **số diagnostic**, không phải 195 file hay chính xác 195 import.
- Ví dụ: icon dư ở navigation; `renderColumnSettings` ở CollectBalanceListPage; `getModalStats` ở SendBalance; các import dư trong SRS/Design System demo.
- Chi tiết: [typescript-unused.txt](repo-audit-2026-10-05/typescript-unused.txt).
- Lint hiện chỉ có hai warning: `IndustryAnalysis/index.tsx:133` thiếu dependency `handleBulkSendApproval`; `SrsRegistries/index.tsx:58` thiếu `searchText`. Cần xem ý đồ tìm kiếm khi nhấn nút trước khi sửa dependency, không tự động thêm để tạo request mỗi lần gõ.
- package.json chưa có script typecheck/test; không thấy workflow CI trong `.github/workflows`. Đề xuất tối thiểu thêm kiểm tra kiểu, lint và kiểm thử các ca mất dữ liệu ở F02–F04. Chẩn đoán unused là chế độ rà soát thêm, không phải tất cả đều đang làm build hiện hành lỗi.

## 3. Danh sách thừa / có thể xóa

### A. Ưu tiên dọn — bằng chứng cao

Chỉ thực hiện sau khi người dùng duyệt báo cáo và kiểm tra lại working tree; lần này **chưa xóa**.

| File/nhóm | Lý do | Điều kiện |
|---|---|---|
| `frontend/tmp/pandoc-3.10-linux-amd64.tar.gz` | Archive 34.661.245 byte (~33,1 MiB) đang tracked; Dockerfile tải riêng vào `/tmp`, không dùng file này | Xác nhận không giữ cho cài offline; thêm ignore tmp. Xóa working tree không giảm lịch sử Git cũ |
| `frontend/tsconfig.tsbuildinfo` | Cache TypeScript đang tracked, tái sinh được | Xóa khỏi tracking và ignore `*.tsbuildinfo` |
| `docs/srs-pipeline/srs-pipeline/srs/tools/__pycache__/outline.cpython-311.pyc` | Bytecode Python đang tracked, có source outline.py | Ignore `__pycache__/`, `*.pyc` |
| `package-lock.json` ở gốc repo | Lockfile chỉ có tên project, không dependency, không có package.json gốc | Giữ lockfile thật tại frontend; kiểm tra tooling ngoài repo nếu có |
| `frontend/src/modules/kkn/NotificationTemplate/TemplateForm.tsx` | Component trả null; không reachable từ entrypoint, không có import sử dụng | Giữ TemplateFormPage.tsx đang hoạt động |
| `frontend/src/modules/kkn/Notifications/NotificationDetailDrawer.tsx` | File cũ không reachable; màn hình hiện dùng NotificationInbox | Kiểm tra không có dự định khôi phục nhánh cũ |
| `frontend/src/modules/kkn/Notifications/NotificationFilter.tsx` | Không reachable/import từ luồng hiện tại | Như trên |
| `frontend/src/modules/kkn/Notifications/NotificationList.tsx` | Không reachable/import từ luồng hiện tại | Như trên |
| `frontend/src/modules/ops-support/JobManagement/modals/ColumnConfigModal.tsx` | Không reachable/import từ luồng hiện tại | Xác nhận UI chỉnh cột hiện tại đã đáp ứng chức năng |
| `frontend/src/modules/ops-support/JobManagement/utils/exportUtils.ts` | Không reachable/import; tiện ích export cũ | Kiểm tra không có consumer ngoài repo |

Phép phân tích import dùng TypeScript AST, bao gồm import/export tĩnh, dynamic import và require có string literal; lấy entrypoint page/layout/route/loading/error… làm gốc. Không chứng minh được mọi trường hợp load file theo chuỗi tính toán. Đã tìm kiếm thêm tên các ứng viên để giảm dương tính giả.

### B. Có thể xóa sau khi chốt nguồn chuẩn hoặc tương thích

| File/nhóm | Đánh giá và đề xuất |
|---|---|
| `frontend/README.md` | Nội dung mẫu “React + TypeScript + Vite”, hướng dẫn tsconfig không tồn tại; xóa hoặc thay bằng hướng dẫn frontend Next.js ngắn có link README gốc |
| `frontend/nginx/nginx.conf` | Cấu hình SPA static `try_files ... /index.html`; Docker hiện chạy Next standalone, compose không dùng nginx. Có thể xóa nếu không có deployment ngoài repo dùng file này |
| `frontend/config/cic-reference-old.docx` | Không thấy code tham chiếu; loader chỉ dùng cic-reference.docx hoặc example. Lưu archive ngoài runtime nếu cần đối chiếu trước khi xóa |
| `frontend/scripts/refactor.cjs` | Script migration chưa tracked, thay thế hàng loạt bằng regex, không nằm trong npm scripts. Chỉ xóa sau khi tác giả xác nhận migration xong; không chạy lại để dọn |
| `frontend/app/ops-support/notification-template/new/page.tsx` | Trùng chức năng `/create`, cùng render TemplateFormPage; luồng trong app đang dẫn `/create`. Nên redirect để giữ bookmark, rồi cân nhắc bỏ route theo chính sách tương thích |
| Dependency `cronstrue` | Không thấy import/reference ngoài manifest/lock; cronUtils tự mô tả cron. Ứng viên bỏ dependency và cập nhật lockfile |
| Dependency `react-js-cron` | Không thấy component dùng nhưng globals.css còn import stylesheet và override `.react-js-cron*`; chỉ bỏ cùng CSS không còn dùng, sau kiểm thử form Job |
| `docs/srs-pipeline/SRS-Template-v0.8/CHILD_TEMPLATE_*` | 10 file (5 docx + 5 md) trùng byte với `docs/srs-pipeline/srs-pipeline/srs/templates/`; chọn một nguồn chuẩn, sửa đường dẫn tài liệu trước khi bỏ một bộ |
| `docs/srs-pipeline/srs-pipeline.zip` | Có cây giải nén cùng tên; ứng viên archive trùng mục đích, **chưa so sánh từng entry ZIP**, không kết luận trùng hoàn toàn |
| `docs/specifications/backup/` | Tài liệu phiên bản cũ; có giá trị truy vết nghiệp vụ. Chốt chính sách lưu lịch sử rồi mới bỏ, không xóa vì tên backup |

### C. Nên gộp logic, không xóa nguyên file

- `ConfluenceImporter`, `ConfluenceToWord`, `SrsConfluenceImporter` lặp logic đọc/lưu/xóa PAT và fullname trong localStorage. Tách hook dùng chung; giữ ba luồng nghiệp vụ.
- `frontend/app/api/ai/generate/route.ts` và `srs-v4-generate/route.ts` đều triển khai adapter gọi các provider. Nên tách phần transport/auth/error chung; giữ khác biệt prompt/schema của hai API.
- Hai filenameMap GET/POST trong API registries: đưa thành constant và schema chung.
- Các import/biến không dùng trong phụ lục: dọn theo module, giữ nguyên side effect cần thiết và chạy typecheck/lint sau mỗi nhóm.
- Bảng màu cũ trong globals.css, tokens demo và theme overrides: chỉ xóa sau khi đối chiếu toàn bộ consumer và tài liệu nguồn chuẩn.

### D. Chưa nên xóa

- `AGENTS.md` và `CLAUDE.md`: hai entrypoint hướng dẫn theo chủ đích. Diff hiện tại chỉ khác tên agent và liên kết qua lại; quy tắc tương ứng vẫn đồng bộ. Vấn đề là cả hai cần cập nhật hợp đồng token, không phải bỏ một bản.
- `frontend/src/types/turndown-plugin-gfm.d.ts`: khai báo ambient được TypeScript include tự động, không có import trực tiếp vẫn có tác dụng.
- `react-dom`, `sass`, `@ant-design/cssinjs`: không kết luận thừa từ đồ thị import. react-dom phục vụ framework; SCSS đang được import; cssinjs là peer của registry. Đang có cssinjs 2.x trực tiếp và antd yêu cầu 1.x, nên kiểm thử SSR style riêng trước khi thay đổi.
- `frontend/config/outline.json`: trùng byte với bản pipeline nhưng là bản phân phối runtime loader đang đọc; cần cơ chế sync/check hash, không xóa chỉ vì trùng.
- Template ở `frontend/config/templates`, `common`, các file `_normalized.docx` và `_source_template.docx`: là đầu vào/tài sản pipeline. Một số script dùng chúng; bản runtime cũng **không nằm trong 10 cặp trùng byte** nêu trên.
- Các bộ `.puml/.svg/.png`: nguồn sơ đồ và bản render có mục đích khác nhau; chỉ bỏ định dạng khi kiểm tra tài liệu tiêu thụ.
- mockData, kho localStorage và module `_store`: đang cung cấp dữ liệu cho các chức năng hiện tại. Cần thay bằng API/storage thật trước; ví dụ ProductCatalog mất thay đổi khi reload do store trong bộ nhớ.
- `.agents`, `.claude`, `.github/instructions`, `.stitch`: công cụ/quy trình và nguồn thiết kế, không phải rác chỉ vì không được app import. Nội dung cần người sở hữu chốt trước khi loại.

## 4. Thứ tự xử lý đề nghị

1. **Khóa các lỗi dữ liệu và typecheck:** F01–F04, F08, F12; viết kiểm thử cho sửa/xóa trang 2, lưu sau tìm kiếm, xóa cuối cùng và CSV round-trip.
2. **Kiểm tra khả năng triển khai:** F05–F10; xác minh SSO/gateway thực tế, config mount, secret build context và quyền ghi dữ liệu.
3. **Dọn nhóm A:** từng nhóm nhỏ, giữ nguyên các thay đổi chưa commit hiện có; không chạy script refactor toàn repo.
4. **Đồng bộ design system và tài liệu:** F13–F15, README frontend, menu chưa triển khai; chốt nguồn template trước khi bỏ bản sao.
5. **Dọn dependency/logic trùng:** nhóm B/C; cập nhật lockfile từ manifest, kiểm tra build và các luồng Job/Confluence/Word.

Tiêu chí nghiệm thu cho đợt sửa sau: typecheck không lỗi; lint không phát sinh lỗi/cảnh báo mới; ca registry không mất/sai bản ghi; không giả dữ liệu audit; build Docker chạy được với config an toàn; danh sách file đã xóa có lý do và không phá đường dẫn sử dụng. Báo cáo này chưa xác nhận hệ thống sẵn sàng production.

## 5. Phụ lục kiểm tra

- [Danh sách 181 đường dẫn chưa có page](repo-audit-2026-10-05/missing-routes.txt).
- [Toàn bộ chẩn đoán TypeScript mở rộng](repo-audit-2026-10-05/typescript-unused.txt).
- Lệnh kiểm tra chính chạy trong frontend: `node node_modules/typescript/bin/tsc --noEmit --incremental false`; `node node_modules/next/dist/bin/next lint --no-cache`.
- Kiểm tra unused bổ sung: TypeScript với `--noUnusedLocals --noUnusedParameters`, không emit/cache. Phụ lục được sinh lại bằng TypeScript compiler API với cùng tùy chọn.
- So sánh bản sao bằng SHA-256; kiểm tra route bằng đường dẫn file App Router; kiểm tra CSV bằng thực thi độc lập hai hàm hiện tại trên dữ liệu giả trong bộ nhớ.

**Các file được tạo trong lần rà soát:** báo cáo Markdown này và hai phụ lục text. Không có thay đổi sửa/xóa đối với mã nguồn được đề xuất trong báo cáo.
