'use client';

import React from 'react';
import { Form, Input, Button, Upload, Space, Typography, Alert, Tag } from 'antd';
import type { UploadFile } from 'antd';
import { InboxOutlined, ThunderboltOutlined, FileTextOutlined } from '@ant-design/icons';
import { colors, spacing } from '@/design-system';
import ProviderSelect from './ProviderSelect';
import type { DocInput, ProviderInfo, UploadedImage } from './types';

const { Dragger } = Upload;
const { Text } = Typography;

interface DocFormProps {
    input: DocInput;
    onChange: (patch: Partial<DocInput>) => void;
    providers: ProviderInfo[];
    providerId: string;
    onProviderChange: (id: string) => void;
    providersLoading: boolean;
    promptLabel: string | null;
    onGenerate: () => void;
    loading: boolean;
}

// Đọc file ảnh thành dataUrl.
function readImage(file: File): Promise<UploadedImage> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve({ name: file.name, dataUrl: String(ev.target?.result ?? '') });
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const DocForm: React.FC<DocFormProps> = ({ input, onChange, providers, providerId, onProviderChange, providersLoading, promptLabel, onGenerate, loading }) => {
    const fileList: UploadFile[] = input.images.map((img, i) => ({
        uid: String(i),
        name: img.name,
        status: 'done',
        thumbUrl: img.dataUrl,
    }));

    // Cảnh báo cấu hình cho provider đang chọn.
    const selected = providers.find((p) => p.id === providerId);
    const providerAlert = !selected ? null : !selected.typeValid ? (
        <Alert
            type="error"
            showIcon
            style={{ marginTop: spacing[1] }}
            message="Cấu hình provider sai"
            description={`type "${selected.type}" không hợp lệ — chỉ chấp nhận A (Anthropic), O (OpenAI) hoặc G (Gemini).`}
        />
    ) : !selected.hasKey ? (
        <Alert
            type="warning"
            showIcon
            style={{ marginTop: spacing[1] }}
            message="Provider chưa có API key"
            description="Liên hệ quản trị viên để thêm API key."
        />
    ) : null;

    return (
        <Form layout="vertical" style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
            <Form.Item label="AI Provider" style={{ marginBottom: spacing[3] }}>
                <ProviderSelect
                    providers={providers}
                    value={providerId}
                    onChange={onProviderChange}
                    disabled={loading}
                    loading={providersLoading}
                />
                {providerAlert}
                {promptLabel && (
                    <Tag
                        icon={<FileTextOutlined />}
                        color={colors.subsystem.tools}
                        style={{ marginTop: spacing[1] }}
                    >
                        Prompt: {promptLabel}
                    </Tag>
                )}
            </Form.Item>

            <Form.Item label="Tên chức năng" required style={{ marginBottom: spacing[3] }}>
                <Input
                    value={input.funcName}
                    onChange={(e) => onChange({ funcName: e.target.value })}
                    placeholder="VD: Màn hình Đăng nhập hệ thống CIC"
                />
            </Form.Item>

            <Form.Item label="Mã màn hình" style={{ marginBottom: spacing[3] }}>
                <Input
                    value={input.screenCode}
                    onChange={(e) => onChange({ screenCode: e.target.value })}
                    placeholder="VD: SCR-AUTH-01"
                />
            </Form.Item>

            <Form.Item label="Module / Hệ thống" style={{ marginBottom: spacing[3] }}>
                <Input
                    value={input.module}
                    onChange={(e) => onChange({ module: e.target.value })}
                    placeholder="VD: Xác thực & Phân quyền"
                />
            </Form.Item>

            <Form.Item label="Mô tả chức năng" style={{ marginBottom: spacing[3] }}>
                <Input.TextArea
                    value={input.funcDesc}
                    onChange={(e) => onChange({ funcDesc: e.target.value })}
                    placeholder="Mô tả mục đích, đối tượng người dùng, luồng chính..."
                    autoSize={{ minRows: 3, maxRows: 6 }}
                />
            </Form.Item>

            <Form.Item label="Mockup / Wireframe (tùy chọn)" style={{ marginBottom: spacing[3] }}>
                <Dragger
                    multiple
                    accept="image/*"
                    fileList={fileList}
                    beforeUpload={async (file) => {
                        const img = await readImage(file);
                        onChange({ images: [...input.images, img] });
                        return false; // chặn auto-upload
                    }}
                    onRemove={(file) => {
                        onChange({ images: input.images.filter((_, i) => String(i) !== file.uid) });
                    }}
                    listType="picture"
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ color: colors.subsystem.tools }} />
                    </p>
                    <p className="ant-upload-text">Kéo thả hoặc click để upload ảnh</p>
                    <p className="ant-upload-hint">PNG, JPG, WebP · AI sẽ phân tích trực tiếp ảnh mockup</p>
                </Dragger>
            </Form.Item>

            <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Button
                    type="primary"
                    icon={<ThunderboltOutlined />}
                    onClick={onGenerate}
                    loading={loading}
                    block
                    size="large"
                >
                    {loading ? 'Đang sinh tài liệu...' : 'Sinh tài liệu'}
                </Button>
                <Text type="secondary" style={{ fontSize: 11 }}>
                    Key AI do server cung cấp — bạn không cần nhập key.
                </Text>
            </Space>
        </Form>
    );
};

export default DocForm;
