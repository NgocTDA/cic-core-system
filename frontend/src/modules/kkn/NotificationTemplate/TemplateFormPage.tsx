import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';

import {
    Form,
    Input,
    Select,
    Button,
    Space,
    Row,
    Col,
    Tag,
    Tooltip,
    Divider,
    Typography,
    Popover,
    Tabs,
    Segmented,
    InputNumber,
    Empty,
    Card,
    message,
    TimePicker,
} from 'antd';
import dayjs from 'dayjs';
import {
    PlusOutlined,
    SettingOutlined,
    MailOutlined,
    MessageOutlined,
    BellOutlined,
    GlobalOutlined,
    RedoOutlined,
    ArrowLeftOutlined,
    SaveOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import type {
    INotificationTemplate,
    ChannelType,
    ActionType,
    TemplateLanguage,
} from './TemplateTypes';
import { mockVariables } from './../VariableRegistry/mockData';
import { mockTemplates } from './mockData';
import useHeaderActions from './../../../hooks/useHeaderActions';

const { TextArea } = Input;
const { Text, Title } = Typography;

const channelOptions: { value: ChannelType; label: string; icon: React.ReactNode }[] = [
    { value: 'SMS', label: 'SMS', icon: <MessageOutlined /> },
    { value: 'EMAIL', label: 'Email', icon: <MailOutlined /> },
    { value: 'IN_APP', label: 'In-App', icon: <BellOutlined /> },
    { value: 'WEB_PUSH', label: 'Web Push', icon: <GlobalOutlined /> },
];

const actionTypeOptions: { value: ActionType; label: string }[] = [
    { value: 'NONE', label: 'Không có' },
    { value: 'OPEN_URL', label: 'Mở URL' },
    { value: 'OPEN_SCREEN', label: 'Mở màn hình App' },
];

const groupOptions = [
    { value: 'Giao dịch', label: 'Giao dịch' },
    { value: 'Bảo mật', label: 'Bảo mật' },
    { value: 'Hệ thống', label: 'Hệ thống' },
    { value: 'Marketing', label: 'Marketing' },
];

const langOptions = [
    { value: 'vi', label: 'Tiếng Việt (VI)' },
    { value: 'en', label: 'Tiếng Anh (EN)' },
];

// Highlight {{variables}} in preview or replace with sample value
const renderHighlightedContent = (content: string, preview: boolean = false): React.ReactNode => {
    if (!content) return <Text type="secondary" italic>Chưa có nội dung</Text>;

    // Match {{variable_name}}
    const parts = content.split(/(\{\{[^}]+\}\})/g);

    return parts.map((part, i) => {
        if (part.startsWith('{{') && part.endsWith('}}')) {
            const varCode = part.slice(2, -2).trim();
            const variable = mockVariables.find(v => v.code === varCode);
            const displayValue = variable?.sampleValue || part;

            if (preview) {
                return (
                    <Tooltip key={i} title={`${part} → ${displayValue}`}>
                        <Tag color="processing" style={{ cursor: 'pointer', fontFamily: 'monospace', fontSize: 13, margin: '0 2px' }}>
                            {displayValue}
                        </Tag>
                    </Tooltip>
                );
            }

            return (
                <Tooltip key={i} title={`Biến: ${part}`}>
                    <Tag color="blue" style={{ margin: '0 2px', cursor: 'help' }}>{part}</Tag>
                </Tooltip>
            );
        }
        return <span key={i}>{part}</span>;
    });
};

