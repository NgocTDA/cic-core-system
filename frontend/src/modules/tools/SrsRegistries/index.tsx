'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Table, Input, Button, Modal, Form, message, Typography, Alert } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import useHeaderActions from '@/hooks/useHeaderActions';
import { PageLayout, SectionCard, FilterBar, FilterCol, ActionMenu, CodeText, tablePagination } from '@/components/ui';
import { fetchRegistry, mutateRegistryItem, type RegistryKey, type RegistrySnapshot } from '@/services/registryService';

const REGISTRIES: { key: RegistryKey; label: string }[] = [
    { key: 'manifest', label: 'Chức năng' }, { key: 'groups', label: 'Nhóm chức năng' },
    { key: 'usecases', label: 'Use Cases' }, { key: 'messages', label: 'Thông báo' },
    { key: 'states', label: 'Trạng thái' }, { key: 'roles', label: 'Vai trò' },
    { key: 'participants', label: 'Tác nhân' }, { key: 'objects', label: 'Đối tượng' },
];
type Row = { id: string; values: Record<string, string> };
const SrsRegistries: React.FC = () => {
    const [activeRegistry, setActiveRegistry] = useState<RegistryKey>('manifest');
    const [searchText, setSearchText] = useState('');
    const [query, setQuery] = useState('');
    const [snapshot, setSnapshot] = useState<RegistrySnapshot | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [reload, setReload] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [editOpen, setEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<string>();
    const [form] = Form.useForm();
    useHeaderActions({ title: 'Quản lý sổ đăng ký SRS' }, []);
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true); setError(''); setSnapshot(null);
        fetchRegistry(activeRegistry, undefined, controller.signal).then(setSnapshot).catch(error => {
            if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'Không tải được sổ đăng ký.');
        }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, [activeRegistry, reload]);
    const rows = useMemo(() => (snapshot?.items || []).map((values, i) => ({ id: snapshot!.rowIds[i], values }))
        .filter(row => Object.values(row.values).some(value => value.toLowerCase().includes(query.trim().toLowerCase()))), [snapshot, query]);
    useEffect(() => { setCurrentPage(1); }, [rows]);
    const openEditor = (row?: Row) => {
        setEditingId(row?.id); form.resetFields();
        if (row) form.setFieldsValue(row.values);
        setEditOpen(true);
    };
    const persist = async (action: 'add' | 'update' | 'delete', id?: string, values?: Record<string, string>) => {
        if (!snapshot || saving) return;
        setSaving(true);
        try {
            const result = await mutateRegistryItem(activeRegistry, snapshot.revision, action, id, values);
            setSnapshot(result); setEditOpen(false); message.success('Đã lưu sổ đăng ký.');
        } catch (error) { message.error(error instanceof Error ? error.message : 'Không lưu được sổ đăng ký.'); }
        finally { setSaving(false); }
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            const normalized = Object.fromEntries((snapshot?.headers || []).map(key => [key, String(values[key] ?? '')]));
            await persist(editingId ? 'update' : 'add', editingId, normalized);
        } catch { /* Form displays field validation errors. */ }
    };
    const columns: TableColumnsType<Row> = (snapshot?.headers || []).map(col => ({
        title: col, key: col, ellipsis: true,
        render: (_, row) => col.includes('ma') || col.includes('code') ? <CodeText>{row.values[col]}</CodeText> : <Typography.Text>{row.values[col] || '—'}</Typography.Text>,
    }));
    columns.push({ title: 'Thao tác', key: 'actions', width: 75, align: 'center', fixed: 'right', render: (_, row) => (
        <ActionMenu items={[
            { key: 'edit', label: 'Chỉnh sửa', icon: <EditOutlined />, disabled: saving, onClick: () => openEditor(row) },
            { type: 'divider' },
            { key: 'delete', label: 'Xóa', icon: <DeleteOutlined />, danger: true, disabled: saving, onClick: () => Modal.confirm({
                title: 'Xóa bản ghi này?', icon: null, okText: 'Xóa', cancelText: 'Hủy', okButtonProps: { danger: true },
                footer: (_, { OkBtn, CancelBtn }) => <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-8)' }}><CancelBtn /><OkBtn /></div>,
                onOk: () => persist('delete', row.id),
            }) },
        ]} />
    ) });
    return <PageLayout>
        <Tabs activeKey={activeRegistry} items={REGISTRIES.map(r => ({ ...r, disabled: saving }))} onChange={key => {
            setActiveRegistry(key as RegistryKey); setSnapshot(null); setSearchText(''); setQuery(''); setEditOpen(false);
        }} />
        <FilterBar inCard showAddFilter={false} onSearch={() => setQuery(searchText)} onReset={() => { setSearchText(''); setQuery(''); }} loading={loading}
            extra={<><Button icon={<ReloadOutlined />} disabled={saving} onClick={() => setReload(n => n + 1)}>Tải lại</Button><Button type="primary" icon={<PlusOutlined />} disabled={!snapshot || loading || saving} onClick={() => openEditor()}>Thêm bản ghi</Button></>}>
            <FilterCol minWidth={220}><Input placeholder="Tìm kiếm mã, tên..." value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={() => setQuery(searchText)} /></FilterCol>
        </FilterBar>
        {error && <Alert type="error" showIcon message={error} />}
        <SectionCard flex><Table<Row> loading={loading || saving} dataSource={rows} columns={columns} rowKey="id" scroll={{ x: 'max-content' }}
            pagination={tablePagination({ current: currentPage, pageSize, total: rows.length, showQuickJumper: false, onChange: (page, size) => { setCurrentPage(page); setPageSize(size); } })} /></SectionCard>
        <Modal title={editingId ? 'Chỉnh sửa bản ghi sổ đăng ký' : 'Thêm mới bản ghi sổ đăng ký'} open={editOpen} onCancel={() => { if (!saving) setEditOpen(false); }}
            footer={<div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-8)' }}><Button disabled={saving} onClick={() => setEditOpen(false)}>Hủy</Button><Button type="primary" loading={saving} onClick={save}>Lưu</Button></div>}>
            <Form form={form} layout="vertical">{snapshot?.headers.map((col, index) => <Form.Item key={col} name={col} label={col} rules={index === 0 ? [{ required: true, whitespace: true, message: `Bắt buộc nhập ${col}` }] : []}><Input placeholder={`Nhập ${col}`} /></Form.Item>)}</Form>
        </Modal>
    </PageLayout>;
};
export default SrsRegistries;
