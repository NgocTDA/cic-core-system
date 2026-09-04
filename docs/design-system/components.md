# UI Components — API Reference

> Source: `frontend/src/components/ui/`
> Import: `import { ... } from '@/components/ui'`

---

## PageLayout

Wrapper chuẩn cho mọi page — xử lý padding responsive và flex layout cho table pages.

```tsx
import { PageLayout } from '@/components/ui';

<PageLayout>
  {/* FilterBar, SectionCard, ... */}
</PageLayout>

// Không có padding (ví dụ: full-bleed content)
<PageLayout noPadding>...</PageLayout>
```

**Props:**

| Prop | Type | Default | Mô tả |
|---|---|---|---|
| `noPadding` | `boolean` | `false` | Tắt padding (dùng cho full-bleed layout) |

**Output style:** `padding: 16px 24px 24px` (desktop), `8px` (mobile), `flex-direction: column`, `flex: 1`, `overflow: hidden`.

---

## FilterBar + FilterCol

Filter row chuẩn với action buttons phải (Thêm bộ lọc / Reset / Tìm kiếm) tự động.

```tsx
import { FilterBar, FilterCol } from '@/components/ui';
import { Input, Select, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

<FilterBar onSearch={handleSearch} onReset={handleReset}>
  <FilterCol>
    <Input placeholder="Tên tệp" allowClear />
  </FilterCol>
  <FilterCol>
    <Select placeholder="Chọn mã CNTCTD" style={{ width: '100%' }} allowClear />
  </FilterCol>
  <FilterCol minWidth={240}>
    <RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} />
  </FilterCol>
</FilterBar>

// Wrapped trong Card (giống JobFilter / TemplateFilter pattern):
<FilterBar inCard onSearch={fn} onReset={fn}>
  ...
</FilterBar>
```

**FilterBar Props:**

| Prop | Type | Default | Mô tả |
|---|---|---|---|
| `onSearch` | `() => void` | — | Handler Tìm kiếm button |
| `onReset` | `() => void` | — | Handler Reset button (ẩn nếu không truyền) |
| `loading` | `boolean` | `false` | Loading state cho Search button |
| `inCard` | `boolean` | `false` | Wrap trong `Card` với shadow xs |
| `extra` | `ReactNode` | — | Slot thêm button trước Search (hiếm dùng) |
| `showAddFilter` | `boolean` | `true` | Hiển thị nút "Thêm bộ lọc". Đặt `false` khi filter đơn giản không cần filter nâng cao. |

**FilterCol Props:**

| Prop | Type | Default | Mô tả |
|---|---|---|---|
| `minWidth` | `number` | `160` | `flex: 1 1 {minWidth}px` |
| `maxWidth` | `number` | — | Giới hạn chiều rộng tối đa |

---

## SectionCard

Card wrapper cho data section — thường chứa Table. Hỗ trợ full-height stretch.

```tsx
import { SectionCard } from '@/components/ui';

// Đơn giản:
<SectionCard>
  <Table ... />
</SectionCard>

// Với title + count:
<SectionCard title="Danh sách tác vụ" count={filteredJobs.length}>
  <Table ... />
</SectionCard>

// Full-height (table trong PageLayout):
<SectionCard flex>
  <Table scroll={{ y: 'calc(100vh - 320px)' }} ... />
</SectionCard>

// Với extra actions ở header:
<SectionCard
  title="Danh sách"
  count={total}
  extra={<Radio.Group ...>Danh sách / Hộp thư</Radio.Group>}
  flex
>
  <Table ... />
</SectionCard>
```

**Props:**

| Prop | Type | Default | Mô tả |
|---|---|---|---|
| `title` | `string` | — | Tiêu đề — tự động uppercase |
| `count` | `number \| string` | — | Hiển thị `TITLE (N)` |
| `extra` | `ReactNode` | — | Slot header bên phải |
| `flex` | `boolean` | `false` | `flex: 1` cho full-height layout |
| `noPadding` | `boolean` | `false` | Xoá body padding |

---

## StatusSummaryBar

Hàng badge đếm theo trạng thái — thường đặt giữa FilterBar và SectionCard.

```tsx
import { StatusSummaryBar } from '@/components/ui';

<StatusSummaryBar
  items={[
    { count: 18, label: 'Hồ sơ lỗi/xem xét',        color: 'error'   },
    { count: 0,  label: 'Hồ sơ tất toán, đóng thẻ', color: 'info',   onClick: () => setFilter('closed') },
    { count: 0,  label: 'Hồ sơ nghi ngờ sai lệnh',  color: 'warning' },
  ]}
/>

// Align trái:
<StatusSummaryBar items={...} align="left" />
```

**Props:**

