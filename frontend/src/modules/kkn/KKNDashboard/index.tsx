'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tag, Badge, Space, List, Avatar } from 'antd';
import {
  ApiOutlined,
  GlobalOutlined,
  CloudServerOutlined,
  SyncOutlined,
  AlertOutlined,
  DatabaseOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useIsMobile } from './../../../hooks/useIsMobile';

const { Title, Text } = Typography;

// Mock Data for Traffic Monitor
const trafficData = [
  { time: '08:00', api: 1200, web: 800, mq: 400 },
  { time: '09:00', api: 2100, web: 1100, mq: 600 },
  { time: '10:00', api: 1800, web: 1300, mq: 450 },
  { time: '11:00', api: 2400, web: 1500, mq: 700 },
  { time: '12:00', api: 1900, web: 1200, mq: 500 },
  { time: '13:00', api: 2800, web: 1600, mq: 800 },
  { time: '14:00', api: 3100, web: 1900, mq: 900 },
];

const topTCTDData = [
  { name: 'TPBANK', requests: 45000 },
  { name: 'VPBANK', requests: 42000 },
  { name: 'MB', requests: 38000 },
  { name: 'TCB', requests: 35000 },
  { name: 'VCB', requests: 31000 },
  { name: 'ACB', requests: 29000 },
  { name: 'VIB', requests: 25000 },
  { name: 'HDBANK', requests: 22000 },
  { name: 'FE CREDIT', requests: 18000 },
  { name: 'LOTTE', requests: 15000 },
];

const channelRatioData = [
  { name: 'API (H2H)', value: 45 },
  { name: 'Website', value: 2 },
  { name: 'Message Queue', value: 12 },
  { name: 'SFTP', value: 8 },
];

const statusRatioData = [
  { name: 'Thành công', value: 95 },
  { name: 'Lỗi', value: 5 },
];
const COLORS = ['#1677ff', '#722ed1', '#13c2c2', '#fa8c16', '#eb2f96', '#52c41a', '#f5222d', '#faad14'];

// Mock Data for Connection States/Alerts
const connectionAlerts = [
  { id: 1, type: 'API', partner: 'TPBANK', status: 'error', message: 'API Timeout (10s) - H2H Endpoint', time: '14:24' },
  { id: 2, type: 'Web', partner: 'MSB', status: 'warning', message: 'Chứng chỉ SSL sắp hết hạn (15 ngày)', time: '12:10' },
  { id: 3, type: 'SFTP', partner: 'LOTTE', status: 'error', message: 'Kết nối SFTP từ chối (Authentication failed)', time: '09:45' },
  { id: 4, type: 'API', partner: 'VPBANK', status: 'success', message: 'Đã khôi phục kết nối', time: '08:15' },
  { id: 5, type: 'MQ', partner: 'BIDV', status: 'error', message: 'Queue size exceeded threshold (90%)', time: '07:30' },
  { id: 6, type: 'DB', partner: 'AGRIBANK', status: 'warning', message: 'DB Link latency high (> 2s)', time: '06:55' },
  { id: 7, type: 'API', partner: 'TCB', status: 'error', message: '503 Service Unavailable', time: '05:20' },
  { id: 8, type: 'Web', partner: 'VIB', status: 'success', message: 'Chứng chỉ SSL đã được gia hạn', time: '04:10' },
  { id: 9, type: 'SFTP', partner: 'HDBANK', status: 'warning', message: 'SFTP disk usage > 85%', time: '03:45' },
  { id: 10, type: 'API', partner: 'MB', status: 'error', message: 'Invalid API Key', time: '02:15' },
  { id: 11, type: 'MQ', partner: 'ACB', status: 'success', message: 'Message processing resumed', time: '01:50' },
  { id: 12, type: 'DB', partner: 'SHB', status: 'error', message: 'ORA-12154: TNS:could not resolve service name', time: '01:10' },
  { id: 13, type: 'API', partner: 'PVCOMBANK', status: 'warning', message: 'Rate limit approaching (95%)', time: 'Yesterday' },
  { id: 14, type: 'Web', partner: 'ABBANK', status: 'error', message: 'Custom Domain DNS resolution failed', time: 'Yesterday' },
  { id: 15, type: 'SFTP', partner: 'SCB', status: 'success', message: 'File transfer completed (1.2GB)', time: 'Yesterday' },
  { id: 16, type: 'API', partner: 'SACOMBANK', status: 'error', message: 'Handshake failure (TLS 1.1 rejected)', time: 'Yesterday' },
  { id: 17, type: 'MQ', partner: 'LIENVIET', status: 'warning', message: 'Consumer lag increasing', time: 'Yesterday' },
  { id: 18, type: 'DB', partner: 'OCB', status: 'success', message: 'Connection pool optimized', time: 'Yesterday' },
  { id: 19, type: 'API', partner: 'VIETINBANK', status: 'error', message: 'IP not in whitelist', time: 'Yesterday' },
  { id: 20, type: 'Web', partner: 'BAOVIET', status: 'warning', message: 'Slow response times on static assets', time: 'Yesterday' },
];



