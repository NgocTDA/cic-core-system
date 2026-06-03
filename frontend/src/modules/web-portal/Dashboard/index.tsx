'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Typography, Button, Space, Table, message } from 'antd';
import {
  FileDoneOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
  CloudUploadOutlined,
  BookOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { colors, radius, shadows } from '@/design-system';
import PageLayout from '@/components/ui/PageLayout';

const { Text } = Typography;

const PortalDashboard: React.FC = () => {
  // Dữ liệu giả lập các tệp gửi gần nhất
  const recentFiles = [
    {
      key: '1',
      time: '02/06/2026 17:45:10',
      name: 'D401135800120260531.001.JSON',
      type: 'Báo cáo cân đối (D40)',
      status: 'CHỜ_TIẾP_NHẬN',
    },
    {
      key: '2',
      time: '28/05/2026 09:15:33',
      name: 'D401135800120260430.001.JSON',
      type: 'Báo cáo cân đối (D40)',
      status: 'ĐÃ_TIẾP_NHẬN_HỢP_LỆ',
    },
    {
      key: '3',
      time: '15/05/2026 14:20:00',
      name: 'D021135800120260515.003.JSON',
      type: 'Báo cáo doanh nghiệp (D02)',
      status: 'CIC_TỪ_CHỐI',
    }
  ];

  const columns = [
    {
      title: 'Thời gian gửi',
      dataIndex: 'time',
      key: 'time',
      width: 160,
    },
    {
      title: 'Tên tệp báo cáo',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{text}</span>
    },
    {
      title: 'Loại báo cáo',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: string) => {
        if (status === 'CHỜ_TIẾP_NHẬN') {
          return (
            <span style={{
              color: colors.warning.base,
              border: `1px solid ${colors.warning.base}`,
              background: '#fffbe6',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600
            }}>
              Chờ tiếp nhận
            </span>
          );
        }
        if (status === 'CIC_TỪ_CHỐI') {
          return (
            <span style={{
              color: '#ffffff',
              background: colors.error.base,
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600
            }}>
              CIC từ chối
            </span>
          );
        }
        return (
          <span style={{
            color: colors.success.base,
            border: `1px solid ${colors.success.base}`,
            background: '#f6ffed',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600
          }}>
            Tiếp nhận hợp lệ
          </span>
        );
      }
    }
  ];

  return (
    <PageLayout>
      {/* Khối thống kê nhanh */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: radius.lg, boxShadow: shadows.xs }} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<span style={{ color: colors.text.secondary, fontWeight: 600 }}>Tệp đã nộp trong tháng</span>}
              value={42}
              prefix={<FileDoneOutlined style={{ color: colors.subsystem.portal, marginRight: 8 }} />}
              valueStyle={{ fontWeight: 800 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: radius.lg, boxShadow: shadows.xs }} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<span style={{ color: colors.text.secondary, fontWeight: 600 }}>Đối soát hợp lệ</span>}
              value={38}
              prefix={<CheckCircleOutlined style={{ color: colors.success.base, marginRight: 8 }} />}
              valueStyle={{ fontWeight: 800, color: colors.success.base }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: radius.lg, boxShadow: shadows.xs }} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<span style={{ color: colors.text.secondary, fontWeight: 600 }}>Đang chờ tiếp nhận</span>}
              value={3}
              prefix={<ExclamationCircleOutlined style={{ color: colors.warning.base, marginRight: 8 }} />}
              valueStyle={{ fontWeight: 800, color: colors.warning.base }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: radius.lg, boxShadow: shadows.xs }} styles={{ body: { padding: 20 } }}>
            <Statistic
              title={<span style={{ color: colors.text.secondary, fontWeight: 600 }}>Tệp bị từ chối/Lỗi</span>}
              value={1}
              prefix={<CloseCircleOutlined style={{ color: colors.error.base, marginRight: 8 }} />}
              valueStyle={{ fontWeight: 800, color: colors.error.base }}
            />
          </Card>
        </Col>
      </Row>

      {/* Khối chia cột Nội dung */}
      <Row gutter={[24, 24]}>
        
        {/* Bảng hoạt động nộp tệp gần nhất */}
        <Col xs={24} lg={16}>
          <Card 
            title={<span style={{ fontWeight: 700, fontSize: 14, color: colors.text.secondary, textTransform: 'uppercase' }}>Hoạt động nộp báo cáo gần đây</span>}
            bordered={false}
            style={{ borderRadius: radius.lg, boxShadow: shadows.xs, height: '100%' }}
            extra={<Link href="/web-portal/send-balance"><Button type="link">Xem tất cả <ArrowRightOutlined /></Button></Link>}
          >
            <Table
              dataSource={recentFiles}
              columns={columns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Lối tắt tác vụ nhanh */}
        <Col xs={24} lg={8}>
          <Card 
            title={<span style={{ fontWeight: 700, fontSize: 14, color: colors.text.secondary, textTransform: 'uppercase' }}>Liên kết tác vụ nhanh</span>}
            bordered={false}
            style={{ borderRadius: radius.lg, boxShadow: shadows.xs, height: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              
              <Link href="/web-portal/send-balance" style={{ width: '100%' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  borderRadius: radius.md,
                  border: `1px solid ${colors.border.split}`,
                  cursor: 'pointer',
                  background: '#f8fafc',
                  transition: 'all 0.2s'
                }}
                className="task-card"
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `${colors.subsystem.portal}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.subsystem.portal,
                    fontSize: 20
                  }}>
                    <CloudUploadOutlined />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Text strong style={{ fontSize: 13, color: colors.text.primary }}>Gửi thông tin cân đối</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>Nộp và đối soát tệp dữ liệu cân đối báo cáo tài chính</Text>
                  </div>
                  <ArrowRightOutlined style={{ color: colors.text.tertiary }} className="task-arrow" />
                </div>
              </Link>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 16,
                borderRadius: radius.md,
                border: `1px solid ${colors.border.split}`,
                cursor: 'pointer',
                background: '#f8fafc',
                transition: 'all 0.2s'
              }}
              className="task-card"
              onClick={() => message.success('Bắt đầu tải tài liệu mẫu biểu D40, D02...')}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `${colors.success.base}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.success.base,
                  fontSize: 20
                }}>
                  <BookOutlined />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Text strong style={{ fontSize: 13, color: colors.text.primary }}>Tải mẫu biểu báo cáo</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>Tải tệp mẫu Excel, JSON và hướng dẫn chi tiết của CIC</Text>
                </div>
                <ArrowRightOutlined style={{ color: colors.text.tertiary }} className="task-arrow" />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 16,
                borderRadius: radius.md,
                border: `1px solid ${colors.border.split}`,
                cursor: 'pointer',
                background: '#f8fafc',
                transition: 'all 0.2s'
              }}
              className="task-card"
              onClick={() => message.info('Đang kết nối tới tổng đài hỗ trợ kỹ thuật Portal...')}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `${colors.warning.base}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.warning.base,
                  fontSize: 20
                }}>
                  <QuestionCircleOutlined />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Text strong style={{ fontSize: 13, color: colors.text.primary }}>Gửi yêu cầu hỗ trợ (Ticket)</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>Gửi câu hỏi nghiệp vụ và phản hồi trực tuyến với CIC</Text>
                </div>
                <ArrowRightOutlined style={{ color: colors.text.tertiary }} className="task-arrow" />
              </div>

            </Space>
          </Card>
        </Col>
      </Row>

      <style jsx global>{`
        .task-card:hover {
          background-color: #ffffff !important;
          border-color: ${colors.subsystem.portal}50 !important;
          box-shadow: ${shadows.sm};
        }
        .task-card:hover .task-arrow {
          transform: translateX(4px);
          color: ${colors.subsystem.portal} !important;
        }
      `}</style>
    </PageLayout>
  );
};

export default PortalDashboard;
