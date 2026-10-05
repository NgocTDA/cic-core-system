'use client';

import React from 'react';
import {
  Drawer,
  Typography,
  Space,
  Tag,
  Divider,
  Row,
  Col,
  Card,
  Progress,
  Table,
  Button,
  Badge,
} from 'antd';
import {
  CheckCircleOutlined,
  EyeOutlined,
  BgColorsOutlined,
  SafetyCertificateOutlined,
  LayoutOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  BranchesOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
}

const COMPARISON_COLUMNS = [
  {
    title: 'Tiêu chí / Yếu tố',
    dataIndex: 'criterion',
    key: 'criterion',
    width: 180,
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: 'CIC Mặc định (Hiện tại)',
    dataIndex: 'cic',
    key: 'cic',
    width: 260,
  },
  {
    title: 'NTDA Forest Design System',
    dataIndex: 'forest',
    key: 'forest',
    width: 280,
  },
  {
    title: 'Đánh giá mức độ phù hợp',
    dataIndex: 'verdict',
    key: 'verdict',
    width: 200,
    render: (verdict: { text: string; color: string; score: string }) => (
      <Space direction="vertical" size={2}>
        <Tag color={verdict.color} style={{ fontWeight: 600 }}>{verdict.text}</Tag>
        <Text type="secondary" style={{ fontSize: 12 }}>Điểm: {verdict.score}</Text>
      </Space>
    ),
  },
];

