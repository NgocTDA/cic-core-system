'use client';

import React, { useState } from 'react';
import { Button, Space, Typography, Divider, Dropdown, Row, Col, Modal, message } from 'antd';
import {
    PlusOutlined, DownloadOutlined, DeleteOutlined, EditOutlined,
    CheckOutlined, CloseOutlined, ExportOutlined, PrinterOutlined,
    SaveOutlined, DownOutlined, LoadingOutlined,
} from '@ant-design/icons';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const ButtonDemo: React.FC = () => {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [messageApi, contextHolder] = message.useMessage();

    useHeaderActions({ title: 'Button' }, []);

    const triggerLoading = (key: string, ms = 1500) => {
        setLoadingMap(p => ({ ...p, [key]: true }));
        setTimeout(() => setLoadingMap(p => ({ ...p, [key]: false })), ms);
    };

    const exportItems = [
        { key: 'current', label: 'Xuất trang hiện tại', onClick: () => messageApi.success('Xuất trang hiện tại') },
        { key: 'filter',  label: 'Xuất theo bộ lọc',   onClick: () => messageApi.success('Xuất theo bộ lọc') },
    ];

    return (
        <ComponentShowcase
            name="Button"
            group="button"
            description="Tập hợp các kiểu button, trạng thái và pattern thao tác chuẩn. Chỉ có 1 Primary button trong mỗi khu vực hành động."
            behaviors={[
                'Chỉ có DUY NHẤT 1 Primary button trong một khu vực hành động',
                'Secondary / Default dùng cho hành động phụ',
                'Chữ in thường, chữ cái đầu in hoa (ví dụ: "Thêm mới", "Lưu")',
                'Auto-disable + loading spinner khi đang xử lý (tránh submit nhiều lần)',
                'Danger variant (màu đỏ) cho hành động xóa / từ chối / vô hiệu hóa',
                'Export Excel: Dropdown với 2 lựa chọn "Xuất trang hiện tại" / "Xuất theo bộ lọc"',
                'Confirm dialog trước khi thực hiện hành động xóa / phê duyệt / từ chối',
            ]}
            wide
            demoBackground={colors.bg.subtle}
            code={`import { Button, Dropdown, Modal } from 'antd';

// 1 Primary trong khu vực action
<Space>
  <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm mới</Button>
  <Dropdown menu={{ items: exportItems }}>
    <Button icon={<DownloadOutlined />}>Xuất Excel <DownOutlined /></Button>
  </Dropdown>
</Space>

// Auto-disable + loading khi submit
<Button
  type="primary"
  loading={submitting}
  disabled={submitting}
  onClick={handleSave}
>Lưu</Button>

// Confirm trước delete
<Button
  danger
  onClick={() => Modal.confirm({
    title: 'Xóa bản ghi?',
    content: 'Không thể hoàn tác.',
    okText: 'Xóa', okType: 'danger',
    onOk: handleDelete,
  })}
>Xóa</Button>

// Export Excel pattern
const exportItems = [
  { key: 'current', label: 'Xuất trang hiện tại' },
  { key: 'filter',  label: 'Xuất theo bộ lọc'   },
];
<Dropdown menu={{ items: exportItems }}>
  <Button icon={<DownloadOutlined />}>Xuất Excel <DownOutlined /></Button>
</Dropdown>`}
        >
            {contextHolder}

            {/* Types */}
            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: spacing[3] }}>
                Kiểu button
            </Text>
            <Space wrap style={{ marginBottom: spacing[5] }}>
                <Button type="primary">Primary</Button>
                <Button type="default">Default</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="text">Text</Button>
                <Button type="link">Link</Button>
            </Space>

            {/* With icons */}
            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: spacing[3] }}>
                Với icon
            </Text>
            <Space wrap style={{ marginBottom: spacing[5] }}>
                <Button type="primary" icon={<PlusOutlined />}>Thêm mới</Button>
                <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
                <Button icon={<PrinterOutlined />} onClick={() => triggerLoading('print')}>In báo cáo</Button>
                <Button danger icon={<DeleteOutlined />}>Xóa</Button>
            </Space>

            {/* Loading states */}
            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: spacing[3] }}>
                Loading state (click để xem)
            </Text>
            <Space wrap style={{ marginBottom: spacing[5] }}>
                <Button
                    type="primary"
                    loading={loadingMap['save']}
                    icon={<SaveOutlined />}
                    onClick={() => triggerLoading('save')}
                >
                    Lưu
                </Button>
                <Button
                    loading={loadingMap['approve']}
                    icon={<CheckOutlined />}
                    onClick={() => triggerLoading('approve')}
                >
                    Gửi duyệt
                </Button>
            </Space>

            <Divider style={{ margin: `${spacing[2]} 0` }} />

            {/* Danger + confirm */}
            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: spacing[3] }}>
                Danger + Confirm dialog
            </Text>
            <Space wrap style={{ marginBottom: spacing[5] }}>
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => Modal.confirm({
                        title: 'Xóa bản ghi này?',
                        content: 'Hành động này không thể hoàn tác.',
                        okText: 'Xóa', okType: 'danger', cancelText: 'Huỷ',
                        onOk: () => messageApi.success('Đã xóa'),
                    })}
                >
                    Xóa
                </Button>
                <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => Modal.confirm({
                        title: 'Từ chối yêu cầu?',
                        content: 'Yêu cầu sẽ được chuyển về trạng thái Từ chối.',
                        okText: 'Từ chối', okType: 'danger', cancelText: 'Huỷ',
                        onOk: () => messageApi.error('Đã từ chối'),
                    })}
                >
                    Từ chối
                </Button>
            </Space>

            <Divider style={{ margin: `${spacing[2]} 0` }} />

            {/* Export Excel pattern */}
            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: spacing[3] }}>
                Export Excel pattern (Ctrl+Shift+E)
            </Text>
            <Space wrap style={{ marginBottom: spacing[5] }}>
                <Dropdown menu={{ items: exportItems }}>
                    <Button icon={<DownloadOutlined />}>
                        Xuất Excel <DownOutlined />
                    </Button>
                </Dropdown>
                <Button icon={<PrinterOutlined />} onClick={() => messageApi.info('Ctrl+P')}>
                    In (Ctrl+P)
                </Button>
            </Space>

            <Divider style={{ margin: `${spacing[2]} 0` }} />

            {/* Disabled */}
            <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: spacing[3] }}>
                Disabled state
            </Text>
            <Space wrap>
                <Button type="primary" disabled>Primary disabled</Button>
                <Button disabled>Default disabled</Button>
                <Button danger disabled>Danger disabled</Button>
            </Space>
        </ComponentShowcase>
    );
};

export default ButtonDemo;
