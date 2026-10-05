'use client';

import React from 'react';
import { Button, Space, Typography, notification, message, Divider } from 'antd';
import {
    CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined,
    WarningOutlined, BellOutlined,
} from '@ant-design/icons';
import ComponentShowcase from '../../ComponentShowcase';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const NotificationDemo: React.FC = () => {
    const [notifApi, notifContext] = notification.useNotification();
    const [messageApi, msgContext] = message.useMessage();

    useHeaderActions({ title: 'Notification / Message' }, []);

    const showNotif = (type: 'success' | 'error' | 'warning' | 'info') => {
        const configs = {
            success: {
                message: 'Thao tác thành công',
                description: 'Bản ghi đã được lưu và gửi duyệt thành công.',
                icon: <CheckCircleOutlined style={{ color: 'var(--success)' }} />,
            },
            error: {
                message: 'Thao tác thất bại',
                description: 'Không thể lưu bản ghi. Vui lòng kiểm tra lại thông tin.',
                icon: <CloseCircleOutlined style={{ color: 'var(--error)' }} />,
            },
            warning: {
                message: 'Cảnh báo',
                description: 'Phiên đăng nhập sắp hết hạn. Vui lòng lưu công việc.',
                icon: <WarningOutlined style={{ color: 'var(--warning)' }} />,
            },
            info: {
                message: 'Thông báo hệ thống',
                description: 'Hệ thống sẽ bảo trì lúc 23:00 hôm nay.',
                icon: <InfoCircleOutlined style={{ color: 'var(--info)' }} />,
            },
        };
        notifApi[type](configs[type]);
    };

    return (
        <ComponentShowcase
            name="Notification / Message"
            group="feedback"
            description="notification dùng cho thông báo quan trọng có mô tả chi tiết. message dùng cho phản hồi nhanh (top-center)."
            behaviors={[
                'notification: dùng khi cần mô tả chi tiết (thành công/thất bại)',
                'message: dùng cho phản hồi ngắn gọn sau hành động (toast)',
                'Luôn dùng đúng semantic: success / error / warning / info',
                'Không dùng alert() của browser',
                'Duration mặc định: notification 4.5s, message 3s',
                'Notification vị trí topRight (mặc định)',
            ]}
            code={`import { notification, message } from 'antd';

// notification (có mô tả)
const [api, contextHolder] = notification.useNotification();

api.success({
  message: 'Lưu thành công',
  description: 'Bản ghi đã được lưu và gửi duyệt.',
});

// message (toast ngắn)
const [msgApi, msgHolder] = message.useMessage();

msgApi.success('Đã lưu');
msgApi.error('Không thể kết nối');
msgApi.warning('Dữ liệu chưa đầy đủ');`}
        >
            {notifContext}
            {msgContext}

            {/* Notification */}
            <Text style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 'var(--spacing-12)' }}>
                notification.useNotification() — có mô tả chi tiết
            </Text>
            <Space wrap style={{ marginBottom: 'var(--spacing-20)' }}>
                {(['success', 'error', 'warning', 'info'] as const).map((type) => (
                    <Button
                        key={type}
                        onClick={() => showNotif(type)}
                        style={{
                            borderColor: {
                                success: 'var(--success)',
                                error:   'var(--error)',
                                warning: 'var(--warning)',
                                info:    'var(--info)',
                            }[type],
                            color: {
                                success: 'var(--success-ink)',
                                error:   'var(--error-ink)',
                                warning: 'var(--warning-ink)',
                                info:    'var(--info-ink)',
                            }[type],
                        }}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                ))}
            </Space>

            <Divider style={{ margin: `var(--spacing-8) 0` }} />

            {/* Message */}
            <Text style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 'var(--spacing-12)' }}>
                message.useMessage() — toast ngắn gọn
            </Text>
            <Space wrap>
                <Button size="small" onClick={() => messageApi.success('Lưu thành công')}>
                    <CheckCircleOutlined style={{ color: 'var(--success)' }} /> success
                </Button>
                <Button size="small" onClick={() => messageApi.error('Không thể kết nối server')}>
                    <CloseCircleOutlined style={{ color: 'var(--error)' }} /> error
                </Button>
                <Button size="small" onClick={() => messageApi.warning('Dữ liệu chưa đầy đủ')}>
                    <WarningOutlined style={{ color: 'var(--warning)' }} /> warning
                </Button>
                <Button size="small" onClick={() => messageApi.info('Hệ thống đang xử lý...')}>
                    <InfoCircleOutlined style={{ color: 'var(--info)' }} /> info
                </Button>
                <Button size="small" onClick={() => messageApi.loading('Đang tải dữ liệu...', 2)}>
                    loading (2s)
                </Button>
            </Space>
        </ComponentShowcase>
    );
};

export default NotificationDemo;