const COMPARISON_DATA = [
  {
    key: '1',
    criterion: 'Màu nhận diện Brand Primary',
    cic: (
      <div>
        <Space>
          <span style={{ width: 14, height: 14, background: '#1677ff', borderRadius: 3, display: 'inline-block' }} />
          <code>#1677ff</code> (Ant Design Blue chuẩn)
        </Space>
        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
          Màu xanh dương phổ thông, dễ trùng lặp với các phần mềm generic.
        </div>
      </div>
    ),
    forest: (
      <div>
        <Space>
          <span style={{ width: 14, height: 14, background: '#2c795b', borderRadius: 3, display: 'inline-block' }} />
          <code>#2c795b</code> (Pine / Forest Green)
        </Space>
        <div style={{ fontSize: 12, color: '#2c795b', marginTop: 4, fontWeight: 500 }}>
          Sang trọng, cảm giác tài chính/tín dụng chuẩn mực, đạt chữ trắng 5.26:1.
        </div>
      </div>
    ),
    verdict: { text: 'Tối ưu vượt trội', color: 'success', score: '9.8 / 10' },
  },
  {
    key: '2',
    criterion: 'Sự đồng nhất với Sidebar & Khung viền',
    cic: (
      <div>
        <Text type="danger">Có sự lệch tone:</Text> Sidebar là Deep Forest Noir (<code>#132620</code>) nhưng nút bấm và tiêu điểm lại là xanh dương (<code>#1677ff</code>).
      </div>
    ),
    forest: (
      <div>
        <Text style={{ color: '#2c795b', fontWeight: 600 }}>Hài hòa 100%:</Text> Cùng cấu trúc màu Forest & Ink (<code>#18312a</code>, <code>#2c795b</code>). Tạo thể thống nhất từ menu đến bảng dữ liệu.
      </div>
    ),
    verdict: { text: 'Rất cần thiết', color: 'green', score: '9.6 / 10' },
  },
  {
    key: '3',
    criterion: 'Trạng thái Thành công (Success)',
    cic: (
      <div>
        <code>#52c41a</code> / <code>#21603c</code>
        <div style={{ fontSize: 12, color: '#8c8c8c' }}>Xanh lá cây chuẩn, nguy cơ trùng lặp nếu dùng với brand xanh lá.</div>
      </div>
    ),
    forest: (
      <div>
        <code>#4b8b18</code> / <code>#3a7401</code> (Leaf Green)
        <div style={{ fontSize: 12, color: '#3a7401', fontWeight: 500 }}>
          Đã được cân chỉnh lệch vàng (yellow-shift) có chủ đích để không bao giờ bị nhầm lẫn với Brand Primary.
        </div>
      </div>
    ),
    verdict: { text: 'Chặt chẽ khoa học', color: 'blue', score: '9.5 / 10' },
  },
  {
    key: '4',
    criterion: 'Mật độ hiển thị bảng (Table Density)',
    cic: (
      <div>
        Hàng tiêu chuẩn AntD (~48px - 54px). Tốt nhưng chiếm nhiều diện tích cuộn trên màn hình nhiều cột.
      </div>
    ),
    forest: (
      <div>
        Compact 40px mặc định, comfortable 52px. Tối ưu cho hệ thống quản trị chuyên sâu (nhiều tham số, cron, trạng thái).
      </div>
    ),
    verdict: { text: 'Phù hợp cao', color: 'green', score: '9.2 / 10' },
  },
  {
    key: '5',
    criterion: 'Hệ thống Bo góc (Border Radius)',
    cic: (
      <div>
        Radius md: <code>6px</code>, card: <code>8px</code>. Hơi sắc, mang phong cách AntD 4.x/5.x đời đầu.
      </div>
    ),
    forest: (
      <div>
        Radius md: <code>8px</code> (nút/input), lg: <code>12px</code> (card/modal). Mềm mại, hiện đại, thẩm mỹ doanh nghiệp cao cấp.
      </div>
    ),
    verdict: { text: 'Nâng cấp thẩm mỹ', color: 'purple', score: '9.0 / 10' },
  },
  {
    key: '6',
    criterion: 'Khả năng hỗ trợ Dark Mode',
    cic: (
      <div>
        Chưa có cấu hình Dark mode bài bản cho từng token.
      </div>
    ),
    forest: (
      <div>
        Đầy đủ 226 biến Light/Dark riêng biệt. Nền Ink ánh rừng <code>#18312a</code> / <code>#081a15</code>, điểm nhấn Lime <code>#d8e485</code>.
      </div>
    ),
    verdict: { text: 'Sẵn sàng tương lai', color: 'cyan', score: '9.0 / 10' },
  },
];

export const ForestEvaluationDrawer: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Drawer
      title={
        <Space>
          <span style={{ fontSize: 20 }}>🌲</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#18312a' }}>
              Báo cáo Đánh giá Sự phù hợp: NTDA Forest Design System
            </div>
            <div style={{ fontSize: 12, fontWeight: 400, color: '#6d7672' }}>
              Áp dụng thực nghiệm vào Chức năng Quản lý Job (/ops-support/job-management)
            </div>
          </div>
        </Space>
      }
      placement="right"
      width={860}
      open={open}
      onClose={onClose}
      styles={{
        header: { borderBottom: '1px solid #e0eae5', padding: '16px 24px' },
        body: { padding: '24px 28px', background: '#f7fbf9' },
      }}
      extra={
        <Space>
          <Tag color="green" style={{ fontSize: 13, padding: '2px 8px' }}>
            Version 1.2.1
          </Tag>
          <Tag color="geekblue" style={{ fontSize: 13, padding: '2px 8px' }}>
            WCAG 2.2 AA
          </Tag>
        </Space>
      }
    >
      {/* ─── TỔNG KẾT ĐIỂM SỐ ────────────────────────────────────────── */}
      <Card
        style={{
          borderRadius: 12,
          border: '1px solid #e0eae5',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(24, 49, 42, 0.04)',
          marginBottom: 24,
        }}
      >
        <Row gutter={24} align="middle">
          <Col xs={24} sm={8} style={{ textAlign: 'center', borderRight: '1px solid #edf7f2' }}>
            <div style={{ fontSize: 12, textTransform: 'uppercase', color: '#6d7672', fontWeight: 600, letterSpacing: '0.5px' }}>
              Điểm Đánh Giá Tổng Hợp
            </div>
            <div style={{ fontSize: 44, fontWeight: 800, color: '#2c795b', lineHeight: 1.2, marginTop: 4 }}>
              9.2 <span style={{ fontSize: 20, fontWeight: 500, color: '#9aa39f' }}>/ 10</span>
            </div>
            <Tag color="#2c795b" style={{ marginTop: 6, fontWeight: 600, fontSize: 12, borderRadius: 12, padding: '2px 12px' }}>
              RẤT PHÙ HỢP ĐỂ TRIỂN KHAI
            </Tag>
          </Col>
          <Col xs={24} sm={16}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#18312a', marginBottom: 8 }}>
              Tóm lược đánh giá chuyên môn:
            </div>
            <Paragraph style={{ fontSize: 13, color: '#4c5551', marginBottom: 12, lineHeight: 1.6 }}>
              <strong>NTDA Forest Design System</strong> là mảnh ghép tự nhiên và lý tưởng nhất cho CIC Core System. Hệ thống khắc phục dứt điểm sự xung đột màu giữa <em>Sidebar màu xanh rừng (Deep Forest Noir)</em> và <em>Nút bấm màu xanh dương generic Ant Design</em>, đồng thời cung cấp các quy chuẩn WCAG 2.2 AA và độ mật độ thông tin cao cấp dành riêng cho ứng dụng Back-office ngân hàng/tín dụng.
            </Paragraph>
            <Space wrap size={[8, 8]}>
              <Tag icon={<CheckCircleOutlined />} color="success">WCAG Chữ trắng 5.26:1</Tag>
              <Tag icon={<CheckCircleOutlined />} color="success">Đồng bộ Dark Pine Sidebar</Tag>
              <Tag icon={<CheckCircleOutlined />} color="success">Yellow-shifted Leaf Success</Tag>
              <Tag icon={<CheckCircleOutlined />} color="success">DTCG Tokens 3 lớp</Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* ─── TRẠNG THÁI TRIỂN KHAI HỆ THỐNG ──────────────────────────── */}
      <Card
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#2c795b' }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Trạng thái: Đã chính thức chuẩn hóa toàn bộ CIC Core System</span>
          </Space>
        }
        style={{ borderRadius: 12, border: '1px solid #e0eae5', marginBottom: 24 }}
      >
        <Paragraph style={{ fontSize: 13, color: '#4c5551', marginBottom: 0, lineHeight: 1.6 }}>
          Hệ thống Design Tokens tại <code>frontend/src/design-system/tokens.ts</code> và <code>theme.ts</code> đã được cập nhật chính thức với bộ 226 biến của <strong>NTDA Forest Design System (v1.2.1)</strong>. Mọi phân hệ trên toàn CIC Core System hiện sử dụng bảng màu Forest Green (#2c795b), chuẩn bo góc 8px/12px và màu trạng thái Leaf Green (#3a7401).
        </Paragraph>
      </Card>

      {/* ─── BẢNG SO SÁNH CHI TIẾT ──────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#18312a', marginBottom: 12 }}>
          So sánh chi tiết: Hiện tại vs. NTDA Forest
        </div>
        <Table
          columns={COMPARISON_COLUMNS}
          dataSource={COMPARISON_DATA}
          pagination={false}
          size="middle"
          bordered
          style={{ background: '#ffffff', borderRadius: 8, overflow: 'hidden' }}
        />
      </div>

      {/* ─── ĐÁNH GIÁ 5 TRỤ CỘT THIẾT KẾ ─────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#18312a', marginBottom: 16 }}>
          Đánh giá chuyên sâu theo 5 tiêu chí thiết kế
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card style={{ borderRadius: 10, border: '1px solid #e0eae5', height: '100%' }}>
              <Space align="center" style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 18, color: '#2c795b' }}>🎨</span>
                <Text strong style={{ fontSize: 14 }}>1. Tính tương thích thương hiệu & Thị giác</Text>
              </Space>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Điểm phù hợp</Text>
                <Text strong style={{ color: '#2c795b' }}>9.6 / 10</Text>
              </div>
              <Progress percent={96} strokeColor="#2c795b" size="small" showInfo={false} />
              <Paragraph style={{ fontSize: 12, color: '#6d7672', marginTop: 10, marginBottom: 0 }}>
                Sidebar của CIC Core System từ đầu đã mang DNA xanh thông (<code>#132620</code>) và các Context banner là Sage tint (<code>#edf3ed</code>). Việc đưa Forest Primary (<code>#2c795b</code>) vào nút hành động và tiêu điểm tạo nên tổng thể sang trọng, nhất quán và xóa bỏ hoàn toàn cảm giác chắp vá.
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card style={{ borderRadius: 10, border: '1px solid #e0eae5', height: '100%' }}>
              <Space align="center" style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 18, color: '#2c795b' }}>👁️</span>
                <Text strong style={{ fontSize: 14 }}>2. Tiêu chuẩn Tiếp cận WCAG 2.2 AA</Text>
              </Space>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Điểm phù hợp</Text>
                <Text strong style={{ color: '#2c795b' }}>9.5 / 10</Text>
              </div>
              <Progress percent={95} strokeColor="#2c795b" size="small" showInfo={false} />
              <Paragraph style={{ fontSize: 12, color: '#6d7672', marginTop: 10, marginBottom: 0 }}>
                Độ tương phản chữ trắng trên nút Primary <code>#2c795b</code> đạt <strong>5.26:1</strong> (vượt xa chuẩn tối thiểu 4.5:1). Các văn bản phụ <code>#4c5551</code> đạt 5.5:1. Đặc biệt, màu Success leaf <code>#3a7401</code> được chuyển pha sắc vàng, giúp người dùng phân biệt rạch ròi giữa &quot;nhận diện thương hiệu&quot; và &quot;báo hiệu trạng thái thành công&quot;.
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card style={{ borderRadius: 10, border: '1px solid #e0eae5', height: '100%' }}>
              <Space align="center" style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 18, color: '#2c795b' }}>📊</span>
                <Text strong style={{ fontSize: 14 }}>3. Mật độ thông tin & Công thái học Admin</Text>
              </Space>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Điểm phù hợp</Text>
                <Text strong style={{ color: '#2c795b' }}>9.2 / 10</Text>
              </div>
              <Progress percent={92} strokeColor="#2c795b" size="small" showInfo={false} />
              <Paragraph style={{ fontSize: 12, color: '#6d7672', marginTop: 10, marginBottom: 0 }}>
                Chức năng Quản lý Job chứa nhiều dữ liệu kỹ thuật: Biểu thức Cron, Mã dịch vụ, Loại trigger, Tham số JSON. Định dạng Compact 40px của Forest cùng font monospaced tối ưu trong khung badge xám nhạt (<code>#edf7f2</code>) giúp người vận hành theo dõi trực quan và đỡ mỏi mắt khi quan sát liên tục.
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card style={{ borderRadius: 10, border: '1px solid #e0eae5', height: '100%' }}>
              <Space align="center" style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 18, color: '#2c795b' }}>⚡</span>
                <Text strong style={{ fontSize: 14 }}>4. Tính khả thi kỹ thuật & Tích hợp</Text>
              </Space>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Điểm phù hợp</Text>
                <Text strong style={{ color: '#2c795b' }}>9.0 / 10</Text>
              </div>
              <Progress percent={90} strokeColor="#2c795b" size="small" showInfo={false} />
              <Paragraph style={{ fontSize: 12, color: '#6d7672', marginTop: 10, marginBottom: 0 }}>
                CIC Core System đã thiết kế kiến trúc Design Token tại <code>@/design-system</code> và sử dụng <code>ConfigProvider</code> của Ant Design 5.x. Do đó, việc ứng dụng Forest Design System chỉ cần map tokens và cập nhật theme config mà không cần đập đi viết lại bất kỳ component nghiệp vụ nào.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* ─── LỘ TRÌNH KHUYẾN NGHỊ (ROADMAP) ─────────────────────────── */}
      <Card
        title={
          <Space>
            <RocketOutlined style={{ color: '#2c795b' }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Lộ trình khuyến nghị áp dụng cho toàn hệ thống</span>
          </Space>
        }
        style={{ borderRadius: 12, border: '1px solid #e0eae5' }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Badge count={1} style={{ backgroundColor: '#2c795b' }} />
            <div>
              <Text strong style={{ fontSize: 13 }}>Bước 1: Chấp thuận áp dụng cho Quản lý Job (/ops-support/job-management)</Text>
              <div style={{ fontSize: 12, color: '#6d7672', marginTop: 2 }}>
                Lấy màn hình Quản lý Job làm màn hình mẫu (Golden Standard) của NTDA Forest trong CIC Core System.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Badge count={2} style={{ backgroundColor: '#2c795b' }} />
            <div>
              <Text strong style={{ fontSize: 13 }}>Bước 2: Mở rộng cho toàn Subsystem Hỗ trợ vận hành (Ops Support)</Text>
              <div style={{ fontSize: 12, color: '#6d7672', marginTop: 2 }}>
                Đồng bộ sang Quản lý Biến, Mẫu thông báo, Danh sách thông báo và Nhật ký hệ thống.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Badge count={3} style={{ backgroundColor: '#2c795b' }} />
            <div>
              <Text strong style={{ fontSize: 13 }}>Bước 3: Nâng cấp root Design System (@/design-system/tokens.ts)</Text>
              <div style={{ fontSize: 12, color: '#6d7672', marginTop: 2 }}>
                Đưa bộ 226 biến DTCG của Forest vào làm chuẩn core palette của toàn bộ 6 subsystem nội bộ và Web Portal.
              </div>
            </div>
          </div>
        </Space>
      </Card>
    </Drawer>
  );
};

export default ForestEvaluationDrawer;
