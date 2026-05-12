'use client';

import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, Table, Typography, Space, Tag, Divider, Drawer, Tooltip, notification } from 'antd';
import { PlusOutlined, HistoryOutlined, EyeOutlined } from '@ant-design/icons';
import ComponentShowcase from '../../ComponentShowcase';
import { StatusTag } from '@/components/ui';
import { colors, typography, spacing, radius } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const HISTORY_DATA = [
    { id: 1, time: '01/03/2025 09:15:30', user: 'nguyenvana', action: 'Thêm mới',    oldValue: '',           newValue: 'ACTIVE',   ip: '10.0.1.5', note: 'Tạo mới bản ghi ban đầu' },
    { id: 2, time: '05/03/2025 14:22:10', user: 'tranthib',   action: 'Cập nhật',    oldValue: 'ACTIVE',     newValue: 'INACTIVE', ip: '10.0.1.8', note: 'Tạm thời vô hiệu hóa để bảo trì' },
    { id: 3, time: '10/03/2025 11:05:45', user: 'lethic',     action: 'Phê duyệt',   oldValue: 'PENDING',    newValue: 'APPROVED', ip: '10.0.2.1', note: '' },
];

const ModalDemo: React.FC = () => {
    const [showBasic,   setShowBasic]   = useState(false);
    const [showForm,    setShowForm]    = useState(false);
    const [showDetail,  setShowDetail]  = useState(false);
    const [showDrawer,  setShowDrawer]  = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [form] = Form.useForm();

    useHeaderActions({ title: 'Modal & Drawer' }, []);

    const historyColumns = [
        { title: 'STT',      dataIndex: 'id',      width: 50,  align: 'center' as const },
        { title: 'Thời gian', dataIndex: 'time',   width: 150, align: 'center' as const },
        { title: 'Người thực hiện', dataIndex: 'user', render: (v: string) => <Tooltip title="Nguyễn Văn A"><Text style={{ fontSize: 12 }}>{v}</Text></Tooltip> },
        { title: 'Hành động', dataIndex: 'action', width: 100 },
        { title: 'Giá trị cũ', dataIndex: 'oldValue', render: (v: string) => v ? <StatusTag status={v} /> : '—' },
        { title: 'Giá trị mới', dataIndex: 'newValue', render: (v: string) => <StatusTag status={v} /> },
        { title: 'Địa chỉ IP', dataIndex: 'ip', width: 110 },
        { title: 'Mô tả', dataIndex: 'note', ellipsis: true },
    ];

    return (
        <ComponentShowcase
            name="Modal & Drawer"
            group="feedback"
            description="Modal xem chi tiết với Lịch sử thay đổi (collapsed). Drawer cho xem nhanh không rời trang. Confirm dialog cho hành động quan trọng."
            behaviors={[
                'Xem chi tiết mặc định dùng Modal (dùng Page nếu nghiệp vụ ghi rõ)',
                'Mọi màn hình chi tiết BẮT BUỘC có bảng Lịch sử thay đổi',
                'Lịch sử mặc định collapse, click mới mở',
                'Lịch sử: max height 250px, scroll, không phân trang, mới nhất ở trên',
                'Drawer dùng để xem nhanh không rời khỏi trang danh sách',
                'Confirm dialog bắt buộc cho: Xóa, Phê duyệt, Từ chối, Vô hiệu hóa',
            ]}
            wide
            demoMinHeight={300}
            code={`// Modal chi tiết với Lịch sử thay đổi
<Modal title="Chi tiết bản ghi" open={open} footer={<Button onClick={close}>Đóng</Button>}>
  {/* Fields */}
  <Descriptions ... />

  {/* Lịch sử thay đổi — mặc định collapse */}
  <Collapse>
    <Panel header={<><HistoryOutlined /> Lịch sử thay đổi</>} key="history">
      <Table
        dataSource={history}
        columns={historyColumns}
        scroll={{ y: 250 }}
        pagination={false}
        size="small"
      />
    </Panel>
  </Collapse>
</Modal>

// Drawer xem nhanh
<Drawer title="Xem chi tiết" placement="right" width={480} open={open}>
  {/* Content */}
</Drawer>`}
        >
            <Space wrap>
                {/* Basic modal */}
                <Button onClick={() => setShowBasic(true)}>Modal cơ bản</Button>

                {/* Form modal */}
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowForm(true)}>
                    Modal + Form
                </Button>

                {/* Detail modal with history */}
                <Button icon={<EyeOutlined />} onClick={() => setShowDetail(true)}>
                    Chi tiết + Lịch sử
                </Button>

                {/* Drawer */}
                <Button onClick={() => setShowDrawer(true)}>Drawer xem nhanh</Button>
            </Space>

            {/* ─── Basic modal ─────────────────────────────────── */}
            <Modal
                title="Thông báo xác nhận"
                open={showBasic}
                onOk={() => setShowBasic(false)}
                onCancel={() => setShowBasic(false)}
                okText="Xác nhận"
                cancelText="Huỷ"
            >
                <Text>Bạn có chắc muốn thực hiện hành động này không?</Text>
            </Modal>

            {/* ─── Form modal ──────────────────────────────────── */}
            <Modal
                title="Thêm mới TCTD"
                open={showForm}
                onOk={() => form.submit()}
                onCancel={() => { setShowForm(false); form.resetFields(); }}
                okText="Lưu"
                cancelText="Huỷ"
                width={520}
            >
                <Form form={form} layout="vertical" onFinish={() => setShowForm(false)}>
                    <Form.Item name="code" label={<><Text>Mã TCTD</Text> <Text style={{ color: colors.error.base }}>*</Text></>} rules={[{ required: true }]}>
                        <Input placeholder="Mã TCTD" />
                    </Form.Item>
                    <Form.Item name="name" label={<><Text>Tên tổ chức</Text> <Text style={{ color: colors.error.base }}>*</Text></>} rules={[{ required: true }]}>
                        <Input placeholder="Tên tổ chức" />
                    </Form.Item>
                    <Form.Item name="type" label="Loại hình">
                        <Select placeholder="Chọn loại hình" options={[
                            { value: 'BANK', label: 'Ngân hàng' },
                            { value: 'FINANCE', label: 'Công ty tài chính' },
                        ]} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* ─── Detail modal with history ───────────────────── */}
            <Modal
                title="Chi tiết Job #JOB-20250310-001"
                open={showDetail}
                onCancel={() => setShowDetail(false)}
                footer={<Button onClick={() => setShowDetail(false)}>Đóng</Button>}
                width={720}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${spacing[2]} ${spacing[6]}`, marginBottom: spacing[4] }}>
                    {[
                        { label: 'Mã job',         value: 'JOB-20250310-001' },
                        { label: 'Trạng thái',     value: <StatusTag status="ACTIVE" /> },
                        { label: 'Ngày tạo',       value: '10/03/2025' },
                        { label: 'Người tạo',      value: 'nguyenvana' },
                        { label: 'Lịch chạy',      value: '00:00 hàng ngày' },
                        { label: 'Lần chạy cuối',  value: '10/03/2025 00:00:05' },
                    ].map((item) => (
                        <div key={item.label}>
                            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>{item.label}</Text>
                            <div style={{ fontSize: typography.fontSize.sm, color: colors.text.primary, marginTop: 2 }}>{item.value}</div>
                        </div>
                    ))}
                </div>

                <Divider style={{ margin: `${spacing[3]} 0` }} />

                {/* Lịch sử thay đổi */}
                <div>
                    <div
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: `${spacing[2]} ${spacing[3]}`,
                            background: historyOpen ? colors.bg.subtle : 'transparent',
                            borderRadius: historyOpen ? `${radius.md} ${radius.md} 0 0` : radius.md,
                            border: `1px solid ${colors.border.split}`,
                            cursor: 'pointer',
                        }}
                        onClick={() => setHistoryOpen(!historyOpen)}
                    >
                        <Space>
                            <HistoryOutlined style={{ color: colors.text.secondary }} />
                            <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Lịch sử thay đổi</Text>
                            <Tag style={{ fontSize: 11 }}>{HISTORY_DATA.length}</Tag>
                        </Space>
                        <Text style={{ fontSize: 12, color: colors.text.tertiary }}>{historyOpen ? '▲' : '▼'}</Text>
                    </div>
                    {historyOpen && (
                        <div style={{ border: `1px solid ${colors.border.split}`, borderTop: 'none', borderRadius: `0 0 ${radius.md} ${radius.md}`, overflow: 'hidden' }}>
                            <Table
                                dataSource={HISTORY_DATA}
                                columns={historyColumns}
                                rowKey="id"
                                size="small"
                                pagination={false}
                                scroll={{ y: 250 }}
                            />
                        </div>
                    )}
                </div>
            </Modal>

            {/* ─── Drawer ──────────────────────────────────────── */}
            <Drawer
                title="Xem chi tiết Job"
                placement="right"
                width={440}
                open={showDrawer}
                onClose={() => setShowDrawer(false)}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                    {[
                        { label: 'Mã job',    value: 'JOB-20250310-001' },
                        { label: 'Tên',       value: 'Job tổng hợp KKN-M5' },
                        { label: 'Trạng thái', value: <StatusTag status="RUNNING" /> },
                        { label: 'Lịch chạy', value: '00:00 hàng ngày' },
                    ].map((item) => (
                        <div key={item.label}>
                            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, display: 'block' }}>{item.label}</Text>
                            <div style={{ fontSize: typography.fontSize.sm, marginTop: 2 }}>{item.value}</div>
                        </div>
                    ))}
                    <Divider />
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary }}>
                        Drawer thường dùng để xem nhanh mà không rời trang danh sách.
                    </Text>
                </div>
            </Drawer>
        </ComponentShowcase>
    );
};

export default ModalDemo;
