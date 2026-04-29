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

**Predefined statuses:**

| Status | Màu | Label mặc định |
|---|---|---|
| `ACTIVE` | success | Hoạt động |
| `INACTIVE` | default | Vô hiệu hóa |
| `RUNNING` | processing | Đang chạy |
| `IDLE` | default | Chờ (Idle) |
| `SCHEDULED` | warning | Đã đặt lịch |
| `FAILED` | error | Lỗi |
| `PAUSED` | warning | Tạm dừng |
| `PENDING` | warning | Chờ duyệt |
| `APPROVED` | success | Đã duyệt |
| `REJECTED` | error | Từ chối |
| `UNREAD` | error | Chưa đọc |
| `READ` | default | Đã đọc |
| `VALID` | success | Hợp lệ |
| `INVALID` | error | Không hợp lệ |
| `ERROR` | error | Hồ sơ lỗi |
| `REVIEWING` | warning | Đang xem xét |
| `CLOSED` | default | Đã đóng |

> Nếu cần status không có trong list, truyền string tuỳ ý — StatusTag sẽ render `default` color với label là chính string đó.

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
}
```
