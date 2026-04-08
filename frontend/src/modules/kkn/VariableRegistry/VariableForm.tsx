import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  Tooltip,
  Alert,
  Row,
  Col,
  Divider,
  message
} from 'antd';
import {
  LockOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  DatabaseOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { IVariable } from './VariableTypes';

const { TextArea } = Input;

interface VariableFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<IVariable>) => void;
  editingVariable: IVariable | null;
}

const VariableForm: React.FC<VariableFormProps> = ({
  visible,
  onClose,
  onSubmit,
  editingVariable
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingVariable) {
        form.setFieldsValue(editingVariable);
      } else {
        form.resetFields();
      }
    }
  }, [editingVariable, form, visible]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const isLocked = editingVariable?.isInUse === true;

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          <span>{editingVariable ? `Chỉnh sửa biến (v1.0.0)` : 'Thiết lập - CIC Core System'}</span>
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
            <Button key="submit" type="primary" onClick={handleSubmit} style={{ minWidth: 150 }}>
              {editingVariable ? 'Cập nhật' : 'Tạo mới biến'}
            </Button>
          </Space>
        </div>
      )}
    >
      <div style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto', padding: '0 12px' }}>
        <div style={{ paddingTop: 8 }}>
          {isLocked && (
            <Alert
              message="Biến đang trong trạng thái sử dụng"
              description="Mã định danh và kiểu dữ liệu hiện tại không thể thay đổi do biến này đã được gán vào mẫu tin đang hoạt động."
              type="warning"
              showIcon
              style={{ marginBottom: 24, borderRadius: 6 }}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            initialValues={{ status: 'ACTIVE', type: 'STRING' }}
          >
            <Divider orientation={"left" as any} style={{ marginTop: 0, marginBottom: 20 }}>
              <Space><InfoCircleOutlined /> Thông tin cơ bản</Space>
            </Divider>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label={
                    <Space>
                      Mã biến (Identifier)
                      {isLocked && <Tooltip title="Không thể sửa mã của biến đang sử dụng"><LockOutlined /></Tooltip>}
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập mã biến' }]}
                >
                  <Input
                    placeholder="VD: user_name, order_id"
                    disabled={isLocked}
                    style={{ fontFamily: 'monospace' }}
                    prefix={isLocked ? <LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} /> : null}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="displayName"
                  label="Tên hiển thị"
                  rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
                >
                  <Input placeholder="Tên thân thiện với người dùng" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="group"
              label="Nhóm nghiệp vụ"
              rules={[{ required: true, message: 'Vui lòng chọn nhóm biến' }]}
            >
              <Select placeholder="Chọn nhóm">
                <Select.Option value="Khách hàng">Khách hàng</Select.Option>
                <Select.Option value="Giao dịch">Giao dịch</Select.Option>
                <Select.Option value="Tài khoản">Tài khoản</Select.Option>
                <Select.Option value="Thẻ">Thẻ</Select.Option>
                <Select.Option value="Khuyến mãi">Khuyến mãi</Select.Option>
                <Select.Option value="Hệ thống">Hệ thống</Select.Option>
              </Select>
            </Form.Item>

            <Divider orientation={"left" as any} style={{ margin: '30px 0 20px' }}>
              <Space><DatabaseOutlined /> Cấu hình dữ liệu</Space>
            </Divider>

            <Row gutter={24}>
              <Col span={10}>
                <Form.Item
                  name="type"
                  label={
                    <Space>
                      Kiểu dữ liệu
                      {isLocked && <Tooltip title="Không thể sửa kiểu của biến đang sử dụng"><LockOutlined /></Tooltip>}
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
                >
                  <Select disabled={isLocked}>
                    <Select.Option value="STRING">Chuỗi (String)</Select.Option>
                    <Select.Option value="NUMBER">Số (Number)</Select.Option>
                    <Select.Option value="DATETIME">Ngày giờ (DateTime)</Select.Option>
                    <Select.Option value="CURRENCY">Tiền tệ (Currency)</Select.Option>
                    <Select.Option value="LIST">Danh sách (List/Array)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item
                  name="sampleValue"
                  label={
                    <Space>
                      Giá trị mẫu (Preview)
                      <Tooltip title="Dữ liệu giả lập dùng để hiển thị thử khi preview mẫu tin"><QuestionCircleOutlined /></Tooltip>
                    </Space>
                  }
                >
                  <Input placeholder="Nhập giá trị ví dụ" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Mô tả & Ghi chú"
            >
              <TextArea rows={3} placeholder="Ghi chú về nguồn gốc hoặc cách sử dụng biến..." />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default VariableForm;
