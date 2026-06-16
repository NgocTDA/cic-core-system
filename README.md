# CIC Core System

CIC Core System là ứng dụng quản lý thông tin tín dụng nội bộ, tập trung vào các nghiệp vụ thu thập dữ liệu, quản lý kênh kết nối, tạo lập sản phẩm, hỗ trợ vận hành, báo cáo thống kê và quản trị dữ liệu.

Dự án hiện tại là ứng dụng web frontend được xây dựng bằng Next.js 14 App Router, TypeScript và Ant Design 5, kèm hệ thống thiết kế riêng để đảm bảo giao diện nhất quán trên toàn hệ thống.

## Mục Lục

- [Tính năng chính](#tính-năng-chính)
- [Kiến trúc tổng quan](#kiến-trúc-tổng-quan)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt và chạy local](#cài-đặt-và-chạy-local)
- [Chạy bằng Docker](#chạy-bằng-docker)
- [Quy ước phát triển](#quy-ước-phát-triển)
- [Tài liệu liên quan](#tài-liệu-liên-quan)

## Tính Năng Chính

Hệ thống được chia theo các subsystem nghiệp vụ:

| Phân hệ | Mô tả |
| --- | --- |
| KKN | Quản lý kênh kết nối, cấu hình kết nối, nhật ký trao đổi và tổng hợp dữ liệu |
| Thu thập, xử lý dữ liệu | Thu thập báo cáo, xử lý dữ liệu, đối chiếu, quản lý mã CIC và kho dữ liệu |
| Quản lý, tạo lập sản phẩm | Quản lý danh mục, sản phẩm định kỳ, sản phẩm theo yêu cầu và quy tắc tạo lập |
| Hỗ trợ vận hành | Quản trị hệ thống, người dùng, job, thông báo, cấu hình và tra soát |
| Báo cáo thống kê | Dashboard, báo cáo nghiệp vụ, báo cáo theo yêu cầu, mẫu báo cáo và lịch chạy |
| Quản trị dữ liệu | Quản lý metadata, data asset, lineage, data quality và đồng bộ quản trị dữ liệu |
| Web Portal | Cổng giao tiếp cho TCTD gửi báo cáo, khai thác sản phẩm, tra soát và quản trị tài khoản |
| Công cụ nội bộ | Các công cụ hỗ trợ nội bộ, hiện có UI Doc Generator |
| Design System | Khu vực demo, tra cứu component và design token của hệ thống |

## Kiến Trúc Tổng Quan

Ứng dụng sử dụng Next.js App Router trong `frontend/app` và tách logic giao diện, nghiệp vụ vào `frontend/src`.

Luồng render chính:

```text
URL
  -> Next.js App Router
  -> RootLayout
  -> ClientLayout
  -> Các provider + Ant Design ConfigProvider
  -> Khung ứng dụng nội bộ hoặc khung portal
  -> Page module
```

Thành phần kiến trúc quan trọng:

- `ClientLayout`: bọc ứng dụng bằng `ConfigProvider`, `SubSystemProvider`, `RoleProvider` và `HeaderProvider`.
- `AppHeader` và `AppSidebar`: khung ứng dụng cho các màn hình nghiệp vụ nội bộ.
- `PortalHeader` và `PortalMenu`: khung ứng dụng riêng cho Web Portal.
- `SubSystemContext`: quản lý phân hệ đang active và menu tương ứng.
- `HeaderContext`: quản lý tiêu đề và các nút thao tác của từng page.
- `useHeaderActions`: hook để page đăng ký tiêu đề và thao tác lên header.
- `frontend/src/design-system`: nguồn gốc cho tokens và Ant Design theme.
- `frontend/src/components/ui`: bộ shared UI components dùng chung cho các page list/form/table.
- `frontend/app/api/ai/*`: route handler phục vụ các tính năng AI và sinh tài liệu.

## Công Nghệ Sử Dụng

| Nhóm | Công nghệ |
| --- | --- |
| Framework | Next.js 14 App Router |
| Ngôn ngữ | TypeScript, React 18 |
| UI | Ant Design 5, Ant Design Icons |
| Styling | Tailwind CSS, SCSS, design tokens |
| State | React Context |
| Chart | Recharts |
| Tài liệu | docx-preview, docx-templates |
| Build | Next.js standalone output |
| Môi trường chạy | Node.js 20 |
| Container | Docker, Docker Compose |

## Cấu Trúc Thư Mục

```text
.
├── docs/                         # Tài liệu nghiệp vụ, menu, design system, architecture
├── frontend/                     # Ứng dụng frontend Next.js
│   ├── app/                      # App Router pages, layouts, API route handlers
│   ├── config/                   # File mẫu cấu hình runtime
│   ├── public/                   # Static assets
│   ├── scripts/                  # Scripts hỗ trợ dev/build
│   └── src/
│       ├── components/           # Component global và shared UI
│       ├── config/               # Cấu hình navigation và phân hệ
│       ├── context/              # React Context providers
│       ├── design-system/        # Tokens và Ant Design theme
│       ├── hooks/                # Custom hook
│       ├── layouts/              # App/portal layout components
│       ├── modules/              # Module tính năng theo phân hệ
│       ├── services/             # Client/server service helpers
│       └── types/                # Shared TypeScript types
├── AGENTS.md                     # Hướng dẫn làm việc cho Codex
├── CLAUDE.md                     # Hướng dẫn làm việc cho Claude Code
├── docker-compose.yml            # Cấu hình chạy frontend container
└── README.md
```

## Cài Đặt Và Chạy Local

Yêu cầu:

- Node.js 20+
- npm

Cài đặt dependencies:

```bash
cd frontend
npm install
```

Chạy development server:

```bash
npm run dev
```

Ứng dụng mặc định chạy tại:

```text
http://localhost:3000
```

Build production:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Cấu Hình AI/Doc Generator

Một số route trong `frontend/app/api/ai/*` đọc cấu hình runtime từ thư mục `frontend/config`.

Tạo file cấu hình từ file mẫu khi cần dùng tính năng AI:

```bash
cd frontend
cp config/ai-providers.example.json config/ai-providers.json
cp config/srs-prompt.example.md config/srs-prompt.md
```

Cập nhật API key/model trong `ai-providers.json`. Không commit file cấu hình chứa thông tin bí mật.

## Chạy Bằng Docker

Build và chạy container:

```bash
docker compose up --build
```

Docker Compose expose frontend tại:

```text
http://localhost:8700
```

Container mount `./frontend/config` vào `/app/config:ro`, vì vậy có thể cập nhật cấu hình provider/prompt trên host mà không cần build lại image.

## Quy Ước Phát Triển

- App Router nằm trong `frontend/app`, không nằm trong `frontend/src/app`.
- Dùng path alias `@/` cho `frontend/src`.
- Tất cả giá trị hiển thị phải đi qua `frontend/src/design-system/tokens.ts`.
- Page list/table dùng shared components trong `@/components/ui`.
- Pagination dùng `tablePagination()`.
- Header title/actions đăng ký bằng `useHeaderActions`.
- Menu/phân hệ khai báo tập trung trong `frontend/src/config/navigation.tsx`.
- Khi cập nhật menu, đồng bộ lại `docs/menu.md`.
- Khi thêm token mới, cập nhật `docs/design-system/tokens.md`.

## Tài Liệu Liên Quan

- [Architecture](docs/architecture/README.md)
- [Menu structure](docs/menu.md)
- [Design System](docs/design-system/README.md)
- [Design Tokens](docs/design-system/tokens.md)
- [Components](docs/design-system/components.md)
- [Page Patterns](docs/design-system/patterns.md)
