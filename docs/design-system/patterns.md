# Page Patterns — Templates & Examples

Đây là các template đầy đủ cho từng loại page. Copy và điều chỉnh theo domain.

---

## Pattern 1: List Page (Table + Filter + Summary)

Dùng cho: XLDL Định kỳ, XLDL Hồ sơ lỗi, Danh sách tài sản, Quản lý Job, ...

```tsx
'use client';
import React, { useState } from 'react';
import { Table, Input, Select, DatePicker } from 'antd';
import type { TableProps } from 'antd';
import {
  EyeOutlined, EditOutlined, DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  PageLayout, FilterBar, FilterCol, SectionCard,
  StatusSummaryBar, StatusTag, ActionMenu, CodeText,
  tablePagination,
} from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';

const { RangePicker } = DatePicker;

// ─── Types ───────────────────────────────────────────────────

interface DataRecord {
  id: string;
  reportDate: string;
  fileName: string;
  customerCode: string;
  customerName: string;
  dataType: string;
  status: string;
  processor: string;
}

// ─── Mock data (xoá khi có API) ──────────────────────────────

const MOCK_DATA: DataRecord[] = [];

// ─── Page Component ──────────────────────────────────────────

const ListPage: React.FC = () => {
  const [data] = useState<DataRecord[]>(MOCK_DATA);
  const [loading, setLoading] = useState(false);

  // Đăng ký title + header actions
  useHeaderActions({
    title: 'Kiểm tra, xử lý dữ liệu định kỳ có cấu trúc xác định',
    actions: [{ key: 'common', label: '', icon: null, onClick: () => {} }],
  }, []);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500); // thay bằng API call thực
  };

  const handleReset = () => {
    // reset filter state
  };

  // ─── Table columns ───────────────────────────────────────

  const columns: TableProps<DataRecord>['columns'] = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Ngày Báo Cáo',
      dataIndex: 'reportDate',
      key: 'reportDate',
      width: 130,
      sorter: true,
    },
    {
      title: 'Tên Tệp',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 220,
      render: (text) => <CodeText>{text}</CodeText>,
    },
    {
      title: 'Mã KH',
      dataIndex: 'customerCode',
      key: 'customerCode',
      width: 180,
      render: (text) => <CodeText>{text}</CodeText>,
    },
    {
      title: 'Tên Khách Hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      ellipsis: true,
    },
    {
      title: 'Loại Dữ Liệu',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 120,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: 'Cán Bộ Xử Lý',
      dataIndex: 'processor',
      key: 'processor',
      width: 140,
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <ActionMenu items={[
          { key: 'view',   label: 'Xem chi tiết', icon: <EyeOutlined />,    onClick: () => {} },
          { key: 'edit',   label: 'Chỉnh sửa',    icon: <EditOutlined />,   onClick: () => {} },
          { type: 'divider' },
          { key: 'delete', label: 'Xóa',          icon: <DeleteOutlined />, danger: true, onClick: () => {} },
        ]} />
      ),
    },
  ];

  // ─── Render ──────────────────────────────────────────────

  return (
    <PageLayout>
      {/* 1. Filter Bar */}
      <FilterBar onSearch={handleSearch} onReset={handleReset} loading={loading}>
        <FilterCol>
          <Input placeholder="Tên tệp" allowClear />
        </FilterCol>
        <FilterCol>
          <Select placeholder="Chọn mã CNTCTD" style={{ width: '100%' }} allowClear />
        </FilterCol>
        <FilterCol>
          <Select placeholder="Chọn loại dữ liệu" style={{ width: '100%' }} allowClear />
        </FilterCol>
        <FilterCol minWidth={240}>
          <RangePicker style={{ width: '100%' }} placeholder={['Từ ngày', 'Đến ngày']} />
        </FilterCol>
      </FilterBar>

      {/* 2. Status Summary Bar */}
      <StatusSummaryBar
        items={[
          { count: 18, label: 'Hồ sơ lỗi/xem xét',        color: 'error'   },
          { count: 0,  label: 'Hồ sơ tất toán, đóng thẻ', color: 'info'    },
          { count: 0,  label: 'Hồ sơ nghi ngờ sai lệnh',  color: 'warning' },
        ]}
      />

      {/* 3. Data Table */}
      <SectionCard flex>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          size="middle"
          loading={loading}
          pagination={tablePagination()}
          scroll={{ x: 1400, y: 'calc(100vh - 380px)' }}
          onRow={(record) => ({
            onClick: () => {},
            style: { cursor: 'pointer' },
          })}
        />
      </SectionCard>
    </PageLayout>
  );
};

export default ListPage;
```

