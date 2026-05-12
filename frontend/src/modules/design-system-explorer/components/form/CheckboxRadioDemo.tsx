'use client';

import React, { useState } from 'react';
import { Form, Checkbox, Radio, Typography, Space, Divider, Alert, Row, Col } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import ComponentShowcase from '../../ComponentShowcase';
import { colors, typography, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';

const { Text } = Typography;

const STATUSES  = ['ACTIVE', 'INACTIVE', 'PENDING', 'REJECTED', 'RUNNING'];
const ROLES     = ['Quản trị viên', 'Nhân viên nghiệp vụ', 'Kiểm duyệt viên'];
const SUBSYSTEMS = [
    { value: 'kkn',        label: 'Kênh kết nối' },
    { value: 'collection', label: 'Thu thập dữ liệu' },
    { value: 'product',    label: 'Quản lý sản phẩm' },
    { value: 'ops',        label: 'Hỗ trợ vận hành' },
    { value: 'analytics',  label: 'Báo cáo thống kê' },
    { value: 'governance', label: 'Quản trị dữ liệu' },
];

const CheckboxRadioDemo: React.FC = () => {
    const [checkedList, setCheckedList] = useState<string[]>(['ACTIVE', 'RUNNING']);
    const [radioValue,  setRadioValue]  = useState('Nhân viên nghiệp vụ');
    const [form] = Form.useForm();

    useHeaderActions({ title: 'Checkbox & Radio' }, []);

    const isAllChecked = checkedList.length === STATUSES.length;
    const isIndeterminate = checkedList.length > 0 && checkedList.length < STATUSES.length;

    const handleSelectAll = (e: CheckboxChangeEvent) => {
        setCheckedList(e.target.checked ? [...STATUSES] : []);
    };

    return (
        <ComponentShowcase
            name="Checkbox & Radio Button"
            group="form"
            description="Checkbox hỗ trợ 3 trạng thái (indeterminate) khi có 'Chọn tất cả'. Radio dùng cho < 6 options. Cả hai hỗ trợ keyboard."
            behaviors={[
                'Checkbox "Chọn tất cả": 3 trạng thái — unchecked / indeterminate / checked',
                'Indeterminate khi có ≥1 mục được chọn nhưng chưa đủ tất cả',
                'Space để toggle, Tab để di chuyển giữa các item',
                'Không submit nếu required mà chưa chọn',
                'Checkbox: nếu > 6 options thì chuyển sang Combobox/Select',
                'Radio: dùng cho < 6 lựa chọn loại trừ nhau',
                'Radio: nếu > 5 lựa chọn thì chuyển sang Dropdown',
            ]}
            code={`import { Checkbox, Radio } from 'antd';

// Checkbox với "Chọn tất cả" + indeterminate
const isAll = checked.length === OPTIONS.length;
const isIndet = checked.length > 0 && !isAll;

<Checkbox indeterminate={isIndet} checked={isAll} onChange={handleAll}>
  Chọn tất cả
</Checkbox>
<Checkbox.Group value={checked} onChange={setChecked}>
  {OPTIONS.map(o => <Checkbox key={o} value={o}>{o}</Checkbox>)}
</Checkbox.Group>

// Radio group (< 6 options)
<Radio.Group value={value} onChange={e => setValue(e.target.value)}>
  <Radio value="A">Option A</Radio>
  <Radio value="B">Option B</Radio>
</Radio.Group>`}
            demoMinHeight={400}
        >
            <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                    {/* Checkbox with select-all + indeterminate */}
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: spacing[3] }}>
                        Checkbox — Select All + Indeterminate
                    </Text>
                    <div
                        style={{
                            padding: spacing[4],
                            background: colors.bg.subtle,
                            borderRadius: 6,
                            border: `1px solid ${colors.border.split}`,
                            marginBottom: spacing[4],
                        }}
                    >
                        <Checkbox
                            indeterminate={isIndeterminate}
                            checked={isAllChecked}
                            onChange={handleSelectAll}
                            style={{ fontWeight: typography.fontWeight.semibold, marginBottom: spacing[3] }}
                        >
                            Chọn tất cả
                        </Checkbox>
                        <Divider style={{ margin: `${spacing[2]} 0` }} />
                        <Checkbox.Group
                            value={checkedList}
                            onChange={(vals) => setCheckedList(vals as string[])}
                            style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}
                        >
                            {STATUSES.map((s) => (
                                <Checkbox key={s} value={s}>
                                    <code style={{ fontFamily: typography.fontFamily.mono, fontSize: 12 }}>{s}</code>
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                        <div style={{ marginTop: spacing[3], fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                            Đã chọn: {checkedList.length}/{STATUSES.length}
                        </div>
                    </div>

                    {/* Checkbox > 6 → note to use Select */}
                    <Alert
                        type="warning"
                        message="Nếu > 6 options thì dùng Select / Combobox thay Checkbox"
                        showIcon
                        style={{ fontSize: typography.fontSize.xs }}
                    />
                </Col>

                <Col xs={24} md={12}>
                    {/* Radio < 6 options */}
                    <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: spacing[3] }}>
                        Radio — {'<'} 6 options
                    </Text>
                    <div
                        style={{
                            padding: spacing[4],
                            background: colors.bg.subtle,
                            borderRadius: 6,
                            border: `1px solid ${colors.border.split}`,
                            marginBottom: spacing[4],
                        }}
                    >
                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, display: 'block', marginBottom: spacing[3] }}>
                            Vai trò (3 options — dùng Radio)
                        </Text>
                        <Radio.Group
                            value={radioValue}
                            onChange={(e) => setRadioValue(e.target.value)}
                            style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}
                        >
                            {ROLES.map((r) => (
                                <Radio key={r} value={r}>{r}</Radio>
                            ))}
                        </Radio.Group>

                        <Divider style={{ margin: `${spacing[3]} 0` }} />

                        <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.tertiary, display: 'block', marginBottom: spacing[3] }}>
                            Radio Button Group (horizontal)
                        </Text>
                        <Radio.Group defaultValue="day" buttonStyle="solid" size="small">
                            {['Ngày', 'Tuần', 'Tháng', 'Quý', 'Năm'].map((p) => (
                                <Radio.Button key={p} value={p.toLowerCase()}>{p}</Radio.Button>
                            ))}
                        </Radio.Group>
                    </div>

                    <Alert
                        type="warning"
                        message="Nếu > 5 options thì dùng Dropdown thay Radio"
                        showIcon
                        style={{ fontSize: typography.fontSize.xs }}
                    />
                </Col>
            </Row>
        </ComponentShowcase>
    );
};

export default CheckboxRadioDemo;