const connectionTypes = [
  { title: 'API Host-to-Host', active: 40, inactive: 2, pending: 3, icon: <ApiOutlined style={{ color: '#fa8c16' }} /> },
  { title: 'Website Gateway', active: 25, inactive: 1, pending: 2, icon: <GlobalOutlined style={{ color: '#1677ff' }} /> },
  { title: 'Message Queue', active: 10, inactive: 2, pending: 0, icon: <CloudServerOutlined style={{ color: '#13c2c2' }} /> },
  { title: 'Kênh SFTP', active: 7, inactive: 0, pending: 1, icon: <CloudUploadOutlined style={{ color: '#eb2f96' }} /> },
  { title: 'Kênh DB Link', active: 5, inactive: 0, pending: 0, icon: <DatabaseOutlined style={{ color: '#52c41a' }} /> },
];

const KKNDashboard: React.FC = () => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ padding: isMobile ? 12 : 24, background: '#f5f7fa', minHeight: '100vh' }} />;
  }

  const MetricCard = ({ title, value, icon, gradient, trend }: any) => (
    <Card
      bordered={false}
      style={{
        background: gradient,
        color: '#fff',
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        height: '100%'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500 }}>{title}</Text>
          <Title level={isMobile ? 3 : 2} style={{ color: '#fff', margin: '4px 0 0 0' }}>{value}</Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{trend}</Text>
        </div>
        <div style={{ padding: 12, background: 'rgba(255,255,255,0.15)', borderRadius: 6 }}>
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: isMobile ? 12 : 24, background: '#f5f7fa', flex: 1, overflow: 'auto', minHeight: 0 }}>
      {/* 1. ROW: METRICS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={4}>
          <MetricCard
            title="Tất cả kênh"
            value="102"
            trend="+3 trong tháng"
            icon={<SyncOutlined style={{ fontSize: 24 }} />}
            gradient="linear-gradient(135deg, #1677ff 0%, #4096ff 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <MetricCard
            title="Kênh API (H2H)"
            value="45"
            trend="2 đang trễ (latency > 5s)"
            icon={<ApiOutlined style={{ fontSize: 24 }} />}
            gradient="linear-gradient(135deg, #722ed1 0%, #9254de 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <MetricCard
            title="Kênh Website"
            value="2"
            trend="100% Hoạt động"
            icon={<GlobalOutlined style={{ fontSize: 24 }} />}
            gradient="linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <MetricCard
            title="Message Queue"
            value="12"
            trend="2/12 Cảnh báo"
            icon={<SyncOutlined style={{ fontSize: 24 }} />}
            gradient="linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <MetricCard
            title="Kênh DB Link"
            value="5"
            trend="5/5 Ổn định"
            icon={<DatabaseOutlined style={{ fontSize: 24 }} />}
            gradient="linear-gradient(135deg, #52c41a 0%, #95de64 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <MetricCard
            title="Kênh SFTP"
            value="12"
            trend="12/12 Ổn định"
            icon={<CloudUploadOutlined style={{ fontSize: 24 }} />}
            gradient="linear-gradient(135deg, #eb2f96 0%, #ff85c0 100%)"
          />
        </Col>
      </Row>

      {/* 2. ROW: NEW CHARTS (Top 10, Portions) */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Top 10 TCTD */}
        <Col xs={24} xl={12}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Top 10 kết nối (09/3/2026 - 08/4/2026)</Title>}
            bordered={false}
            style={{ borderRadius: 6, height: '100%' }}
          >
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={topTCTDData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} style={{ fontSize: 12 }} />
                  <Tooltip wrapperStyle={{ borderRadius: '6px' }} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                  <Bar dataKey="requests" fill="#1677ff" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Channel Ratio */}
        <Col xs={24} sm={12} xl={6}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Tỷ lệ kết nối (09/3/2026 - 08/4/2026)</Title>}
            bordered={false}
            style={{ borderRadius: 6, height: '100%' }}
          >
            <div style={{ width: '100%', height: 250, display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={channelRatioData}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {channelRatioData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip wrapperStyle={{ borderRadius: '6px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Success/Error Ratio */}
        <Col xs={24} sm={12} xl={6}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Tỷ lệ thành công / lỗi (09/3/2026 - 08/4/2026)</Title>}
            bordered={false}
            style={{ borderRadius: 6, height: '100%' }}
          >
            <div style={{ width: '100%', height: 250, display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusRatioData}
                    innerRadius={0}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {statusRatioData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#52c41a' : '#f5222d'} />
                    ))}
                  </Pie>
                  <Tooltip wrapperStyle={{ borderRadius: '6px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 3. ROW: CHARTS AND ALERTS */}
      {/* 3. ROW: STATUS AND ALERTS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Left Col: Connection States Summary Grid */}
        <Col xs={24} xl={16}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Trạng thái Kênh kết nối</Title>}
            bordered={false}
            style={{ borderRadius: 6, height: '100%' }}
          >
            <Row gutter={[12, 12]}>
              {connectionTypes.map((type, idx) => (
                <Col span={8} key={idx}>
                  <div style={{ background: '#fafafa', padding: 12, borderRadius: 6, border: '1px solid #f0f0f0', height: '100%' }}>
                    <div style={{ marginBottom: 8 }}>{type.icon}</div>
                    <Text style={{ fontSize: 13, display: 'block', color: '#595959', fontWeight: 600 }}>{type.title}</Text>
                    <Space direction="vertical" style={{ width: '100%', marginTop: 8 }} size={0}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Đang hoạt động</Text>
                        <Tag color="success" bordered={false} style={{ margin: 0 }}>{type.active}</Tag>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Ngừng/Lỗi kết nối</Text>
                        <Tag color="error" bordered={false} style={{ margin: 0 }}>{type.inactive}</Tag>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Chờ phê duyệt</Text>
                        <Tag color="warning" bordered={false} style={{ margin: 0 }}>{type.pending}</Tag>
                      </div>
                    </Space>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Right Col: Connection Alerts */}
        <Col xs={24} xl={8}>
          <Card
            title={<Space><AlertOutlined style={{ color: '#f5222d' }} /><Title level={5} style={{ margin: 0 }}>Cảnh báo kết nối</Title></Space>}
            bordered={false}
            style={{ borderRadius: 6, height: '100%' }}
            bodyStyle={{ padding: '0 24px', height: 380, overflowY: 'auto' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={connectionAlerts}
              renderItem={(item) => (
                <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 0' }}>
                  <List.Item.Meta
                    avatar={
                      <Badge dot color={item.status === 'error' ? 'red' : item.status === 'warning' ? 'gold' : 'green'}>
                        <Avatar size="small" style={{ backgroundColor: '#f5f5f5' }}>{item.type.charAt(0)}</Avatar>
                      </Badge>
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>{item.partner}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                      </div>
                    }
                    description={<Text type="secondary" style={{ fontSize: 13, color: item.status === 'error' ? '#cf1322' : 'inherit' }}>{item.message}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 4. ROW: TRAFFIC CHART */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Giám sát lưu lượng (requests/h)</Title>}
            bordered={false}
            style={{ borderRadius: 6 }}
          >
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#722ed1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#722ed1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorWeb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fa8c16" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fa8c16" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip wrapperStyle={{ borderRadius: '6px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="api" name="API (H2H)" stroke="#722ed1" fillOpacity={1} fill="url(#colorApi)" />
                  <Area type="monotone" dataKey="web" name="Website Gateway" stroke="#fa8c16" fillOpacity={1} fill="url(#colorWeb)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default KKNDashboard;

