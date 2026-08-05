'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, Table, Input, Button, Space, Tag, Modal, Form, message, Card, Popconfirm, Typography } from 'antd';
import {
    DatabaseOutlined,
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SaveOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import useHeaderActions from '@/hooks/useHeaderActions';
import { PageLayout, SectionCard, tablePagination } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import { fetchRegistryItems, saveRegistryItems, type RegistryKey } from '@/services/registryService';

const { Text, Title } = Typography;

const REGISTRIES: { key: RegistryKey; label: string; desc: string }[] = [
    { key: 'manifest', label: '1. Danh mục Chức năng (manifest.csv)', desc: 'Chức năng, Phân hệ, Chủ sở hữu, Trạng thái' },
    { key: 'groups', label: '2. Nhóm Chức năng (groups.csv)', desc: 'Mã nhóm, Tên nhóm, Phân hệ' },
    { key: 'usecases', label: '3. Use Cases (usecases.csv)', desc: 'Mã UC (UC-0001...), Tên UC, Phân hệ' },
    { key: 'messages', label: '4. Thông báo (messages.csv)', desc: 'Mã thông báo dùng chung toàn hệ thống' },
    { key: 'states', label: '5. Trạng thái (states.csv)', desc: 'Mã trạng thái (ST-...)' },
    { key: 'roles', label: '6. Vai trò (roles.csv)', desc: 'Mã vai trò hệ thống (ROLE-...)' },
    { key: 'participants', label: '7. Tác nhân (participants.csv)', desc: 'Mã tác nhân / hệ thống' },
    { key: 'objects', label: '8. Đối tượng (objects.csv)', desc: 'Mã đối tượng nghiệp vụ' },
];

const SrsRegistries: React.FC = () => {
    const [activeRegistry, setActiveRegistry] = useState<RegistryKey>('manifest');
    const [searchText, setSearchText] = useState('');
    const [items, setItems] = useState<Record<string, string>[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal Add/Edit
    const [editOpen, setEditOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [form] = Form.useForm();

    useHeaderActions({ title: 'Quản lý Sổ đăng ký SRS (Registries)' }, []);

    const loadData = async (reg: RegistryKey, q?: string) => {
        setLoading(true);
        try {
            const data = await fetchRegistryItems(reg, q);
            setItems(data);
        } catch {
            message.error('Không tải được sổ đăng ký.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(activeRegistry, searchText);
    }, [activeRegistry]);

    const handleSearch = () => {
        loadData(activeRegistry, searchText);
    };

    const handleOpenAdd = () => {
        setEditingIndex(null);
        form.resetFields();
        setEditOpen(true);
    };

    const handleOpenEdit = (record: Record<string, string>, index: number) => {
        setEditingIndex(index);
        form.setFieldsValue(record);
        setEditOpen(true);
    };

    const handleDelete = async (index: number) => {
        const nextItems = [...items];
        nextItems.splice(index, 1);
        setItems(nextItems);
        const res = await saveRegistryItems(activeRegistry, nextItems);
        if (res.success) {
            message.success('Đã xóa bản ghi!');
        } else {
            message.error(res.error || 'Lỗi lưu sổ đăng ký');
        }
    };

    const handleSaveForm = async () => {
        try {
            const values = await form.validateFields();
            const nextItems = [...items];
            if (editingIndex !== null) {
                nextItems[editingIndex] = values;
            } else {
                nextItems.unshift(values);
            }

            const res = await saveRegistryItems(activeRegistry, nextItems);
            if (res.success) {
                message.success('Lưu thành công!');
                setItems(nextItems);
                setEditOpen(false);
            } else {
                message.error(res.error || 'Lỗi lưu sổ đăng ký.');
            }
        } catch {
            // Validate fail
        }
    };

    const columns = items.length > 0
        ? Object.keys(items[0]).map((col) => ({
              title: col.toUpperCase(),
              dataIndex: col,
              key: col,
              render: (v: string) => (
                  <Text code={col.includes('ma') || col.includes('code')}>{v}</Text>
              ),
          }))
        : [];

    columns.push({
        title: 'HÀNH ĐỘNG',
        key: 'actions',
        render: (_: any, record: Record<string, string>, index: number) => (
            <Space size="small">
                <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(record, index)} />
                <Popconfirm title="Xóa bản ghi này?" onConfirm={() => handleDelete(index)} okText="Xóa" cancelText="Hủy">
                    <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            </Space>
        ),
    } as any);

    return (
        <PageLayout>
            <Space direction="vertical" size={parseInt(spacing[4], 10)} style={{ width: '100%' }}>
                {/* Search & Actions Header */}
                <SectionCard
                    title="Tra cứu & Cập nhật Sổ đăng ký"
                    extra={
                        <Space wrap>
                            <Input
                                placeholder="Tìm kiếm mã, tên..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onPressEnter={handleSearch}
                                style={{ width: 220 }}
                                prefix={<SearchOutlined />}
                            />
                            <Button icon={<ReloadOutlined />} onClick={handleSearch}>Làm mới</Button>
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>Thêm bản ghi</Button>
                        </Space>
                    }
                >
                    <Tabs
                        activeKey={activeRegistry}
                        onChange={(k) => {
                            setActiveRegistry(k as RegistryKey);
                            setSearchText('');
                        }}
                        items={REGISTRIES.map((r) => ({
                            key: r.key,
                            label: r.label,
                        }))}
                    />

                    <Table
                        loading={loading}
                        dataSource={items}
                        columns={columns}
                        pagination={tablePagination({ pageSize: 15 })}
                        rowKey={(r, idx) => idx?.toString() ?? ''}
                        bordered
                    />
                </SectionCard>
            </Space>

            {/* Modal Add/Edit */}
            <Modal
                title={editingIndex !== null ? 'Chỉnh sửa bản ghi Sổ đăng ký' : 'Thêm mới bản ghi Sổ đăng ký'}
                open={editOpen}
                onOk={handleSaveForm}
                onCancel={() => setEditOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    {items.length > 0 &&
                        Object.keys(items[0]).map((col) => (
                            <Form.Item key={col} name={col} label={col.toUpperCase()} rules={[{ required: true, message: `Bắt buộc nhập ${col}` }]}>
                                <Input placeholder={`Nhập ${col}`} />
                            </Form.Item>
                        ))}
                </Form>
            </Modal>
        </PageLayout>
    );
};

export default SrsRegistries;
