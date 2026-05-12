'use client';

import React from 'react';
import { Alert, Space, Typography } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const AlertDemo: React.FC = () => {
    useHeaderActions({ title: 'Alert' }, []);

    return (
        <ComponentShowcase
            name="Alert"
            group="feedback"
            description="Thông báo inline trong giao diện. Dùng để cảnh báo người dùng về điều kiện quan trọng, hướng dẫn sử dụng, hoặc kết quả thao tác."
            behaviors={[
                'success: xanh lá — kết quả tốt, thao tác thành công',
                'info: xanh dương — hướng dẫn, thông tin hệ thống',
                'warning: cam — cảnh báo, cần chú ý nhưng không nghiêm trọng',
                'error: đỏ — lỗi, cần xử lý ngay',
                'closable: người dùng có thể đóng khi không cần nữa',
                'showIcon: luôn bật để dễ nhận diện loại thông báo',
            ]}
            code={`import { Alert } from 'antd';

// Inline trong trang
<Alert type="success" message="Dữ liệu đã được lưu thành công" showIcon />

// Với mô tả chi tiết
<Alert
  type="warning"
  message="Cảnh báo"
  description="Phiên đăng nhập sắp hết hạn sau 5 phút."
  showIcon
  closable
/>

// Thông tin hệ thống
<Alert
  type="info"
  message="Lưu ý"
  description="Thời gian tìm kiếm không được vượt quá 90 ngày."
  showIcon
/>`}
            demoMinHeight={480}
        >
            <Space direction="vertical" style={{ width: '100%', gap: spacing[3] }}>
                {/* Basic 4 types */}
                <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1 }}>
                    4 types cơ bản
                </Text>
                <Alert type="success" message="Thao tác thành công — Bản ghi đã được lưu" showIcon />
                <Alert type="info"    message="Hệ thống sẽ bảo trì lúc 23:00 tối nay" showIcon />
                <Alert type="warning" message="Dữ liệu không đầy đủ — Vui lòng kiểm tra lại" showIcon />
                <Alert type="error"   message="Không thể kết nối server — Thử lại sau" showIcon />

                {/* With description */}
                <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, marginTop: spacing[2] }}>
                    Với description + closable
                </Text>
                <Alert
                    type="warning"
                    message="Giới hạn thời gian tìm kiếm"
                    description="Thời gian tìm kiếm không được vượt quá 90 ngày. Vui lòng điều chỉnh bộ lọc."
                    showIcon
                    closable
                />
                <Alert
                    type="info"
                    message="Lưu ý về quy tắc phân quyền"
                    description="Chức năng này yêu cầu quyền 'Quản trị viên'. Liên hệ IT để được cấp quyền nếu cần."
                    showIcon
                    closable
                />
                <Alert
                    type="error"
                    message="Validation thất bại"
                    description="Có 3 trường không hợp lệ: Mã TCTD, Email, Ngày hiệu lực. Vui lòng kiểm tra lại."
                    showIcon
                />
            </Space>
        </ComponentShowcase>
    );
};

export default AlertDemo;