---

## Pattern 2: List Page đơn giản (không có Summary Bar)

Dùng cho: Notification Template, Variable Registry, Job Management, ...

```tsx
'use client';
import React, { useState } from 'react';
import { Table, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  PageLayout, FilterBar, FilterCol, SectionCard,
  StatusTag, ActionMenu, CodeText, tablePagination,
} from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';

const SimplePage: React.FC = () => {
  const [data] = useState([]);

  useHeaderActions({
    title: 'Tên Trang',
    actions: [
      {
        key: 'add',
        label: 'Thêm mới',
        icon: <PlusOutlined />,
        type: 'primary',
        onClick: () => {},
      },
    ],
  }, []);

  return (
    <PageLayout>
      {/* Filter */}
      <FilterBar inCard onSearch={() => {}} onReset={() => {}}>
        <FilterCol>
          <Input placeholder="Từ khóa" allowClear />
        </FilterCol>
        <FilterCol>
          <Select placeholder="Trạng thái" style={{ width: '100%' }} allowClear />
        </FilterCol>
      </FilterBar>

      {/* Table */}
      <SectionCard title="Danh sách" count={data.length}>
        <Table
          columns={[]}
          dataSource={data}
          rowKey="id"
          size="middle"
          pagination={tablePagination({ pageSize: 10 })}
          scroll={{ x: 900 }}
        />
      </SectionCard>
    </PageLayout>
  );
};

export default SimplePage;
```

---

## Pattern 3: Detail / Form Page

Dùng cho: Xem chi tiết hồ sơ, tạo/sửa job, ...

```tsx
'use client';
import React from 'react';
import { Card, Form, Input, Button, Space, Descriptions, Tag } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageLayout, StatusTag } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const DetailPage: React.FC = () => {
  const router = useRouter();

  useHeaderActions({
    title: 'Chi tiết hồ sơ',
    actions: [
      { key: 'back', label: 'Quay lại', icon: <ArrowLeftOutlined />, onClick: () => router.back() },
    ],
  }, []);

  return (
    <PageLayout>
      {/* Thông tin cơ bản */}
      <Card
        bordered={false}
        title="Thông tin hồ sơ"
        style={{ marginBottom: spacing[4] }}
      >
        <Descriptions column={2} bordered size="middle">
          <Descriptions.Item label="Mã hồ sơ">HS-2024-001</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <StatusTag status="PENDING" />
          </Descriptions.Item>
          {/* ... */}
        </Descriptions>
      </Card>

      {/* Form chỉnh sửa */}
      <Card bordered={false} title="Cập nhật thông tin">
        <Form layout="vertical">
          <Form.Item label="Tên khách hàng" name="customerName">
            <Input />
          </Form.Item>
          {/* ... */}
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <Button type="primary" icon={<SaveOutlined />}>Lưu</Button>
              <Button onClick={() => router.back()}>Huỷ</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </PageLayout>
  );
};

export default DetailPage;
```

---

## Cấu trúc thư mục chuẩn cho một feature

```
modules/<subsystem>/<FeatureName>/
├── index.tsx              ← Container: useHeaderActions + layout
├── <Feature>Filter.tsx    ← FilterBar + FilterCol
├── <Feature>List.tsx      ← Table + columns + ActionMenu + StatusTag
├── <Feature>DetailPage.tsx ← Detail / form (nếu cần)
├── <Feature>Drawer.tsx    ← Drawer chi tiết (nếu cần)
├── use<Feature>.ts        ← Business logic, state, filter state
├── <feature>Types.ts      ← TypeScript interfaces
└── mockData.ts            ← Mock data (xoá khi có API thật)
```

---

## Checklist khi tạo page mới

- [ ] Dùng `<PageLayout>` làm wrapper ngoài cùng
- [ ] Đăng ký title qua `useHeaderActions({ title: '...' })`
- [ ] Filter dùng `<FilterBar>` + `<FilterCol>` (không tự build Row/Col)
- [ ] Table action column dùng `<ActionMenu>` (không tự build Dropdown)
- [ ] Status column dùng `<StatusTag>` (không tự map màu)
- [ ] Code/ID column dùng `<CodeText>` (không hardcode `fontFamily: 'monospace'`)
- [ ] Pagination dùng `tablePagination()` (không tự viết `showTotal`)
- [ ] Không hardcode màu — dùng `colors.*` từ `@/design-system`
