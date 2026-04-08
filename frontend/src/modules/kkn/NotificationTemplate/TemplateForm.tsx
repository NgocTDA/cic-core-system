import React, { useEffect, useState, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  Switch,
  Tag,
  Tooltip,
  Divider,
  Typography,
  Popover,
  Tabs,
  InputNumber,
  Segmented,
  Empty,
  message,
} from 'antd';
import type { GetRef } from 'antd';
import {
  MobileOutlined,
  PlusOutlined,
  GlobalOutlined,
  MailOutlined,
  MessageOutlined,
  BellOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import type {
  INotificationTemplate,
  ChannelType,
  ActionType,
  TemplateLanguage,
} from './TemplateTypes';
import { mockVariables } from './../VariableRegistry/mockData';

const { TextArea } = Input;
const { Text, Title } = Typography;

type TextAreaRef = GetRef<typeof TextArea>;

interface TemplateFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  editingTemplate: INotificationTemplate | null;
}

const channelOptions: { value: ChannelType; label: string; icon: React.ReactNode }[] = [
  { value: 'SMS', label: 'SMS', icon: <MessageOutlined /> },
  { value: 'EMAIL', label: 'Email', icon: <MailOutlined /> },
  { value: 'IN_APP', label: 'In-app Push', icon: <MobileOutlined /> },
  { value: 'WEB_PUSH', label: 'Web Push', icon: <BellOutlined /> },
];

const actionTypeOptions: { value: ActionType; label: string }[] = [
  { value: 'NONE', label: 'Không có' },
  { value: 'OPEN_URL', label: 'Mở URL' },
  { value: 'OPEN_SCREEN', label: 'Mở màn hình' },
];

const groupOptions = [
  { value: 'Bảo mật', label: 'Bảo mật' },
  { value: 'Giao dịch', label: 'Giao dịch' },
  { value: 'Hệ thống', label: 'Hệ thống' },
  { value: 'Marketing', label: 'Marketing' },
];

const langOptions = [
  { value: 'vi', label: 'Tiếng Việt (VI)' },
  { value: 'en', label: 'Tiếng Anh (EN)' },
];