// Variable picker popover
const VariablePicker: React.FC<{ onInsert: (code: string) => void }> = ({ onInsert }) => {
    const activeVars = mockVariables.filter(v => v.status === 'ACTIVE');
    return (
        <div style={{ maxHeight: 300, overflowY: 'auto', minWidth: 250 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Chọn biến để chèn:</Text>
            {activeVars.map(v => (
                <div
                    key={v.id}
                    onClick={() => onInsert(v.code)}
                    style={{
                        padding: '6px 8px',
                        cursor: 'pointer',
                        borderRadius: 4,
                        marginBottom: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f0f5ff')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                    <div>
                        <Text strong style={{ fontFamily: 'monospace', fontSize: 12, color: '#1677ff' }}>
                            {`{{${v.code}}}`}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 11 }}>{v.displayName}</Text>
                    </div>
                    <PlusOutlined style={{ color: '#1677ff' }} />
                </div>
            ))}
        </div>
    );
};

const TemplateFormPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string | undefined;
    const isEditMode = id !== undefined;
    const duplicateFrom: INotificationTemplate | undefined = undefined; // Next.js doesn't support state in router.push like react-router-dom

    const [form] = Form.useForm();
    const [activeLang, setActiveLang] = useState<TemplateLanguage>('vi');
    const [previewChannel, setPreviewChannel] = useState<ChannelType>('SMS');
    const [selectedChannels, setSelectedChannels] = useState<ChannelType[]>(['SMS']);
    const [selectedLangs, setSelectedLangs] = useState<TemplateLanguage[]>(['vi']);

    // Suggestion state for autocomplete
    const [suggestionState, setSuggestionState] = useState<{
        visible: boolean;
        x: number;
        y: number;
        filter: string;
        lang: string;
        channel: string;
        field: 'subject' | 'body';
        cursorPos: number;
        triggerPos: number;
    }>({
        visible: false, x: 0, y: 0, filter: '', lang: '', channel: '', field: 'body', cursorPos: 0, triggerPos: -1
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const [lastFocusedField, setLastFocusedField] = useState<string | null>(null);

    const fieldRefs = useRef<{ [key: string]: any }>({});
    const contentMap = Form.useWatch('contentMap', form);

    // Load data for edit mode
    useEffect(() => {
        if (isEditMode && id) {
            const template = mockTemplates.find(t => t.id === id);
            if (template) {
                form.setFieldsValue(template);
                setSelectedChannels(template.channels || ['SMS']);
                setSelectedLangs(template.languages || ['vi']);
                setPreviewChannel(template.channels?.[0] || 'SMS');
                setActiveLang(template.languages?.[0] || 'vi');
            }
        } /* else if (duplicateFrom) {
            form.setFieldsValue({ ...duplicateFrom, code: '', name: `${duplicateFrom.name} (Bản sao)` });
            setSelectedChannels(duplicateFrom.channels || ['SMS']);
            setSelectedLangs(duplicateFrom.languages || ['vi']);
            setPreviewChannel(duplicateFrom.channels?.[0] || 'SMS');
            setActiveLang(duplicateFrom.languages?.[0] || 'vi');
        } */
    }, [id, isEditMode, duplicateFrom, form]);

    // --- Autocomplete logic ---
    const getCursorXY = (element: any, position: number) => {
        // Handle both Input (native input) and TextArea (native textarea)
        const style = window.getComputedStyle(element);

        // Mirror div for calculation
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.visibility = 'hidden';
        div.style.top = '0';
        div.style.left = '0';
        div.style.pointerEvents = 'none';

        // Copy all relevant styles for text layout
        const props = [
            'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
            'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
            'border-style', 'box-sizing',
            'font-family', 'font-size', 'font-weight', 'line-height',
            'text-align', 'text-transform', 'letter-spacing', 'word-spacing',
            'width', 'height', 'overflow-y', 'white-space', 'word-wrap', 'overflow-wrap'
        ];
        props.forEach(prop => div.style.setProperty(prop, style.getPropertyValue(prop)));

        // Ensure mirror div matches scrollbar presence or behavior
        if (style.overflowY === 'scroll') {
            div.style.overflowY = 'scroll';
        } else if (style.overflowY === 'auto' && element.scrollHeight > element.clientHeight) {
            div.style.overflowY = 'scroll';
        } else {
            div.style.overflowY = 'hidden';
        }

        // Use pre-wrap for the mirror div content
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordWrap = 'break-word';

        div.textContent = element.value.substring(0, position);
        const span = document.createElement('span');
        span.textContent = element.value.substring(position, position + 2) || '{{';
        div.appendChild(span);
        document.body.appendChild(div);

        const spanRect = span.getBoundingClientRect();
        const divRect = div.getBoundingClientRect();
        document.body.removeChild(div);

        return {
            x: spanRect.left - divRect.left - element.scrollLeft,
            y: spanRect.top - divRect.top - element.scrollTop + (parseInt(style.lineHeight) || 22)
        };
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, lang: string, channel: string, field: 'subject' | 'body') => {
        const value = e.target.value;
        const pos = e.target.selectionStart || 0;

        const beforeCursor = value.substring(0, pos);
        const lastOpen = beforeCursor.lastIndexOf('{{');

        if (lastOpen !== -1) {
            const contentAfterOpen = beforeCursor.substring(lastOpen + 2);
            if (!/[\s}]/.test(contentAfterOpen)) {
                setSuggestionState(prev => {
                    // Update filter but keep coordinates if it's the same trigger block
                    if (prev.visible && prev.triggerPos === lastOpen && prev.field === field) {
                        return { ...prev, filter: contentAfterOpen, cursorPos: pos };
                    }

                    // Access native element via ref
                    const refKey = `${lang}-${channel}-${field}`;
                    const control = fieldRefs.current[refKey];
                    const nativeEl = control?.resizableTextArea?.textArea || control?.input || control?.nativeTextArea;
                    const targetEl = nativeEl || e.target;

                    const coords = getCursorXY(targetEl, lastOpen);
                    return {
                        visible: true,
                        x: coords.x,
                        y: coords.y,
                        filter: contentAfterOpen,
                        lang,
                        channel,
                        field,
                        cursorPos: pos,
                        triggerPos: lastOpen
                    };
                });
                setActiveIndex(0);
                return;
            }
        }
        setSuggestionState(prev => ({ ...prev, visible: false, triggerPos: -1 }));
    };

    const filteredVars = useMemo(() => {
        if (!suggestionState.visible) return [];
        return mockVariables.filter(v =>
            v.status === 'ACTIVE' &&
            (v.code.toLowerCase().includes(suggestionState.filter.toLowerCase()) ||
                v.displayName.toLowerCase().includes(suggestionState.filter.toLowerCase()))
        );
    }, [suggestionState.visible, suggestionState.filter]);

    const handleSuggestionSelect = (code: string) => {
        const { lang, channel, field, triggerPos, cursorPos } = suggestionState;
        const fieldPath = ['contentMap', lang, channel, field];
        const refKey = `${lang}-${channel}-${field}`;
        const control = fieldRefs.current[refKey];
        const nativeEl = control?.resizableTextArea?.textArea || control?.input || control?.nativeTextArea;

        const currentVal = form.getFieldValue(fieldPath) || '';
        const replacement = `{{${code}}}`;
        const newVal = currentVal.substring(0, triggerPos) + replacement + currentVal.substring(cursorPos);

        form.setFieldValue(fieldPath, newVal);
        setSuggestionState(prev => ({ ...prev, visible: false }));

        setTimeout(() => {
            if (nativeEl) {
                nativeEl.focus();
                const newPos = triggerPos + replacement.length;
                nativeEl.setSelectionRange(newPos, newPos);
            }
        }, 0);
    };

    const handleInsertVariable = (code: string, channel: ChannelType) => {
        let refKey = lastFocusedField;

        // Fallback: if no focus or focus is on another channel/lang, default to current body
        const currentPrefix = `${activeLang}-${channel}-`;
        if (!refKey || !refKey.startsWith(currentPrefix)) {
            refKey = `${activeLang}-${channel}-body`;
        }

        const fieldPath = ['contentMap', ...refKey.split('-')];
        const control = fieldRefs.current[refKey];
        const nativeEl = control?.resizableTextArea?.textArea || control?.input || control?.nativeTextArea;

        const currentVal = form.getFieldValue(fieldPath) || '';
        const textToInsert = `{{${code}}}`;

        if (nativeEl) {
            const start = nativeEl.selectionStart;
            const end = nativeEl.selectionEnd;
            const newVal = currentVal.substring(0, start) + textToInsert + currentVal.substring(end);
            form.setFieldValue(fieldPath, newVal);
            setTimeout(() => {
                nativeEl.focus();
                nativeEl.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
            }, 0);
        } else {
            form.setFieldValue(fieldPath, currentVal + textToInsert);
        }
    };

    const smsCounter = (text: string = '') => {
        const count = text.length;
        const parts = Math.ceil(count / 160) || 1;
        return { count, parts };
    };

    const handleKeyDown = (e: any) => {
        if (suggestionState.visible && filteredVars.length > 0) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(prev => (prev + 1) % filteredVars.length); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(prev => (prev - 1 + filteredVars.length) % filteredVars.length); }
            if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); handleSuggestionSelect(filteredVars[activeIndex].code); }
            if (e.key === 'Escape') { setSuggestionState(prev => ({ ...prev, visible: false })); }
        }
    };

    const currentPreviewData = useMemo(() => {
        return contentMap?.[activeLang]?.[previewChannel] || { body: '', subject: '', actionType: 'NONE' };
    }, [contentMap, activeLang, previewChannel]);

    const handleSubmit = (_values: any) => {
        message.success(isEditMode ? 'Cập nhật mẫu thông báo thành công' : 'Tạo mẫu thông báo thành công');
        router.push('/notification-template');
    };

    const handleCancel = () => {
        router.push('/notification-template');
    };

    // Set Header Title
    useHeaderActions({
        title: isEditMode ? 'Chỉnh sửa mẫu tin' : (duplicateFrom ? 'Sao chép mẫu thông báo' : 'Thiết lập mẫu thông báo mới')
    }, [isEditMode, duplicateFrom]);

    return (
        <div style={{ padding: '0 24px 24px' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    status: 'DRAFT',
                    priority: 'MEDIUM',
                    languages: ['vi'],
                    channels: ['SMS'],
                    throttling: { maxPerDay: 5, minIntervalMinutes: 5 },
                    contentMap: {
                        vi: {
                            SMS: { actionType: 'NONE', retryCount: 3, sendingTimeType: 'ALWAYS', startTime: '00:00:00', endTime: '00:00:00' },
                            EMAIL: { actionType: 'NONE', retryCount: 3, sendingTimeType: 'ALWAYS', startTime: '00:00:00', endTime: '00:00:00' },
                            IN_APP: { actionType: 'NONE', retryCount: 3, sendingTimeType: 'ALWAYS', startTime: '00:00:00', endTime: '00:00:00' },
                            WEB_PUSH: { actionType: 'NONE', retryCount: 3, sendingTimeType: 'ALWAYS', startTime: '00:00:00', endTime: '00:00:00' }
                        },
                        en: {
                            SMS: { actionType: 'NONE', retryCount: 3, sendingTimeType: 'ALWAYS', startTime: '00:00:00', endTime: '00:00:00' },
                            EMAIL: { actionType: 'NONE', retryCount: 3, sendingTimeType: 'ALWAYS', startTime: '00:00:00', endTime: '00:00:00' },
                            IN_APP: { actionType: 'NONE', retryCount: 3, sendingTimeType: 'ALWAYS', startTime: '00:00:00', endTime: '00:00:00' },
                            WEB_PUSH: { actionType: 'NONE', retryCount: 3, sendingTimeType: 'ALWAYS', startTime: '00:00:00', endTime: '00:00:00' }
                        }
                    }
                }}
            >
                <Row gutter={32}>
                    {/* LEFT: FORM */}
                    <Col span={15}>
                        <Card bordered={false} style={{ borderRadius: 6 }}>
                            <Divider orientation={"left" as any} style={{ margin: '0 0 20px' }}>
                                <Space><SettingOutlined /> Thông tin chung</Space>
                            </Divider>

                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item name="code" label="Mã mẫu" rules={[{ required: true, message: 'Vui lòng nhập mã mẫu' }]}>
                                        <Input placeholder="VD: OTP_LOGIN" style={{ fontFamily: 'monospace' }} disabled={isEditMode} />
                                    </Form.Item>
                                </Col>
                                <Col span={18}>
                                    <Form.Item name="name" label="Tên mẫu tin" rules={[{ required: true, message: 'Vui lòng nhập tên mẫu' }]}>
                                        <Input placeholder="VD: OTP Đăng nhập cho khách hàng" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item name="group" label="Nhóm nghiệp vụ" rules={[{ required: true }]}>
                                        <Select placeholder="Chọn nhóm" options={groupOptions} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="priority" label="Độ ưu tiên">
                                        <Select options={[
                                            { value: 'HIGH', label: 'Cao' },
                                            { value: 'MEDIUM', label: 'Thường' },
                                            { value: 'LOW', label: 'Thấp' }
                                        ]} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name={['throttling', 'maxPerDay']} label="Số tin tối đa /KH/ngày">
                                        <InputNumber min={1} style={{ width: '100%' }} placeholder="VD: 5" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name={['throttling', 'minIntervalMinutes']} label="Khoảng cách các tin (phút)">
                                        <InputNumber min={0} style={{ width: '100%' }} placeholder="VD: 5" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="channels" label="Kênh phát tin" rules={[{ required: true }]}>
                                        <Select
                                            mode="multiple"
                                            placeholder="Chọn kênh phát tin"
                                            onChange={(vals) => {
                                                setSelectedChannels(vals);
                                                if (vals.length > 0 && !vals.includes(previewChannel)) setPreviewChannel(vals[0]);
                                            }}
                                            options={channelOptions}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="languages" label="Ngôn ngữ hỗ trợ" rules={[{ required: true }]}>
                                        <Select mode="multiple" placeholder="Chọn ngôn ngữ hỗ trợ" onChange={setSelectedLangs} options={langOptions} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation={"left" as any} style={{ margin: '20px 0' }}>
                                <Space><GlobalOutlined /> Nội dung theo ngôn ngữ & kênh</Space>
                            </Divider>

                            <Tabs
                                activeKey={activeLang}
                                onChange={(key) => setActiveLang(key as TemplateLanguage)}
                                type="card"
                                items={selectedLangs.map(lang => ({
                                    key: lang,
                                    label: <Space><GlobalOutlined /> {lang === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'}</Space>,
                                    children: (
                                        <div style={{ background: '#fcfcfc', padding: '16px 20px', borderRadius: 6, border: '1px solid #f0f0f0' }}>
                                            {selectedChannels.length === 0 ? (
                                                <Empty description="Vui lòng chọn ít nhất một kênh gửi" />
                                            ) : (
                                                <Tabs
                                                    activeKey={previewChannel}
                                                    onChange={(key) => setPreviewChannel(key as ChannelType)}
                                                    type="card"
                                                    items={selectedChannels.map(channel => ({
                                                        key: channel,
                                                        label: <Space>{channelOptions.find(o => o.value === channel)?.icon} {channel}</Space>,
                                                        children: (
                                                            <div style={{ background: '#fff', padding: 20, borderRadius: '0 0 8px 8px', border: '1px solid #f0f0f0', borderTop: 0 }}>
                                                                <Row gutter={24}>
                                                                    <Col span={24}>
                                                                        {(channel === 'EMAIL' || channel === 'IN_APP' || channel === 'WEB_PUSH') && (
                                                                            <>
                                                                                <div style={{ position: 'relative', width: '100%' }}>
                                                                                    <div style={{ marginBottom: 8, width: '100%', display: 'flex' }}>
                                                                                        <Text strong style={{ flex: 1 }}>Tiêu đề thông báo</Text>
                                                                                    </div>
                                                                                    <Form.Item
                                                                                        name={['contentMap', lang, channel, 'subject']}
                                                                                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                                                                                    >
                                                                                        <Input
                                                                                            ref={(r) => { fieldRefs.current[`${lang}-${channel}-subject`] = r; }}
                                                                                            placeholder="Tiêu đề mail hoặc thông báo push"
                                                                                            onChange={(e) => handleFieldChange(e, lang, channel, 'subject')}
                                                                                            onFocus={() => setLastFocusedField(`${lang}-${channel}-subject`)}
                                                                                            onKeyDown={handleKeyDown}
                                                                                        />
                                                                                    </Form.Item>
                                                                                    {suggestionState.visible && filteredVars.length > 0 && suggestionState.lang === lang && suggestionState.channel === channel && suggestionState.field === 'subject' && (
                                                                                        <div
                                                                                            style={{
                                                                                                position: 'absolute',
                                                                                                left: suggestionState.x,
                                                                                                top: suggestionState.y,
                                                                                                zIndex: 3000,
                                                                                                background: '#fff',
                                                                                                boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                                                                                                borderRadius: 6,
                                                                                                border: '1px solid #f0f0f0',
                                                                                                minWidth: 220,
                                                                                                maxHeight: 250,
                                                                                                overflowY: 'auto',
                                                                                                padding: '4px 0',
                                                                                                pointerEvents: 'auto'
                                                                                            }}
                                                                                        >
                                                                                            {filteredVars.map((v: any, i: number) => (
                                                                                                <div
                                                                                                    key={v.id}
                                                                                                    style={{
                                                                                                        padding: '8px 12px',
                                                                                                        cursor: 'pointer',
                                                                                                        background: i === activeIndex ? '#e6f4ff' : 'transparent',
                                                                                                        display: 'flex',
                                                                                                        flexDirection: 'column',
                                                                                                        borderBottom: i === filteredVars.length - 1 ? 'none' : '1px solid #f9f9f9'
                                                                                                    }}
                                                                                                    onMouseEnter={() => setActiveIndex(i)}
                                                                                                    onClick={() => handleSuggestionSelect(v.code)}
                                                                                                >
                                                                                                    <Text strong style={{ fontSize: 13, color: i === activeIndex ? '#1677ff' : 'inherit' }}>{`{{${v.code}}}`}</Text>
                                                                                                    <Text type="secondary" style={{ fontSize: 11 }}>{v.displayName}</Text>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                            </>
                                                                        )}
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <div style={{ position: 'relative', width: '100%' }}>
                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, width: '100%' }}>
                                                                                <Text strong style={{ flex: 1 }}>Nội dung soạn thảo</Text>
                                                                                <Popover content={<VariablePicker onInsert={(code) => handleInsertVariable(code, channel)} />} trigger="click" placement="top">
                                                                                    <Button type="link" size="small" icon={<PlusOutlined />} style={{ padding: 0 }}>Chèn biến</Button>
                                                                                </Popover>
                                                                            </div>
                                                                            <Form.Item
                                                                                name={['contentMap', lang, channel, 'body']}
                                                                            >
                                                                                <TextArea
                                                                                    ref={(r) => { fieldRefs.current[`${lang}-${channel}-body`] = r; }}
                                                                                    rows={8}
                                                                                    placeholder="Kính gửi {{customer_name}}, ..."
                                                                                    style={{ fontFamily: 'monospace', fontSize: 13 }}
                                                                                    onChange={(e) => handleFieldChange(e, lang, channel, 'body')}
                                                                                    onFocus={() => setLastFocusedField(`${lang}-${channel}-body`)}
                                                                                    onKeyDown={handleKeyDown}
                                                                                />
                                                                            </Form.Item>
                                                                            {suggestionState.visible && filteredVars.length > 0 && suggestionState.lang === lang && suggestionState.channel === channel && suggestionState.field === 'body' && (
                                                                                <div
                                                                                    style={{
                                                                                        position: 'absolute',
                                                                                        left: suggestionState.x,
                                                                                        top: suggestionState.y,
                                                                                        zIndex: 3000,
                                                                                        background: '#fff',
                                                                                        boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                                                                                        borderRadius: 6,
                                                                                        border: '1px solid #f0f0f0',
                                                                                        minWidth: 220,
                                                                                        maxHeight: 250,
                                                                                        overflowY: 'auto',
                                                                                        padding: '4px 0',
                                                                                        pointerEvents: 'auto'
                                                                                    }}
                                                                                >
                                                                                    {filteredVars.map((v: any, i: number) => (
                                                                                        <div
                                                                                            key={v.id}
                                                                                            style={{
                                                                                                padding: '8px 12px',
                                                                                                cursor: 'pointer',
                                                                                                background: i === activeIndex ? '#e6f4ff' : 'transparent',
                                                                                                display: 'flex',
                                                                                                flexDirection: 'column',
                                                                                                borderBottom: i === filteredVars.length - 1 ? 'none' : '1px solid #f9f9f9'
                                                                                            }}
                                                                                            onMouseEnter={() => setActiveIndex(i)}
                                                                                            onClick={() => handleSuggestionSelect(v.code)}
                                                                                        >
                                                                                            <Text strong style={{ fontSize: 13, color: i === activeIndex ? '#1677ff' : 'inherit' }}>{`{{${v.code}}}`}</Text>
                                                                                            <Text type="secondary" style={{ fontSize: 11 }}>{v.displayName}</Text>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div style={{ marginTop: 0, textAlign: 'right' }}>
                                                                            {channel === 'SMS' && (
                                                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                                                    {smsCounter(contentMap?.[lang]?.[channel]?.body || '').count} kí tự | {smsCounter(contentMap?.[lang]?.[channel]?.body || '').parts} SMS
                                                                                </Text>
                                                                            )}
                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                                <Row gutter={16} style={{ marginTop: 16 }}>
                                                                    <Col span={8}>
                                                                        <Form.Item name={['contentMap', lang, channel, 'actionType']} label="Hành động bổ sung" rules={[{ required: true }]}>
                                                                            <Select options={actionTypeOptions} />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col span={16}>
                                                                        <Form.Item
                                                                            noStyle
                                                                            shouldUpdate={(prev, curr) =>
                                                                                prev?.contentMap?.[lang]?.[channel]?.actionType !== curr?.contentMap?.[lang]?.[channel]?.actionType
                                                                            }
                                                                        >
                                                                            {({ getFieldValue }) => {
                                                                                const type = getFieldValue(['contentMap', lang, channel, 'actionType']);
                                                                                return type !== 'NONE' ? (
                                                                                    <Form.Item name={['contentMap', lang, channel, 'actionValue']} label="Liên kết (URL hoặc Deeplink)">
                                                                                        <Input placeholder={type === 'OPEN_URL' ? 'https://...' : 'Mã màn hình ứng dụng'} />
                                                                                    </Form.Item>
                                                                                ) : null;
                                                                            }}
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>

                                                                <Divider dashed style={{ margin: '12px 0' }} />

                                                                <Row gutter={16}>
                                                                    <Col span={6}>
                                                                        <Form.Item name={['contentMap', lang, channel, 'retryCount']} label="Số lần gửi lại">
                                                                            <InputNumber min={0} max={10} style={{ width: '100%' }} prefix={<RedoOutlined />} />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col span={6}>
                                                                        <Form.Item name={['contentMap', lang, channel, 'sendingTimeType']} label="Khung giờ gửi">
                                                                            <Select
                                                                                onChange={(val) => {
                                                                                    let start = '00:00:00';
                                                                                    let end = '00:00:00';
                                                                                    if (val === 'WITHIN') { start = '06:00:00'; end = '21:00:00'; }
                                                                                    else if (val === 'OUTSIDE') { start = '21:00:00'; end = '06:00:00'; }
                                                                                    form.setFieldValue(['contentMap', lang, channel, 'startTime'], start);
                                                                                    form.setFieldValue(['contentMap', lang, channel, 'endTime'], end);
                                                                                }}
                                                                                options={[
                                                                                    { value: 'ALWAYS', label: 'Luôn gửi' },
                                                                                    { value: 'WITHIN', label: 'Trong khung giờ' },
                                                                                    { value: 'OUTSIDE', label: 'Ngoài khung giờ' },
                                                                                ]}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col span={6}>
                                                                        <Form.Item
                                                                            name={['contentMap', lang, channel, 'startTime']}
                                                                            label="Từ giờ"
                                                                            getValueProps={(value) => ({ value: value ? dayjs(value, 'HH:mm:ss') : undefined })}
                                                                            getValueFromEvent={(time) => time ? time.format('HH:mm:ss') : undefined}
                                                                        >
                                                                            <TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col span={6}>
                                                                        <Form.Item
                                                                            name={['contentMap', lang, channel, 'endTime']}
                                                                            label="Đến giờ"
                                                                            getValueProps={(value) => ({ value: value ? dayjs(value, 'HH:mm:ss') : undefined })}
                                                                            getValueFromEvent={(time) => time ? time.format('HH:mm:ss') : undefined}
                                                                        >
                                                                            <TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        )
                                                    }))}
                                                />
                                            )}
                                        </div>
                                    )
                                }))}
                            />
                        </Card>
                    </Col>

                    {/* RIGHT: LIVE PREVIEW */}
                    <Col span={9}>
                        <div style={{ position: 'sticky', top: 16 }}>
                            <Card bordered={false} style={{ borderRadius: 6 }}>
                                <div style={{ marginBottom: 16 }}>
                                    <Title level={5} style={{ marginTop: 0 }}>Live Preview - {activeLang === 'vi' ? 'VI' : 'EN'}</Title>
                                    <Segmented
                                        block
                                        value={previewChannel}
                                        onChange={(val) => setPreviewChannel(val as ChannelType)}
                                        options={selectedChannels.length > 0 ? selectedChannels.map(c => ({
                                            label: channelOptions.find(o => o.value === c)?.label,
                                            value: c,
                                            icon: channelOptions.find(o => o.value === c)?.icon
                                        })) : [{ label: 'N/A', value: '', disabled: true }]}
                                    />
                                </div>

                                {/* Phone Mockup */}
                                <div style={{
                                    width: 310, height: 580, background: '#000', borderRadius: 40,
                                    padding: 12, margin: '0 auto', boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
                                }}>
                                    <div style={{ background: '#fff', height: '100%', borderRadius: 30, position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ height: 40, background: '#f5f5f5', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
                                            <Text strong style={{ fontSize: 12 }}>9:41</Text>
                                            <Space size={4}>
                                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#333' }} />
                                            </Space>
                                        </div>
                                        <div style={{ padding: 16 }}>
                                            {previewChannel === 'EMAIL' ? (
                                                <div style={{ maxHeight: 450, overflowY: 'auto' }}>
                                                    <div style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 15 }}>
                                                        <Text type="secondary" style={{ fontSize: 11 }}>From: </Text>
                                                        <Text strong style={{ fontSize: 11 }}>CIC Việt Nam Support</Text><br />
                                                        <Text strong style={{ fontSize: 11 }}>Subject: </Text>
                                                        <Text strong style={{ fontSize: 12 }}>{renderHighlightedContent(currentPreviewData.subject || '', true)}</Text>
                                                    </div>
                                                    <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                                        {renderHighlightedContent(currentPreviewData.body || '', true)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ background: '#f0f0f0', padding: 12, borderRadius: 6, marginBottom: 10 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                        <Text strong style={{ fontSize: 12, color: '#1677ff' }}>CIC Việt Nam</Text>
                                                        <Text type="secondary" style={{ fontSize: 10 }}>vừa xong</Text>
                                                    </div>
                                                    {currentPreviewData.subject && (
                                                        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 4, whiteSpace: 'pre-wrap' }}>
                                                            {renderHighlightedContent(currentPreviewData.subject, true)}
                                                        </Text>
                                                    )}
                                                    <div style={{ fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                                        {renderHighlightedContent(currentPreviewData.body || '', true)}
                                                    </div>
                                                </div>
                                            )}
                                            {currentPreviewData.actionType !== 'NONE' && (
                                                <Button type="primary" block size="small" style={{ marginTop: 10, borderRadius: 6, fontSize: 12 }}>
                                                    {currentPreviewData.actionType === 'OPEN_URL' ? 'Xem chi tiết' : 'Mở ứng dụng'}
                                                </Button>
                                            )}
                                        </div>
                                        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: 100, height: 4, background: '#ddd', borderRadius: 2 }} />
                                    </div>
                                </div>

                                <div style={{ marginTop: 20, textAlign: 'center' }}>
                                    <Button size="middle" icon={<PlusOutlined />} onClick={() => message.info('Mã tin mẫu đang được gửi tới Email/SĐT của bạn...')}>
                                        Gửi thử đến tài khoản của tôi
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>

                {/* Sticky Footer Actions */}
                <div style={{
                    position: 'sticky', bottom: 0, left: 0, right: 0,
                    background: '#fff', borderTop: '1px solid #f0f0f0',
                    padding: '16px 0', marginTop: 24, zIndex: 10,
                    display: 'flex', justifyContent: 'center', gap: 12,
                }}>
                    <Button size="middle" icon={<ArrowLeftOutlined />} onClick={handleCancel} style={{ minWidth: 120 }}>
                        Hủy
                    </Button>
                    <Button size="middle" icon={<SaveOutlined />} onClick={() => message.info('Đã lưu bản nháp')} style={{ minWidth: 150 }}>
                        Lưu bản nháp
                    </Button>
                    <Button size="middle" type="primary" icon={<CheckCircleOutlined />} onClick={() => form.submit()} style={{ minWidth: 200 }}>
                        {isEditMode ? 'Cập nhật mẫu tin' : 'Phê duyệt & Kích hoạt'}
                    </Button>
                </div>
            </Form >
        </div >
    );
};

export default TemplateFormPage;
