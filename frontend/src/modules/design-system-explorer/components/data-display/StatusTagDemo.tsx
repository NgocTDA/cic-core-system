'use client';

import React, { useState } from 'react';
import { Row, Col, Switch, Space, Typography, Divider } from 'antd';
import ComponentShowcase from '../../ComponentShowcase';
import { StatusTag, STATUS_CONFIG, StatusKey } from '@/components/ui';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as StatusKey[];

const StatusTagDemo: React.FC = () => {
    const [bordered, setBordered] = useState(false);

    useHeaderActions({ title: 'StatusTag' }, []);

    return (
        <ComponentShowcase
            name="StatusTag"
            group="data-display"
            description="Tag hiển thị trạng thái của bản ghi. Mỗi StatusKey được ánh xạ sang màu và label chuẩn định sẵn. Dùng nhất quán trong mọi table column trạng thái."
            behaviors={[
                'Render màu semantic theo StatusKey (success, warning, error, default, processing)',
                'Hiển thị label tiếng Việt tương ứng với mỗi trạng thái',
                'Hỗ trợ override label qua prop label',
                'bordered=false mặc định — không có viền ngoài',
                'minWidth giúp căn đều các tag trong cùng một cột',
                'Truyền string tuỳ ý nếu chưa có trong STATUS_CONFIG — fallback màu default',
            ]}
            controls={
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: '12px' }}>bordered</Text>
                        <Switch checked={bordered} onChange={setBordered} size="small" />
                    </div>
                </Space>
            }
            code={`import { StatusTag } from '@/components/ui';

// Dùng StatusKey chuẩn
<StatusTag status="ACTIVE" />
<StatusTag status="PENDING" />
<StatusTag status="REJECTED" />

// Override label
<StatusTag status="ACTIVE" label="Đang hoạt động" />

// Có border
<StatusTag status="RUNNING" bordered />

// minWidth để căn đều trong table column
<StatusTag status="APPROVED" minWidth={80} />`}
        >
            <div>
                {/* All statuses */}
                <Text style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 'var(--spacing-12)' }}>
                    Tất cả trạng thái ({ALL_STATUSES.length})
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-8)', marginBottom: 'var(--spacing-20)' }}>
                    {ALL_STATUSES.map((s) => (
                        <StatusTag key={s} status={s} bordered={bordered} />
                    ))}
                </div>

                <Divider style={{ margin: `var(--spacing-12) 0` }} />

                {/* Grouped by semantic */}
                <Row gutter={[16, 16]}>
                    {[
                        { group: 'Activation', statuses: ['ACTIVE', 'INACTIVE'] as StatusKey[] },
                        { group: 'Job execution', statuses: ['RUNNING', 'IDLE', 'SCHEDULED', 'FAILED', 'PAUSED'] as StatusKey[] },
                        { group: 'Approval workflow', statuses: ['PENDING', 'APPROVED', 'REJECTED'] as StatusKey[] },
                        { group: 'Thông báo (Notification)', statuses: ['UNREAD', 'READ'] as StatusKey[] },
                        { group: 'Data quality', statuses: ['VALID', 'INVALID', 'ERROR', 'REVIEWING', 'CLOSED'] as StatusKey[] },
                    ].map((grp) => (
                        <Col key={grp.group} xs={24} sm={12}>
                            <Text style={{ fontSize: '11px', color: 'var(--text-subtle)', display: 'block', marginBottom: 'var(--spacing-8)' }}>
                                {grp.group}
                            </Text>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-8)' }}>
                                {grp.statuses.map((s) => (
                                    <StatusTag key={s} status={s} bordered={bordered} minWidth={90} />
                                ))}
                            </div>
                        </Col>
                    ))}
                </Row>

                <Divider style={{ margin: `var(--spacing-12) 0` }} />

                {/* Custom label */}
                <Text style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--spacing-8)' }}>
                    Override label
                </Text>
                <Space wrap>
                    <StatusTag status="ACTIVE" label="Đang hoạt động" bordered={bordered} />
                    <StatusTag status="PENDING" label="Chờ xử lý" bordered={bordered} />
                    <StatusTag status="custom-status" bordered={bordered} />
                </Space>
            </div>
        </ComponentShowcase>
    );
};

export default StatusTagDemo;
