'use client';
import React, { useEffect } from 'react';
import {
  Form, Input, Select, DatePicker, Switch, Row, Col, Tabs,
  Checkbox, InputNumber, Divider, Space, App, Card,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, SendOutlined,
  AppstoreOutlined, DeploymentUnitOutlined,
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { PageLayout } from '@/components/ui';
import { colors, spacing } from '@/design-system';
import useHeaderActions from '@/hooks/useHeaderActions';
import { useProductCatalog } from './useProductCatalog';
import {
  PRODUCT_TYPE_OPTIONS, PRODUCT_GROUP_OPTIONS, SUBJECT_TYPE_OPTIONS,
  LANGUAGE_OPTIONS, INQUIRY_CHANNEL_OPTIONS, INQUIRY_MODE_OPTIONS,
  INPUT_FORMAT_OPTIONS, FULFILLMENT_MODE_OPTIONS, DATA_MODE_OPTIONS,
  PENDING_REASON_OPTIONS, MANUAL_REVIEW_OPTIONS, OUTPUT_TYPE_OPTIONS,
  OUTPUT_FORMAT_OPTIONS, SIGNATURE_OPTIONS, ENCRYPTION_OPTIONS,
  DELIVERY_CHANNEL_OPTIONS, CONSENT_OPTIONS,
} from './productTypes';
import type { IProduct } from './productTypes';

// ─── Helpers ─────────────────────────────────────────────────

const toOptions = (opts: readonly { value: string; label: string }[]) =>
  opts.map((o) => ({ value: o.value, label: o.label }));

const SwitchField: React.FC<{ name: string; label: string }> = ({ name, label }) => (
  <Form.Item name={name} label={label} valuePropName="checked">
    <Switch />
  </Form.Item>
);

const SectionDivider: React.FC<{ title: string }> = ({ title }) => (
  <Divider
    orientation="left"
    orientationMargin={0}
    style={{
      marginTop: spacing[5],
      marginBottom: spacing[3],
      color: colors.subsystem.product,
      borderColor: `${colors.subsystem.product}40`,
      fontWeight: 600,
      fontSize: 13,
    }}
  >
    {title}
  </Divider>
);

// ─── Tab 1: Thông tin & Cấu hình I/O ─────────────────────────

const TabInfoAndIO: React.FC = () => (
  <>
    {/* Thông tin cơ bản */}
    <SectionDivider title="Thông tin cơ bản" />

    <Row gutter={[16, 0]}>
      <Col xs={24} sm={8} md={6}>
        <Form.Item name="code" label="Mã sản phẩm" rules={[{ required: true, message: 'Nhập mã' }]}>
          <Input placeholder="K11" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={16} md={18}>
        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Nhập tên' }]}>
          <Input placeholder="Báo cáo tín dụng cá nhân cơ bản" />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12}>
        <Form.Item name="productType" label="Loại sản phẩm" rules={[{ required: true, message: 'Chọn loại' }]}>
          <Select placeholder="Chọn loại sản phẩm" options={toOptions(PRODUCT_TYPE_OPTIONS)} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item name="productGroup" label="Nhóm sản phẩm" rules={[{ required: true, message: 'Chọn nhóm' }]}>
          <Select placeholder="Chọn nhóm sản phẩm" options={toOptions(PRODUCT_GROUP_OPTIONS)} />
        </Form.Item>
      </Col>
    </Row>

    {/* 4 cột ngắn: đối tượng · ngôn ngữ · phiên bản · trạng thái */}
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12} md={6}>
        <Form.Item name="subjectType" label="Loại đối tượng" rules={[{ required: true, message: 'Chọn đối tượng' }]}>
          <Select placeholder="Chọn đối tượng" options={toOptions(SUBJECT_TYPE_OPTIONS)} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Form.Item name="language" label="Ngôn ngữ" rules={[{ required: true, message: 'Chọn ngôn ngữ' }]}>
          <Select mode="multiple" placeholder="Chọn ngôn ngữ" options={toOptions(LANGUAGE_OPTIONS)} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Form.Item name="version" label="Phiên bản" rules={[{ required: true, message: 'Nhập phiên bản' }]}>
          <Input placeholder="1.0" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
          <Select
            options={[
              { value: 'ACTIVE',   label: 'Hoạt động' },
              { value: 'INACTIVE', label: 'Vô hiệu hóa' },
            ]}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12}>
        <Form.Item name="effectiveDate" label="Ngày hiệu lực" rules={[{ required: true, message: 'Chọn ngày' }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item name="expiredDate" label="Ngày hết hạn" rules={[{ required: true, message: 'Chọn ngày' }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
      </Col>
    </Row>

    {/* Cấu hình đầu vào */}
    <SectionDivider title="Cấu hình đầu vào" />

    <Form.Item name="inquiryChannels" label="Kênh tra cứu" rules={[{ required: true, message: 'Chọn ít nhất một kênh' }]}>
      <Checkbox.Group options={toOptions(INQUIRY_CHANNEL_OPTIONS)} style={{ flexWrap: 'wrap' }} />
    </Form.Item>

    <Form.Item name="inquiryModes" label="Chế độ tra cứu" rules={[{ required: true, message: 'Chọn ít nhất một chế độ' }]}>
      <Checkbox.Group options={toOptions(INQUIRY_MODE_OPTIONS)} style={{ flexWrap: 'wrap' }} />
    </Form.Item>

    <Form.Item name="inputFormats" label="Định dạng đầu vào" rules={[{ required: true, message: 'Chọn định dạng' }]}>
      <Checkbox.Group options={toOptions(INPUT_FORMAT_OPTIONS)} style={{ flexWrap: 'wrap' }} />
    </Form.Item>

    {/* 3 cột giới hạn bản ghi */}
    <Divider dashed style={{ margin: `${spacing[1]} 0 ${spacing[3]}` }}>
      Giới hạn số bản ghi / yêu cầu
    </Divider>
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={8}>
        <Form.Item name="maxRecordsWebUi" label="Web UI">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
        <Form.Item name="maxRecordsFileUpload" label="File Upload">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
        <Form.Item name="maxRecordsApi" label="API">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Col>
    </Row>

    {/* Cấu hình đầu ra */}
    <SectionDivider title="Cấu hình đầu ra" />

    <Form.Item name="outputTypes" label="Loại đầu ra" rules={[{ required: true, message: 'Chọn loại đầu ra' }]}>
      <Checkbox.Group options={toOptions(OUTPUT_TYPE_OPTIONS)} style={{ flexWrap: 'wrap' }} />
    </Form.Item>

    <Form.Item name="outputFormats" label="Định dạng đầu ra" rules={[{ required: true, message: 'Chọn định dạng' }]}>
      <Checkbox.Group options={toOptions(OUTPUT_FORMAT_OPTIONS)} style={{ flexWrap: 'wrap' }} />
    </Form.Item>

    {/* 4 cột ngắn: chữ ký · mã hóa · cấu hình trường · alias */}
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12} md={6}>
        <Form.Item name="digitalSignatureRequired" label="Chữ ký số" rules={[{ required: true }]}>
          <Select options={toOptions(SIGNATURE_OPTIONS)} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Form.Item name="encryptionRequired" label="Mã hóa" rules={[{ required: true }]}>
          <Select options={toOptions(ENCRYPTION_OPTIONS)} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <SwitchField name="configurableFields" label="Trường cấu hình được" />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <SwitchField name="customAliasFields" label="Alias tùy chỉnh" />
      </Col>
    </Row>

    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12} md={6}>
        <SwitchField name="templateBased" label="Dựa trên mẫu" />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <SwitchField name="versionedTemplate" label="Mẫu có phiên bản" />
      </Col>
    </Row>
  </>
);

// ─── Tab 2: Xử lý, Phân phối & Quản trị ─────────────────────

const TabProcessAndGov: React.FC = () => (
  <>
    {/* Cấu hình xử lý */}
    <SectionDivider title="Cấu hình xử lý" />

    <Form.Item name="fulfillmentModes" label="Chế độ thực thi" rules={[{ required: true, message: 'Chọn chế độ' }]}>
      <Checkbox.Group options={toOptions(FULFILLMENT_MODE_OPTIONS)} style={{ flexWrap: 'wrap' }} />
    </Form.Item>

    {/* 4 cột ngắn: chế độ DL · kiểm duyệt · (space) · (space) */}
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12} md={6}>
        <Form.Item name="dataMode" label="Chế độ dữ liệu" rules={[{ required: true }]}>
          <Select options={toOptions(DATA_MODE_OPTIONS)} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Form.Item name="manualReviewRequired" label="Kiểm duyệt thủ công" rules={[{ required: true }]}>
          <Select options={toOptions(MANUAL_REVIEW_OPTIONS)} />
        </Form.Item>
      </Col>
    </Row>

    {/* 3 switch cùng hàng */}
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={8}>
        <SwitchField name="allowPartialResponse" label="Trả lời một phần" />
      </Col>
      <Col xs={24} sm={8}>
        <SwitchField name="allowRetry" label="Cho phép thử lại" />
      </Col>
      <Col xs={24} sm={8}>
        <SwitchField name="allowReprocess" label="Xử lý lại" />
      </Col>
    </Row>

    <Form.Item name="pendingReasons" label="Lý do chờ xử lý">
      <Checkbox.Group options={toOptions(PENDING_REASON_OPTIONS)} style={{ flexWrap: 'wrap' }} />
    </Form.Item>

    {/* Cấu hình phân phối */}
    <SectionDivider title="Cấu hình phân phối" />

    <Form.Item name="deliveryChannels" label="Kênh phân phối" rules={[{ required: true, message: 'Chọn kênh phân phối' }]}>
      <Checkbox.Group options={toOptions(DELIVERY_CHANNEL_OPTIONS)} style={{ flexWrap: 'wrap' }} />
    </Form.Item>

    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12}>
        <SwitchField name="partialDeliverySupported" label="Phân phối một phần" />
      </Col>
      <Col xs={24} sm={12}>
        <SwitchField name="deliveryAckRequired" label="Yêu cầu xác nhận nhận" />
      </Col>
    </Row>

    {/* Quản trị */}
    <SectionDivider title="Quản trị" />

    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12} md={6}>
        <Form.Item name="consentRequired" label="Yêu cầu đồng ý" rules={[{ required: true }]}>
          <Select options={toOptions(CONSENT_OPTIONS)} />
        </Form.Item>
      </Col>
    </Row>

    {/* 4 switch cùng hàng */}
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12} md={6}>
        <SwitchField name="permissionRequired" label="Phân quyền" />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <SwitchField name="auditRequired" label="Kiểm toán (Audit)" />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <SwitchField name="pricingRequired" label="Định giá" />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <SwitchField name="slaRequired" label="SLA" />
      </Col>
    </Row>
  </>
);

