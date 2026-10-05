'use client';

import React, { useState } from 'react';
import { Upload, Typography, Progress, Space, Tag, Button, Alert, message } from 'antd';
import { InboxOutlined, DownloadOutlined, FilePdfOutlined, FileExcelOutlined, FileWordOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, spacing, radius } from '@/modules/design-system-explorer/tokens';
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
    'application/pdf':                                                    <FilePdfOutlined style={{ color: 'var(--error)' }} />,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <FileExcelOutlined style={{ color: 'var(--success)' }} />,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FileWordOutlined style={{ color: 'var(--info)' }} />,
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-12)' }}>
                <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    size="small"
                    style={{ color: 'var(--primary)' }}
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
                style={{ marginBottom: 'var(--spacing-16)' }}
            >
                <p style={{ fontSize: 32, color: colors.subsystem.design, margin: `0 0 var(--spacing-8)` }}>
                    <InboxOutlined />
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text)', margin: `0 0 var(--spacing-4)` }}>
                    Kéo thả hoặc click để tải lên
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    PDF, Word (.doc, .docx), Excel (.xls, .xlsx) — Tối đa {MAX_SIZE_MB}MB/file
                </p>
            </Dragger>

            {/* File list */}
            {fileList.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
                    {fileList.map((f) => (
                        <div
                            key={f.uid}
                            style={{
                                padding: `var(--spacing-8) var(--spacing-12)`,
                                background: 'var(--bg-subtle)',
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${f.status === 'error' ? 'var(--error)' + '50' : 'var(--color-neutral-100)'}`,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', marginBottom: f.status === 'uploading' ? 'var(--spacing-8)' : 0 }}>
                                <span style={{ flexShrink: 0 }}>{FILE_ICON[f.type] ?? <FilePdfOutlined />}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Text ellipsis style={{ fontSize: '12px', display: 'block' }}>{f.name}</Text>
                                    <Text style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{formatSize(f.size)}</Text>
                                </div>
                                {f.status === 'done' && (
                                    <Tag color="success" style={{ fontSize: 11 }}>Xong</Tag>
                                )}
                                <button
                                    onClick={() => removeFile(f.uid)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', padding: 2 }}
                                >
                                    <DeleteOutlined />
                                </button>
                            </div>
                            {f.status === 'uploading' && (
                                <Progress
                                    percent={f.progress}
                                    size="small"
                                    strokeColor={'var(--primary)'}
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
                    style={{ fontSize: '11px' }}
                />
            )}
        </ComponentShowcase>
    );
};

export default UploadDemo;