const renderHighlightedContent = (content: string): React.ReactNode => {
  if (!content) return <Text type="secondary" italic>Chưa có nội dung...</Text>;

  const parts = content.split(/({{[^}]+}})/g);
  return parts.map((part, i) => {
    if (part.match(/^{{[^}]+}}$/)) {
      const varCode = part.replace(/[{}]/g, '');
      const variable = mockVariables.find(v => v.code === varCode);
      const displayValue = variable?.sampleValue || part;
      return (
        <Tooltip key={i} title={`${part} → ${displayValue}`}>
          <Tag color="processing" style={{ cursor: 'pointer', fontFamily: 'monospace', fontSize: 13, margin: '0 2px' }}>
            {displayValue}
          </Tag>
        </Tooltip>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const VariablePicker: React.FC<{ onInsert: (code: string) => void }> = ({ onInsert }) => {
  const groupedVars = mockVariables.reduce<Record<string, typeof mockVariables>>((acc, v) => {
    if (!acc[v.group]) acc[v.group] = [];
    acc[v.group].push(v);
    return acc;
  }, {});

  return (
    <div style={{ maxHeight: 300, overflowY: 'auto', width: 280, padding: '4px' }}>
      {Object.entries(groupedVars).map(([group, vars]) => (vars.length > 0 && (
        <div key={group} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', marginBottom: 6 }}>
            {group}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {vars.filter(v => v.status === 'ACTIVE').map(v => (
              <Tag
                key={v.id}
                color="blue"
                style={{ cursor: 'pointer', fontFamily: 'monospace', borderRadius: 4, margin: 0 }}
                onClick={() => onInsert(v.code)}
              >
                {`{{${v.code}}}`}
              </Tag>
            ))}
          </div>
        </div>
      )))}
    </div>
  );
};

const TemplateForm: React.FC<TemplateFormProps> = ({
  visible,
  onClose,
  onSubmit,
  editingTemplate
}) => {
  const [form] = Form.useForm();

  const [activeLang, setActiveLang] = useState<TemplateLanguage>('vi');
  const [previewChannel, setPreviewChannel] = useState<ChannelType>('SMS');
  const [selectedChannels, setSelectedChannels] = useState<ChannelType[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<TemplateLanguage[]>(['vi']);

  // Suggestion state
  const [suggestionState, setSuggestionState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    filter: string;
    lang: string;
    channel: string;
    cursorPos: number;
  }>({ visible: false, x: 0, y: 0, filter: '', lang: '', channel: '', cursorPos: 0 });

  const [activeIndex, setActiveIndex] = useState(0);

  // Ref map to store TextArea refs for each (lang, channel) combination
  const textAreaRefs = useRef<Record<string, TextAreaRef | null>>({});

  const contentMap = Form.useWatch('contentMap', form);

  // Helper to get cursor coordinates relative to viewport
  const getCursorXY = (element: HTMLTextAreaElement, position: number) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    // Create a mirror div to calculate position
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    div.style.width = `${rect.width}px`; // Use pixel width for exact wrapping
    div.style.height = `${rect.height}px`;
    div.style.top = '0';
    div.style.left = '0';

    // Copy essential styles
    const props = [
      'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
      'font-family', 'font-size', 'font-weight', 'line-height', 'box-sizing', 'text-align'
    ];
    props.forEach(prop => {
      div.style.setProperty(prop, style.getPropertyValue(prop));
    });

    div.textContent = element.value.substring(0, position);
    const span = document.createElement('span');
    span.textContent = element.value.substring(position, position + 1) || '.';
    div.appendChild(span);
    document.body.appendChild(div);

    const spanRect = span.getBoundingClientRect();
    const divRect = div.getBoundingClientRect();
    document.body.removeChild(div);

    // Calculate absolute viewport coordinates
    return {
      x: rect.left + (spanRect.left - divRect.left) - element.scrollLeft,
      y: rect.top + (spanRect.top - divRect.top) - element.scrollTop + parseInt(style.lineHeight || '22')
    };
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, lang: string, channel: string) => {
    const value = e.target.value;
    const pos = e.target.selectionStart;
    const beforeCursor = value.substring(0, pos);
    const lastOpen = beforeCursor.lastIndexOf('{{');

    if (lastOpen !== -1) {
      const contentAfterOpen = beforeCursor.substring(lastOpen + 2);
      if (!contentAfterOpen.includes(' ') && !contentAfterOpen.includes('}')) {
        const coords = getCursorXY(e.target, lastOpen);
        setSuggestionState({
          visible: true,
          x: coords.x,
          y: coords.y,
          filter: contentAfterOpen,
          lang,
          channel,
          cursorPos: pos
        });
        setActiveIndex(0);
        return;
      }
    }
    setSuggestionState(prev => ({ ...prev, visible: false }));
  };

  const filteredVars = useMemo(() => {
    if (!suggestionState.visible) return [];
    return mockVariables.filter(v =>
      v.status === 'ACTIVE' &&
      (v.code.toLowerCase().includes(suggestionState.filter.toLowerCase()) ||
        v.displayName.toLowerCase().includes(suggestionState.filter.toLowerCase()))
    );
  }, [suggestionState.visible, suggestionState.filter]);

  const handleSuggestionSelect = (varCode: string) => {
    const { lang, channel, cursorPos, filter } = suggestionState;
    const currentVal = form.getFieldValue(['contentMap', lang, channel, 'body']) || '';
    const beforeMatch = currentVal.substring(0, cursorPos - filter.length - 2);
    const afterMatch = currentVal.substring(cursorPos);

    const newVal = `${beforeMatch}{{${varCode}}}${afterMatch}`;

    const newContentMap = { ...form.getFieldValue('contentMap') };
    if (!newContentMap[lang]) newContentMap[lang] = {};
    if (!newContentMap[lang][channel]) newContentMap[lang][channel] = {};
    newContentMap[lang][channel].body = newVal;

    form.setFieldsValue({ contentMap: newContentMap });
    setSuggestionState(prev => ({ ...prev, visible: false }));

    // Focus back and move cursor
    setTimeout(() => {
      const ref = textAreaRefs.current[`${lang}-${channel}`];
      if (ref && ref.resizableTextArea) {
        const textArea = ref.resizableTextArea.textArea;
        textArea.focus();
        const newPos = beforeMatch.length + varCode.length + 4;
        textArea.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  useEffect(() => {
    if (visible) {
      if (editingTemplate) {
        form.setFieldsValue(editingTemplate);
        setSelectedChannels(editingTemplate.channels || []);
        setSelectedLangs(editingTemplate.languages || ['vi']);
        setPreviewChannel(editingTemplate.channels?.[0] || 'SMS');
        setActiveLang(editingTemplate.languages?.[0] || 'vi');
      } else {
        form.resetFields();
        setSelectedChannels(['SMS']);
        setSelectedLangs(['vi']);
        setPreviewChannel('SMS');
        setActiveLang('vi');
      }
    }
  }, [editingTemplate, form, visible]);

  const currentPreviewData = useMemo(() => {
    return contentMap?.[activeLang]?.[previewChannel] || { body: '', subject: '', actionType: 'NONE' };
  }, [contentMap, activeLang, previewChannel]);

  const handleInsertVariable = (code: string, channel: ChannelType) => {
    const fieldPath = ['contentMap', activeLang, channel, 'body'];
    const refKey = `${activeLang}-${channel}`;
    const textAreaControl = textAreaRefs.current[refKey];
    const nativeTextArea = (textAreaControl as any)?.resizableTextArea?.textArea as HTMLTextAreaElement;

    if (nativeTextArea) {
      const start = nativeTextArea.selectionStart;
      const end = nativeTextArea.selectionEnd;
      const currentVal = form.getFieldValue(fieldPath) || '';
      const textToInsert = `{{${code}}}`;

      const newVal = currentVal.substring(0, start) + textToInsert + currentVal.substring(end);

      form.setFieldValue(fieldPath, newVal);

      // Focus and set cursor position after current insertion
      setTimeout(() => {
        nativeTextArea.focus();
        nativeTextArea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
      }, 0);
    } else {
      // Fallback if no cursor position found
      const currentVal = form.getFieldValue(fieldPath) || '';
      form.setFieldValue(fieldPath, currentVal + `{{${code}}}`);
    }
  };

  const smsCounter = (text: string = '') => {
    const count = text.length;
    const parts = Math.ceil(count / 160) || 1;
    return { count, parts };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (suggestionState.visible && filteredVars.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredVars.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredVars.length) % filteredVars.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSuggestionSelect(filteredVars[activeIndex].code);
      } else if (e.key === 'Escape') {
        setSuggestionState(prev => ({ ...prev, visible: false }));
      }
    }
  };

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          <span>{editingTemplate ? `Chỉnh sửa mẫu tin (v${editingTemplate.version})` : 'Thiết lập - CIC Core System'}</span>
        </Space>
      }
      width="80%"
      centered
      onCancel={onClose}
      open={visible}
      maskClosable={false}
      destroyOnClose
      footer={(
        <div style={{ textAlign: 'center', width: '100%', paddingBottom: 8 }}>
          <Space>
            <Button key="cancel" onClick={onClose} style={{ minWidth: 100 }}>Hủy</Button>
            <Button key="save" type="default" onClick={() => message.info('Đã lưu bản nháp')} style={{ minWidth: 120 }}>Lưu bản nháp</Button>
            <Button key="submit" type="primary" onClick={() => form.submit()} style={{ minWidth: 150 }}>
              {editingTemplate ? 'Cập nhật mẫu tin' : 'Phê duyệt & Kích hoạt'}
            </Button>
          </Space>
        </div>
      )}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          status: 'DRAFT',
          priority: 'MEDIUM',
          languages: ['vi'],
          channels: ['SMS'],
          throttling: { maxPerDay: 5, minIntervalMinutes: 5 }
        }}
      >
        <div style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto', overflowX: 'hidden', padding: '0 12px' }}>
          <Row gutter={32}>
            <Col span={15}>
              <div style={{ paddingRight: 8 }}>
                <Divider orientation={"left" as any} style={{ margin: '0 0 20px' }}>
                  <Space><SettingOutlined /> Thông tin chung</Space>
                </Divider>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="code" label="Mã mẫu" rules={[{ required: true, message: 'Vui lòng nhập mã mẫu' }]}>
                      <Input
                        placeholder="VD: OTP_LOGIN"
                        style={{ fontFamily: 'monospace' }}
                        disabled={!!(editingTemplate && editingTemplate.status !== 'DRAFT')}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="name" label="Tên mẫu tin" rules={[{ required: true, message: 'Vui lòng nhập tên mẫu' }]}>
                      <Input placeholder="VD: OTP Đăng nhập cho khách hàng" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="group" label="Nhóm nghiệp vụ" rules={[{ required: true }]}>
                      <Select placeholder="Chọn nhóm" options={groupOptions} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="priority" label="Độ ưu tiên">
                      <Select
                        options={[
                          { value: 'HIGH', label: 'Cao' },
                          { value: 'MEDIUM', label: 'Thường' },
                          { value: 'LOW', label: 'Thấp' }
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={['throttling', 'maxPerDay']} label="Số tin tối đa /KH/ngày">
                      <InputNumber min={1} style={{ width: '100%' }} placeholder="VD: 5" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={['throttling', 'minIntervalMinutes']} label="Khoảng cách 2 tin (phút)">
                      <InputNumber min={0} style={{ width: '100%' }} placeholder="VD: 5" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item name="channels" label="Kênh phát tin" rules={[{ required: true }]}>
                      <Select
                        mode="multiple"
                        placeholder="Chọn kênh phát tin"
                        onChange={(vals) => {
                          setSelectedChannels(vals);
                          if (vals.length > 0 && !vals.includes(previewChannel)) {
                            setPreviewChannel(vals[0]);
                          }
                        }}
                        options={channelOptions}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item name="languages" label="Ngôn ngữ hỗ trợ" rules={[{ required: true }]}>
                      <Select
                        mode="multiple"
                        placeholder="Chọn ngôn ngữ hỗ trợ"
                        onChange={setSelectedLangs}
                        options={langOptions}
                      />
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
                                        <Form.Item
                                          name={['contentMap', lang, channel, 'subject']}
                                          label="Tiêu đề thông báo"
                                          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                                        >
                                          <Input placeholder="Tiêu đề mail hoặc thông báo push" />
                                        </Form.Item>
                                      )}
                                    </Col>
                                    <Col span={24}>
                                      <Form.Item label={<Text strong>Nội dung soạn thảo</Text>}>
                                        <div style={{ position: 'relative' }}>
                                          <TextArea
                                            ref={(r) => { textAreaRefs.current[`${lang}-${channel}`] = r; }}
                                            rows={6}
                                            value={contentMap?.[lang]?.[channel]?.body || ''}
                                            placeholder="Kính gửi {{customer_name}}, ..."
                                            style={{ fontFamily: 'monospace', fontSize: 13 }}
                                            onChange={(e) => handleTextAreaChange(e, lang, channel)}
                                            onKeyDown={handleKeyDown}
                                          />

                                          {/* Floating Suggestion Menu - Rendered via Portal at Viewport-relative fixed position */}
                                          {suggestionState.visible && filteredVars.length > 0 && suggestionState.lang === lang && suggestionState.channel === channel &&
                                            ReactDOM.createPortal(
                                              <div
                                                style={{
                                                  position: 'fixed',
                                                  left: suggestionState.x,
                                                  top: suggestionState.y,
                                                  zIndex: 3000, // Above everything
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
                                                {filteredVars.map((v, i) => (
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
                                                    <Text strong style={{ fontSize: 13, color: i === activeIndex ? '#1677ff' : 'inherit' }}>
                                                      {`{{${v.code}}}`}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>{v.displayName}</Text>
                                                  </div>
                                                ))}
                                              </div>,
                                              document.body
                                            )
                                          }
                                        </div>
                                        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Popover content={<VariablePicker onInsert={(code) => handleInsertVariable(code, channel)} />} trigger="click" placement="top">
                                            <Button type="link" size="small" icon={<PlusOutlined />} style={{ padding: 0 }}>Chèn biến</Button>
                                          </Popover>
                                          {channel === 'SMS' && (
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                              {smsCounter(contentMap?.[lang]?.[channel]?.body).count} kí tự | {smsCounter(contentMap?.[lang]?.[channel]?.body).parts} SMS
                                            </Text>
                                          )}
                                        </div>
                                      </Form.Item>
                                    </Col>
                                  </Row>

                                  <Row gutter={16}>
                                    <Col span={10}>
                                      <Form.Item name={['contentMap', lang, channel, 'actionType']} label="Loại hành động (CTA)">
                                        <Select options={actionTypeOptions} />
                                      </Form.Item>
                                    </Col>
                                    <Col span={14}>
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
                                    <Col span={12}>
                                      <Form.Item name={['contentMap', lang, channel, 'quietHours']} label="Khung giờ yên tĩnh" valuePropName="checked">
                                        <Switch
                                          checkedChildren={<Space><ClockCircleOutlined /> Tránh gửi đêm</Space>}
                                          unCheckedChildren={<Space><ClockCircleOutlined /> Luôn gửi</Space>}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                      <Form.Item name={['contentMap', lang, channel, 'retryCount']} label="Số lần gửi lại">
                                        <InputNumber min={0} max={10} style={{ width: '100%' }} prefix={<RedoOutlined />} />
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
              </div>
            </Col>

            {/* RIGHT: LIVE PREVIEW AREA */}
            <Col span={9}>
              <div style={{ position: 'sticky', top: 0, height: 'calc(80vh - 120px)', display: 'flex', flexDirection: 'column' }}>
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

                <div style={{
                  width: 310,
                  height: 580,
                  background: '#000',
                  borderRadius: 40,
                  padding: 12,
                  margin: '0 auto',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
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
                            <Text type="secondary" style={{ fontSize: 11 }}>Subject: </Text>
                            <Text strong style={{ fontSize: 12 }}>{renderHighlightedContent(currentPreviewData.subject || '')}</Text>
                          </div>
                          <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {renderHighlightedContent(currentPreviewData.body)}
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
                              {renderHighlightedContent(currentPreviewData.subject)}
                            </Text>
                          )}
                          <div style={{ fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                            {renderHighlightedContent(currentPreviewData.body)}
                          </div>
                        </div>
                      )}

                      {currentPreviewData.actionType !== 'NONE' && (
                        <Button type="primary" block size="small" style={{ marginTop: 10, fontSize: 12 }}>
                          {currentPreviewData.actionType === 'OPEN_URL' ? 'Xem chi tiết' : 'Mở ứng dụng'}
                        </Button>
                      )}
                    </div>
                    <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: 100, height: 4, background: '#ddd', borderRadius: 2 }} />
                  </div>
                </div>

                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  <Button icon={<PlusOutlined />} onClick={() => message.info('Mã tin mẫu đang được gửi tới Email/SĐT của bạn...')}>
                    Gửi thử bản này
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};

export default TemplateForm;