| Prop | Type | Default | Mô tả |
|---|---|---|---|
| `items` | `SummaryItem[]` | — | Danh sách badges |
| `align` | `'left' \| 'right' \| 'center'` | `'right'` | Căn chỉnh |

**SummaryItem:**

| Field | Type | Mô tả |
|---|---|---|
| `count` | `number \| string` | Số hiển thị (bold) |
| `label` | `string` | Label sau số |
| `color` | `'error' \| 'warning' \| 'info' \| 'success'` | Màu nền |
| `onClick` | `() => void` | Filter handler (optional) |

---

## StatusTag

Tag với màu và label định nghĩa sẵn cho 17 status values phổ biến.

```tsx
import { StatusTag } from '@/components/ui';

<StatusTag status="ACTIVE" />           // → "Hoạt động" (green)
<StatusTag status="FAILED" />           // → "Lỗi" (red)
<StatusTag status="PENDING" />          // → "Chờ duyệt" (yellow)
<StatusTag status="VALID" />            // → "Hợp lệ" (green)

// Override label:
<StatusTag status="ACTIVE" label="Đang phát hành" />

// Thêm min-width (để các tag cùng cột bằng nhau):
<StatusTag status="RUNNING" minWidth={100} />
```

**Predefined statuses (sử dụng palette hữu cơ `colors.statusTag`):**

| Status | Role / Palette | Label mặc định |
|---|---|---|
| `ACTIVE` | `active` (xanh ngọc nhạt) | Hoạt động |
| `INACTIVE` | `neutral` (xám rêu nhạt) | Ngừng hoạt động |
| `RUNNING` | `processing` (xanh dương nhạt) | Đang chạy |
| `IDLE` | `neutral` | Chờ (Idle) |
| `SCHEDULED` | `warning` (vàng hổ phách nhạt) | Đã đặt lịch |
| `FAILED` | `error` (đỏ cam nhạt) | Lỗi |
| `PAUSED` | `warning` | Tạm dừng |
| `PENDING` | `warning` | Chờ duyệt |
| `APPROVED` | `active` | Đã duyệt |
| `REJECTED` | `error` | Từ chối |
| `UNREAD` | `error` | Chưa đọc |
| `READ` | `neutral` | Đã đọc |
| `VALID` | `active` | Hợp lệ |
| `INVALID` | `error` | Không hợp lệ |
| `ERROR` | `error` | Hồ sơ lỗi |
| `REVIEWING` | `warning` | Đang xem xét |
| `CLOSED` | `neutral` | Đã đóng |

> Nếu cần status không có trong list, truyền string tuỳ ý — StatusTag sẽ render `neutral` role với label là chính string đó.

---

## ActionMenu

Dropdown ba chấm `⋯` chuẩn cho cột Thao tác của mọi table.

```tsx
import { ActionMenu } from '@/components/ui';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Trong column definition:
{
  title: 'Thao tác',
  key: 'action',
  width: 80,
  align: 'center',
  fixed: 'right',
  render: (_, record) => (
    <ActionMenu items={[
      { key: 'view',   label: 'Xem chi tiết',   icon: <EyeOutlined />,    onClick: () => onView(record) },
      { key: 'edit',   label: 'Chỉnh sửa',       icon: <EditOutlined />,   onClick: () => onEdit(record) },
      { type: 'divider' },
      { key: 'delete', label: 'Xóa',             icon: <DeleteOutlined />, danger: true, onClick: () => onDelete(record.id) },
    ]} />
  ),
}
```

**Props:**

| Prop | Type | Mô tả |
|---|---|---|
| `items` | `MenuProps['items']` | Ant Design menu items (hỗ trợ `type: 'divider'`, `danger`, `disabled`) |
| `size` | `'small' \| 'middle'` | Kích thước button |

> `e.stopPropagation()` đã được xử lý bên trong — không cần viết thêm.

---

## CodeText

Hiển thị mã, ID, tên biến bằng monospace font + màu primary.

```tsx
import { CodeText } from '@/components/ui';

// ID / Mã tham chiếu
<CodeText>JOB-2024-001</CodeText>

// Template variable: hiển thị {{varName}}
<CodeText template>customerName</CodeText>  // → {{customerName}}

// Version / path (secondary color, không bold):
<CodeText muted>v1.1.0-alpha</CodeText>
```

**Props:**

| Prop | Type | Default | Mô tả |
|---|---|---|---|
| `template` | `boolean` | `false` | Bọc nội dung trong `{{...}}` |
| `muted` | `boolean` | `false` | Secondary color thay vì primary blue |

---

## tablePagination()

Helper tạo config phân trang chuẩn cho mọi Table.

```tsx
import { tablePagination } from '@/components/ui';

<Table pagination={tablePagination()} ... />

// Override options:
<Table pagination={tablePagination({ pageSize: 50, total: serverTotal })} ... />
```

