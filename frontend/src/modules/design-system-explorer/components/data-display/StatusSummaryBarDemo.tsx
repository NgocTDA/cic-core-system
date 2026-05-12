'use client';

import React, { useState } from 'react';
import { Typography, Row, Col, InputNumber } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { StatusSummaryBar, SummaryItem } from '@/components/ui';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const StatusSummaryBarDemo: React.FC = () => {
    const [errorCount,   setErrorCount]   = useState(18);
    const [warningCount, setWarningCount] = useState(42);
    const [infoCount,    setInfoCount]    = useState(56);
    const [successCount, setSuccessCount] = useState(210);

    useHeaderActions({ title: 'StatusSummaryBar' }, []);

    const items: SummaryItem[] = [
        { count: errorCount,   label: 'Hồ sơ lỗi',          color: 'error',   onClick: () => {} },
        { count: warningCount, label: 'Nghi ngờ sai lệch',   color: 'warning', onClick: () => {} },
        { count: infoCount,    label: 'Đang xem xét',        color: 'info',    onClick: () => {} },
        { count: successCount, label: 'Đã xử lý',            color: 'success'  },
    ];

    return (
        <ComponentShowcase
            name="StatusSummaryBar"
            group="data-display"
            description="Thanh tóm tắt số lượng bản ghi theo từng nhóm trạng thái, đặt phía trên bảng dữ liệu. Hỗ trợ click để filter."
            behaviors={[
                'Hiển thị số lượng bản ghi cho mỗi nhóm trạng thái với màu semantic',
                'Item có onClick sẽ hiện cursor pointer và opacity khi hover',
                'Item không có onClick là display-only (cursor default)',
                'Màu sắc: error (đỏ), warning (cam), info (xanh), success (xanh lá)',
                'Wrap sang hàng mới trên màn hình nhỏ',
                'Đặt trong SectionCard, phía trên Table',
            ]}
            controls={
                <Row gutter={[8, 8]}>
                    {[
                        { label: 'Hồ sơ lỗi',     value: errorCount,   setValue: setErrorCount },
                        { label: 'Nghi ngờ',       value: warningCount, setValue: setWarningCount },
                        { label: 'Đang xem xét',   value: infoCount,    setValue: setInfoCount },
                        { label: 'Đã xử lý',       value: successCount, setValue: setSuccessCount },
                    ].map((item) => (
                        <Col span={24} key={item.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>{item.label}</Text>
                                <InputNumber
                                    size="small"
                                    min={0}
                                    value={item.value}
                                    onChange={(v) => item.setValue(v ?? 0)}
                                    style={{ width: 80 }}
                                />
                            </div>
                        </Col>
                    ))}
                </Row>
            }
            code={`import { StatusSummaryBar, SummaryItem } from '@/components/ui';

const items: SummaryItem[] = [
  { count: 18,  label: 'Hồ sơ lỗi',        color: 'error',   onClick: () => setFilter('error') },
  { count: 42,  label: 'Nghi ngờ sai lệch', color: 'warning', onClick: () => setFilter('warning') },
  { count: 56,  label: 'Đang xem xét',      color: 'info',    onClick: () => setFilter('info') },
  { count: 210, label: 'Đã xử lý',          color: 'success' },
];

<SectionCard title="Danh sách hồ sơ">
  <StatusSummaryBar items={items} />
  <Table ... />
</SectionCard>`}
        >
            <StatusSummaryBar items={items} />
        </ComponentShowcase>
    );
};

export default StatusSummaryBarDemo;
