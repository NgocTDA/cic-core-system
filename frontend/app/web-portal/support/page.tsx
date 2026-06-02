'use client';

import React from 'react';
import { Typography, Row, Col, Card, Collapse, Button, Space, message, Badge, Divider } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  DownloadOutlined,
  MessageOutlined,
  GlobalOutlined,
  CompassOutlined
} from '@ant-design/icons';
import { colors, radius, shadows } from '@/design-system';
import PageLayout from '@/components/ui/PageLayout';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export default function SupportPage() {
  const faqData = [
    {
      key: '1',
      question: 'Quy trình đối chiếu số liệu cân đối D40 được thực hiện như thế nào?',
      answer: 'Hệ thống Web Portal của CIC sẽ tự động đọc cấu trúc tệp JSON báo cáo cân đối ngay khi Tổ chức tín dụng (TCTD) gửi thành công. Số liệu sẽ được kiểm soát chéo qua 15 cột nghiệp vụ từ dự phòng đến dư nợ để đối soát tính cân bằng trước khi chuyển sang trạng thái Đã tiếp nhận.'
    },
    {
      key: '2',
      question: 'Tôi phải xử lý như thế nào khi tệp báo cáo bị cảnh báo "Tệp lỗi / Vượt ngưỡng"?',
      answer: 'Cảnh báo "Vượt ngưỡng" xuất hiện khi chênh lệch số dư nợ hoặc chỉ tiêu đối chiếu vượt quá ngưỡng dung sai kiểm soát cho phép của CIC. Cán bộ TCTD vui lòng nhấp vào "Xem chi tiết" để xem ô báo lỗi (mã quy tắc được đánh dấu nổi bật bằng Tooltip), sau đó thực hiện chỉnh sửa dữ liệu tệp nguồn và tải lên tệp thay thế.'
    },
    {
      key: '3',
      question: 'Ý nghĩa của các mã quy tắc đối soát (LQ001, KU010, TS005...) là gì?',
      answer: 'Đây là các mã định danh cho các quy tắc kiểm tra chỉ tiêu cân đối số liệu giữa các tệp báo cáo tín dụng và báo cáo tài chính của CIC. Ví dụ: LQ001 kiểm soát Tổng dư nợ cấp tín dụng đối với khách hàng; KU010 đối soát dư nợ của các hợp đồng vay; TS005 kiểm soát tổng giá trị tài sản bảo đảm.'
    },
    {
      key: '4',
      question: 'Tôi có thể thu hồi tệp báo cáo đã gửi lên CIC không?',
      answer: 'Có. Với các tệp báo cáo ở trạng thái "Đã gửi CIC" (đang chờ tiếp nhận), bạn có thể click vào nút thao tác ba chấm (...) ở cuối dòng và chọn "Thu hồi". Trạng thái tệp sẽ chuyển về dạng nháp "Tạo mới" để bạn chỉnh sửa hoặc xóa.'
    }
  ];

  return (
    <PageLayout>
      {/* Banner Tiêu đề hỗ trợ */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.subsystem.portal} 0%, ${colors.primary[800]} 100%)`,
        borderRadius: radius.xl,
        padding: '32px 40px',
        color: '#ffffff',
        marginBottom: 24,
        boxShadow: shadows.md,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 800 }}>
          <Space size="middle" align="center" style={{ marginBottom: 12 }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Cổng hỗ trợ trực tuyến
            </span>
            <Badge status="processing" text={<span style={{ color: '#ffffff', fontSize: 12 }}>Hỗ trợ 24/7</span>} />
          </Space>
          <Title level={2} style={{ color: '#ffffff', margin: '0 0 8px', fontWeight: 800 }}>
            HỖ TRỢ KỸ THUẬT & KHAI THÁC THÔNG TIN
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Chào mừng bạn đến với Cổng giải đáp nghiệp vụ và hỗ trợ vận hành hệ thống Web Portal. Mọi vướng mắc về cấu trúc tệp dữ liệu báo cáo cân đối, quy chuẩn truyền nhận tệp hoặc yêu cầu cấp mới tài khoản vui lòng liên hệ với CIC theo thông tin bên dưới hoặc tra cứu danh mục FAQ nhanh.
          </Paragraph>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cột trái: Liên hệ & Tải mẫu */}
        <Col xs={24} lg={9}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            
            {/* Thẻ Liên hệ trực tiếp */}
            <Card 
              title={<span style={{ fontWeight: 700, fontSize: 13, color: colors.text.secondary, textTransform: 'uppercase' }}>Thông tin liên hệ trực tiếp</span>}
              bordered={false}
              style={{ borderRadius: radius.lg, boxShadow: shadows.xs }}
            >
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <PhoneOutlined style={{ color: colors.subsystem.portal, fontSize: 18, marginTop: 2 }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Tổng đài hỗ trợ kỹ thuật</Text>
                    <Text strong style={{ fontSize: 16, color: '#e53e3e' }}>1800 585891</Text>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <MailOutlined style={{ color: colors.subsystem.portal, fontSize: 18, marginTop: 2 }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Hộp thư điện tử hỗ trợ</Text>
                    <Text strong style={{ color: colors.text.primary }}>support@cic.org.vn</Text>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <CompassOutlined style={{ color: colors.subsystem.portal, fontSize: 18, marginTop: 2 }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Địa chỉ trụ sở chính</Text>
                    <Text strong style={{ color: colors.text.primary, fontSize: 12 }}>
                      Tầng 5, Tòa nhà Ngân hàng Nhà nước, 25 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội
                    </Text>
                  </div>
                </div>
              </Space>

              <Divider style={{ margin: '16px 0' }} />

              <Button 
                type="primary" 
                icon={<MessageOutlined />} 
                style={{ width: '100%', background: colors.subsystem.portal, borderColor: colors.subsystem.portal, height: 38 }}
                onClick={() => message.success('Đang kết nối hệ thống LiveChat hỗ trợ...')}
              >
                Trò chuyện trực tuyến (LiveChat)
              </Button>
            </Card>

            {/* Thẻ tải biểu mẫu chuẩn */}
            <Card 
              title={<span style={{ fontWeight: 700, fontSize: 13, color: colors.text.secondary, textTransform: 'uppercase' }}>Tải biểu mẫu và quy định chuẩn</span>}
              bordered={false}
              style={{ borderRadius: radius.lg, boxShadow: shadows.xs }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  borderRadius: radius.md,
                  border: `1px solid ${colors.border.split}`
                }}>
                  <Space>
                    <BookOutlined style={{ color: colors.subsystem.portal }} />
                    <Text strong style={{ fontSize: 12 }}>Mẫu tệp JSON đối chiếu D40</Text>
                  </Space>
                  <Button type="text" shape="circle" icon={<DownloadOutlined />} onClick={() => message.success('Bắt đầu tải xuống tệp tin mẫu JSON D40')} />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  borderRadius: radius.md,
                  border: `1px solid ${colors.border.split}`
                }}>
                  <Space>
                    <BookOutlined style={{ color: colors.subsystem.portal }} />
                    <Text strong style={{ fontSize: 12 }}>Quy chuẩn chỉ tiêu đối soát CIC</Text>
                  </Space>
                  <Button type="text" shape="circle" icon={<DownloadOutlined />} onClick={() => message.success('Bắt đầu tải xuống tài liệu Hướng dẫn Quy tắc đối soát')} />
                </div>
              </Space>
            </Card>

          </Space>
        </Col>

        {/* Cột phải: Accordion FAQs */}
        <Col xs={24} lg={15}>
          <Card 
            title={<span style={{ fontWeight: 700, fontSize: 13, color: colors.text.secondary, textTransform: 'uppercase' }}>Câu hỏi nghiệp vụ thường gặp (FAQs)</span>}
            bordered={false}
            style={{ borderRadius: radius.lg, boxShadow: shadows.xs, height: '100%' }}
          >
            <Collapse 
              accordion 
              bordered={false} 
              expandIconPosition="right"
              style={{ background: 'transparent' }}
            >
              {faqData.map(faq => (
                <Panel 
                  header={<Text strong style={{ fontSize: 13, color: colors.text.primary }}>{faq.question}</Text>} 
                  key={faq.key}
                  style={{
                    background: '#f8fafc',
                    borderRadius: radius.md,
                    marginBottom: 12,
                    border: `1px solid ${colors.border.split}`,
                    overflow: 'hidden'
                  }}
                >
                  <Paragraph style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                    {faq.answer}
                  </Paragraph>
                </Panel>
              ))}
            </Collapse>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  );
}