**Output mặc định:**

```ts
{
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng ${total} bản ghi`,
  pageSizeOptions: ['10', '20', '50', '100'],
  pageSize: 20,
  locale: {
    jump_to: 'Đến trang',  // Quick jumper hiển thị: "Đến trang [ô nhập]"
    page: '',
  },
}
```

---

## ChangeHistoryCollapse

Bảng thống kê Lịch sử thay đổi (Audit log) chuẩn cho mọi màn hình Xem chi tiết. Bọc trong `<Collapse>` thu gọn mặc định.

```tsx
import { ChangeHistoryCollapse } from '@/components/ui';

<ChangeHistoryCollapse data={historyList} />
```

**Props:**

| Prop | Type | Default | Mô tả |
|---|---|---|---|
| `data` | `IChangeHistoryItem[]` | `[]` | Danh sách lịch sử tác động thay đổi |
| `defaultActive` | `boolean` | `false` | Mở sẵn Panel nếu `true` |

**Cấu trúc 8 cột chuẩn:**
1. `STT` (50px, align center)
2. `Thời gian` (170px): `dd/mm/yyyy` (hover hiển thị `dd/mm/yyyy hh:mm:ss`)
3. `Người cập nhật` (160px): `username` (hover hiển thị họ tên đầy đủ)
4. `Hành động` (140px): Tên thao tác nghiệp vụ
5. `Giá trị cũ` (220px): Thông số trước thay đổi
6. `Giá trị mới` (220px): Thông số mới sau thay đổi
7. `Địa chỉ IP` (130px): IP thiết bị truy cập
8. `Mô tả` (240px): Lý do/ghi chú/tệp đính kèm (> 2 dòng hiển thị "..." kèm nút "Xem tiếp")

---

## ContextBanner

Băng hiển thị ngữ cảnh không gian làm việc, dự án hoặc đơn vị báo cáo/ngân hàng đang chọn. Nền màu xanh xám dịu `colors.bg.context` (`#edf3ed`), viền nhẹ `colors.border.base` (`#d8e0dc`), bo góc `radius.md`.

```tsx
import { ContextBanner } from '@/components/ui';

<ContextBanner
  label="Không gian vận hành"
  value="OPS · Vận hành Hệ thống & Lập lịch Tác vụ"
  action={{
    label: 'Làm mới phiên',
    onClick: handleRefresh,
  }}
  note="Quyền thực thi tác vụ và cập nhật biểu thức Cron được kiểm soát tự động theo vai trò hiện tại trong phiên làm việc."
/>
```

**Props:**

| Prop | Type | Default | Mô tả |
|---|---|---|---|
| `label` | `ReactNode` | — | Tiêu đề/nhãn ngữ cảnh (vd "Dự án hiện tại", "Không gian vận hành") |
| `value` | `ReactNode` | — | Giá trị chính hoặc tên phạm vi |
| `action` | `{ label: string, onClick?: () => void, icon?: ReactNode, loading?: boolean }` | — | Cấu hình nút bấm thao tác phụ (outline button) |
| `note` | `ReactNode` | — | Dòng ghi chú giải thích quyền/hướng dẫn mờ bên dưới |
| `children` | `ReactNode` | — | Custom controls bổ sung (ví dụ dropdown Select chọn đơn vị) |

---

## MetricSummaryBar

Băng đo lường chỉ số 4 cột (hoặc N cột) tinh gọn hiển thị ở đầu trang danh mục hoặc trên bảng dữ liệu. Nền trắng `colors.bg.container`, viền `colors.border.base`, vách ngăn giữa các cột `1px solid #d8e0dc`, nhãn chỉ số nhỏ `#64746d`, con số thống kê to đậm `#18312a`. Tự động co giãn 2 cột trên màn hình nhỏ.

```tsx
import { MetricSummaryBar } from '@/components/ui';

<MetricSummaryBar
  items={[
    { label: 'TỔNG SỐ JOB', value: 48 },
    { label: 'ĐANG KÍCH HOẠT', value: 42, color: '#18312a' },
    { label: 'TẠM DỪNG', value: 6, color: '#64746d' },
    { label: 'KÍCH HOẠT GẦN NHẤT', value: 'Hôm nay', color: '#2a765b' },
  ]}
/>
```

**Props:**

| Prop | Type | Default | Mô tả |
|---|---|---|---|
| `items` | `MetricItem[]` | `[]` | Mảng các chỉ số đo lường (`label`, `value`, `subText`, `color`, `onClick`, `active`) |
| `columns` | `number` | `4` | Số cột chia đều trên Desktop (mặc định 4) |
| `style` | `CSSProperties` | — | Custom inline style |