// ─── Tab items (2 tabs) ───────────────────────────────────────

const TAB_ITEMS = [
  {
    key: 'info_io',
    label: (
      <Space>
        <AppstoreOutlined />
        Thông tin &amp; Cấu hình I/O
      </Space>
    ),
    children: <TabInfoAndIO />,
  },
  {
    key: 'process_gov',
    label: (
      <Space>
        <DeploymentUnitOutlined />
        Xử lý, Phân phối &amp; Quản trị
      </Space>
    ),
    children: <TabProcessAndGov />,
  },
];

// ─── Page ────────────────────────────────────────────────────

interface ProductFormPageProps {
  mode: 'create' | 'edit';
}

const ProductFormPageInner: React.FC<ProductFormPageProps> = ({ mode }) => {
  const router = useRouter();
  const params = useParams();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { saveProduct, getById } = useProductCatalog();

  const isEdit = mode === 'edit';
  const productId = isEdit ? String(params?.id ?? '') : undefined;

  useEffect(() => {
    if (isEdit && productId) {
      const product = getById(productId);
      if (product) {
        form.setFieldsValue({
          ...product,
          // subjectType: string[] → single Select value
          subjectType: product.subjectType?.[0] ?? undefined,
          effectiveDate: product.effectiveDate ? dayjs(product.effectiveDate, 'DD/MM/YYYY') : null,
          expiredDate:   product.expiredDate   ? dayjs(product.expiredDate,   'DD/MM/YYYY') : null,
        });
      }
    } else {
      form.setFieldsValue({
        status: 'ACTIVE',
        version: '1.0',
        allowPartialResponse: true,
        allowRetry: true,
        allowReprocess: true,
        templateBased: true,
        versionedTemplate: true,
        permissionRequired: true,
        auditRequired: true,
        pricingRequired: true,
        slaRequired: true,
        maxRecordsWebUi: 1,
        maxRecordsFileUpload: 200,
        maxRecordsApi: 1000,
        manualReviewRequired: 'conditional',
        digitalSignatureRequired: 'optional',
        encryptionRequired: 'conditional',
        consentRequired: 'conditional',
        dataMode: 'ON_DEMAND',
      });
    }
  }, [isEdit, productId, form, getById]);

  const collectValues = (): Partial<IProduct> => {
    const raw = form.getFieldsValue(true);
    return {
      ...raw,
      // single Select → string[] for IProduct
      subjectType: raw.subjectType ? [raw.subjectType as string] : [],
      effectiveDate: raw.effectiveDate ? (raw.effectiveDate as dayjs.Dayjs).format('DD/MM/YYYY') : '',
      expiredDate:   raw.expiredDate   ? (raw.expiredDate   as dayjs.Dayjs).format('DD/MM/YYYY') : '',
      id: productId,
    };
  };

  const handleSaveDraft = async () => {
    try {
      const values = collectValues();
      saveProduct({ ...values, status: 'INACTIVE' });
      message.success('Đã lưu nháp');
      router.push('/product-mgmt/catalog/products');
    } catch {
      message.error('Lưu nháp thất bại');
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = collectValues();
      saveProduct(values);
      message.success(isEdit ? 'Cập nhật sản phẩm thành công' : 'Tạo sản phẩm thành công');
      router.push('/product-mgmt/catalog/products');
    } catch {
      message.error('Vui lòng kiểm tra lại các trường bắt buộc');
    }
  };

  useHeaderActions(
    {
      title: isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới',
      actions: [
        {
          key: 'back',
          label: 'Quay lại',
          icon: <ArrowLeftOutlined />,
          onClick: () => router.back(),
        },
        {
          key: 'draft',
          label: 'Lưu nháp',
          icon: <SaveOutlined />,
          onClick: handleSaveDraft,
        },
        {
          key: 'submit',
          label: isEdit ? 'Cập nhật' : 'Tạo sản phẩm',
          icon: <SendOutlined />,
          type: 'primary' as const,
          onClick: handleSubmit,
        },
      ],
    },
    [isEdit, productId],
  );

  return (
    <PageLayout>
      <Card
        variant="borderless"
        style={{ borderTop: `3px solid ${colors.subsystem.product}`, overflowX: 'hidden' }}
        styles={{ body: { padding: `${spacing[4]} ${spacing[6]} ${spacing[6]}` } }}
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Tabs
            defaultActiveKey="info_io"
            type="card"
            size="middle"
            items={TAB_ITEMS}
          />
        </Form>
      </Card>
    </PageLayout>
  );
};

const ProductFormPage: React.FC<ProductFormPageProps> = (props) => (
  <App style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
    <ProductFormPageInner {...props} />
  </App>
);

export default ProductFormPage;
