'use client';

import React, { useState } from 'react';
import { Upload, Typography, Progress, Space, Tag, Button, Alert, message } from 'antd';
import { InboxOutlined, DownloadOutlined, FilePdfOutlined, FileExcelOutlined, FileWordOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing, radius } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Dragger } = Upload;
const { Text } = Typography;

interface MockFile {
    uid: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: 'uploading' | 'done' | 'error';
}

const FILE_ICON: Record<string, React.ReactNode> = {
    'application/pdf':                                                    <FilePdfOutlined style={{ color: colors.error.base }} />,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <FileExcelOutlined style={{ color: colors.success.base }} />,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FileWordOutlined style={{ color: colors.info.base }} />,
};

const ACCEPTED = '.pdf,.doc,.docx,.xls,.xlsx';
const MAX_SIZE_MB = 10;

const UploadDemo: React.FC = () => {
    const [fileList, setFileList] = useState<MockFile[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    useHeaderActions({ title: 'Upload' }, []);

    const validateAndAdd = (file: File): boolean => {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        const allowedExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];

        if (!allowedExts.includes(ext)) {
            messageApi.error(`Định dạng không hỗ trợ: .${ext}. Chỉ chấp nhận: PDF, Word, Excel`);
            return false;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            messageApi.error(`File quá lớn. Tối đa ${MAX_SIZE_MB}MB.`);
            return false;
        }
        const duplicate = fileList.some(f => f.name.toLowerCase() === file.name.toLowerCase());
        if (duplicate) {
            messageApi.warning(`File "${file.name}" đã được thêm trước đó.`);
            return false;
        }

        const newFile: MockFile = {
            uid:      Date.now().toString(),
            name:     file.name,
            size:     file.size,
            type:     file.type,
            progress: 0,
            status:   'uploading',
        };

        setFileList(prev => [...prev, newFile]);

        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 30;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setFileList(prev => prev.map(f => f.uid === newFile.uid ? { ...f, progress: 100, status: 'done' } : f));
            } else {
                setFileList(prev => prev.map(f => f.uid === newFile.uid ? { ...f, progress: Math.round(p) } : f));
            }
        }, 300);

        return false;
    };

    const removeFile = (uid: string) => {
        setFileList(prev => prev.filter(f => f.uid !== uid));
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <ComponentShowcase
            name="Upload"
            group="form"
            description="Upload file với kiểm tra loại, kích thước và trùng tên. Progress bar trong quá trình upload. Hỗ trợ hủy upload và link tải file mẫu."
            behaviors={[
                'Kiểm tra loại file (accept) TRƯỚC khi upload — hiện lỗi ngay',
                'Kiểm tra kích thước tối đa (maxSize) — hiện lỗi ngay',
                'Không cho upload file trùng tên (không phân biệt hoa/thường)',
                'Progress bar trong quá trình upload',
                'Sau upload thành công: hiện tên file, kích thước, icon xóa',
                'Giới hạn số file cùng lúc — thông báo rõ khi vượt',
                'Link "Tải file mẫu" để hỗ trợ người dùng đúng định dạng',
                'Hỗ trợ định dạng: Word (.doc, .docx), Excel (.xls, .xlsx), PDF',
            ]}
            code={`import { Upload } from 'antd';
const { Dragger } = Upload;

<Dragger
  accept=".pdf,.doc,.docx,.xls,.xlsx"
  beforeUpload={(file) => {
    // Validate type
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf','doc','docx','xls','xlsx'].includes(ext!)) {
      message.error('Định dạng không hỗ trợ');
      return false;
    }
    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      message.error('File quá lớn. Tối đa 10MB');
      return false;
    }
    // Check duplicate name
    const dup = fileList.some(f => f.name.toLowerCase() === file.name.toLowerCase());
    if (dup) { message.warning('File đã tồn tại'); return false; }
    return true;
  }}
  multiple
  maxCount={5}
  showUploadList={false}
>
  <p><InboxOutlined /></p>
  <p>Kéo thả hoặc click để tải lên</p>
  <p style={{ color: 'secondary' }}>PDF, Word, Excel — Tối đa 10MB/file</p>
</Dragger>`}
            demoMinHeight={400}
        >
            {contextHolder}

            {/* Sample file download link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: spacing[3] }}>
                <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    size="small"
                    style={{ color: colors.primary[500] }}
                >
                    Tải file mẫu
                </Button>
            </div>

            {/* Dragger */}
            <Dragger
                accept={ACCEPTED}
                beforeUpload={validateAndAdd}
                multiple
                showUploadList={false}
                style={{ marginBottom: spacing[4] }}
            >
                <p style={{ fontSize: 32, color: colors.subsystem.design, margin: `0 0 ${spacing[2]}` }}>
                    <InboxOutlined />
                </p>
                <p style={{ fontSize: typography.fontSize.base, color: colors.text.primary, margin: `0 0 ${spacing[1]}` }}>
                    Kéo thả hoặc click để tải lên
                </p>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, margin: 0 }}>
                    PDF, Word (.doc, .docx), Excel (.xls, .xlsx) — Tối đa {MAX_SIZE_MB}MB/file
                </p>
            </Dragger>

            {/* File list */}
            {fileList.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                    {fileList.map((f) => (
                        <div
                            key={f.uid}
                            style={{
                                padding: `${spacing[2]} ${spacing[3]}`,
                                background: colors.bg.subtle,
                                borderRadius: radius.md,
                                border: `1px solid ${f.status === 'error' ? colors.error.base + '50' : colors.border.split}`,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: f.status === 'uploading' ? spacing[2] : 0 }}>
                                <span style={{ flexShrink: 0 }}>{FILE_ICON[f.type] ?? <FilePdfOutlined />}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Text ellipsis style={{ fontSize: typography.fontSize.sm, display: 'block' }}>{f.name}</Text>
                                    <Text style={{ fontSize: 11, color: colors.text.tertiary }}>{formatSize(f.size)}</Text>
                                </div>
                                {f.status === 'done' && (
                                    <Tag color="success" style={{ fontSize: 11 }}>Xong</Tag>
                                )}
                                <button
                                    onClick={() => removeFile(f.uid)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.error.base, padding: 2 }}
                                >
                                    <DeleteOutlined />
                                </button>
                            </div>
                            {f.status === 'uploading' && (
                                <Progress
                                    percent={f.progress}
                                    size="small"
                                    strokeColor={colors.primary[500]}
                                    showInfo={false}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {fileList.length === 0 && (
                <Alert
                    type="info"
                    message="Thả file vào vùng trên để xem upload demo (file không thật sự được tải lên)"
                    showIcon
                    style={{ fontSize: typography.fontSize.xs }}
                />
            )}
        </ComponentShowcase>
    );
};

export default UploadDemo;
