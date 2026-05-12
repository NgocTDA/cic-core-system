'use client';

import React from 'react';
import { Form, DatePicker, Typography, Alert, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const DATE_FORMAT = 'DD/MM/YYYY';

const DatePickerDemo: React.FC = () => {
    const [form] = Form.useForm();

    useHeaderActions({ title: 'DatePicker' }, []);

    return (
        <ComponentShowcase
            name="DatePicker"
            group="form"
            description="Bộ chọn ngày tháng theo định dạng chuẩn DD/MM/YYYY. RangePicker đảm bảo ngày kết thúc ≥ ngày bắt đầu."
            behaviors={[
                'Định dạng mặc định DD/MM/YYYY theo chuẩn hệ thống',
                'Cho phép nhập ngày bằng bàn phím hoặc chọn từ calendar',
                'Validate tính hợp lệ ngay khi blur (ngày không tồn tại, ký tự sai)',
                'Không cho nhập ngày < 01/01/1900',
                'RangePicker: ngày kết thúc phải ≥ ngày bắt đầu',
                'RangePicker tìm kiếm "từ ngày – đến ngày": mặc định để trống',
                'Khi giới hạn thời gian tìm kiếm: thông báo inline N ngày',
                'Hover hiển thị full datetime (hh:mm:ss) — cấu hình ở từng màn',
            ]}
            code={`import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const DATE_FORMAT = 'DD/MM/YYYY';

// Single date
<DatePicker
  format={DATE_FORMAT}
  placeholder={DATE_FORMAT}
  disabledDate={(d) => d && d.isBefore(dayjs('1900-01-01'))}
  style={{ width: '100%' }}
/>

// RangePicker (từ ngày – đến ngày)
<DatePicker.RangePicker
  format={DATE_FORMAT}
  placeholder={['Từ ngày', 'Đến ngày']}
  disabledDate={(current, { from }) => {
    if (from) return current.isBefore(from, 'day');
    return current.isBefore(dayjs('1900-01-01'));
  }}
  style={{ width: '100%' }}
/>

// Validate ngày sinh (không được > hôm nay)
<DatePicker
  format={DATE_FORMAT}
  disabledDate={(d) => d && d.isAfter(dayjs(), 'day')}
/>`}
            demoMinHeight={380}
        >
            <Form form={form} layout="vertical" style={{ maxWidth: 480 }}>
                {/* Single date */}
                <Form.Item
                    name="issueDate"
                    label={<><Text>Ngày hiệu lực</Text> <Text style={{ color: colors.error.base }}>*</Text></>}
                    rules={[{ required: true, message: 'Vui lòng chọn ngày hiệu lực' }]}
                >
                    <DatePicker
                        format={DATE_FORMAT}
                        placeholder={DATE_FORMAT}
                        disabledDate={(d) => d && d.isBefore(dayjs('1900-01-01'))}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                {/* Date of birth (not in future) */}
                <Form.Item
                    name="dob"
                    label="Ngày sinh (không được sau hôm nay)"
                >
                    <DatePicker
                        format={DATE_FORMAT}
                        placeholder={DATE_FORMAT}
                        disabledDate={(d) => d && d.isAfter(dayjs(), 'day')}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                {/* RangePicker */}
                <Form.Item
                    name="dateRange"
                    label="Khoảng thời gian tìm kiếm"
                    rules={[
                        {
                            validator: (_, value) => {
                                if (value && value[0] && value[1]) {
                                    const days = value[1].diff(value[0], 'day');
                                    if (days > 90) return Promise.reject('Thời gian tìm kiếm không được vượt quá 90 ngày');
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <RangePicker
                        format={DATE_FORMAT}
                        placeholder={['Từ ngày', 'Đến ngày']}
                        disabledDate={(current, { from }) => {
                            if (from) return current.isBefore(from, 'day');
                            return current && current.isBefore(dayjs('1900-01-01'));
                        }}
                        style={{ width: '100%' }}
                        allowClear
                    />
                </Form.Item>

                {/* DateTime picker */}
                <Form.Item
                    name="processedAt"
                    label="Ngày & giờ xử lý (DD/MM/YYYY HH:mm)"
                >
                    <DatePicker
                        showTime={{ format: 'HH:mm' }}
                        format="DD/MM/YYYY HH:mm"
                        placeholder="DD/MM/YYYY HH:mm"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Alert
                    type="info"
                    message="Lưu ý"
                    description="Mặc định RangePicker tìm kiếm để trống. Nếu nghiệp vụ giới hạn N ngày, validate sau khi chọn đủ 2 ngày và hiện thông báo inline."
                    showIcon
                    style={{ marginTop: spacing[2] }}
                />
            </Form>
        </ComponentShowcase>
    );
};

export default DatePickerDemo;
