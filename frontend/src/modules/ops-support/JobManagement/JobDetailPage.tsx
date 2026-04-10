
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Typography, Row, Col, Card, Statistic, Progress, Tag, Space, 
  Button, List, Divider, Empty, message, Tooltip, Tabs
} from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  EditOutlined, 
  HistoryOutlined, 
  FieldTimeOutlined,
  DashboardOutlined,
  FileSearchOutlined as LogsOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { MOCK_JOBS, Job } from './mockData';
import useHeaderActions from './../../../hooks/useHeaderActions';
import styles from './JobManagement.module.scss';

const { Title, Text } = Typography;

const JobDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const found = MOCK_JOBS.find(j => j.id === id);
    if (found) {
      setJob(found);
      // Simulate existing logs
      setLogs([
        `[${new Date().toLocaleTimeString()}] Initializing job session...`,
        `[${new Date().toLocaleTimeString()}] Authenticating with subsystem ${found.system}...`,
        `[${new Date().toLocaleTimeString()}] Connection established.`,
        `[${new Date().toLocaleTimeString()}] Loading parameters for type ${found.type}...`,
        `[${new Date().toLocaleTimeString()}] Ready to process ${found.metrics.totalRecords} records.`,
      ]);
    }
  }, [id]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Simulate real-time logs if running
  useEffect(() => {
    if (job?.status === 'RUNNING') {
      const interval = setInterval(() => {
        setLogs(prev => [
          ...prev, 
          `[${new Date().toLocaleTimeString()}] Processing record batch ${Math.floor(Math.random() * 1000)} - OK`
        ]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [job?.status]);

  const handleRun = () => {
    if (job) {
      setJob({ ...job, status: 'RUNNING' });
      message.loading('Đang khởi chạy Job...');
      setTimeout(() => message.success('Job đã bắt đầu chạy'), 1000);
    }
  };

  const handleStop = () => {
    if (job) {
      setJob({ ...job, status: 'IDLE' });
      message.warning('Đã dừng Job');
    }
  };

  const handleEdit = () => {
    router.push(`/ops-support/job-management/${id}/edit`);
  };

  useHeaderActions({
    title: job ? `Giám sát Job: ${job.name}` : 'Chi tiết Job',
    actions: [
      {
        key: 'edit',
        label: 'Chỉnh sửa cấu hình',
        icon: <EditOutlined />,
        onClick: handleEdit
      },
      job?.status === 'RUNNING' ? {
        key: 'stop',
        label: 'Dừng chạy',
        danger: true,
        icon: <PauseCircleOutlined />,
        onClick: handleStop
      } : {
        key: 'run',
        label: 'Chạy ngay',
        type: 'primary',
        icon: <PlayCircleOutlined />,
        onClick: handleRun
      }
    ]
  }, [job, id]);

  if (!job) return <div style={{ padding: 40 }}><Empty description="Không tìm thấy thông tin Job" /></div>;

  return (
    <div style={{ padding: '0 24px 24px' }}>
      {/* Top Stats Row */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card bordered={false} bodyStyle={{ padding: '16px 20px' }} style={{ borderRadius: 8 }}>
            <Statistic 
              title="Trạng thái hiện tại" 
              value={job.status} 
              prefix={job.status === 'RUNNING' ? <SyncOutlined spin /> : <CheckCircleOutlined />}
              valueStyle={{ color: job.status === 'RUNNING' ? '#1677ff' : '#52c41a', fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} bodyStyle={{ padding: '16px 20px' }} style={{ borderRadius: 8 }}>
            <Statistic 
              title="Tổng bản ghi đã xử lý" 
              value={job.metrics.totalRecords} 
              suffix="Records"
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} bodyStyle={{ padding: '16px 20px' }} style={{ borderRadius: 8 }}>
            <Statistic 
              title="Tốc độ xử lý (Throughput)" 
              value={job.metrics.throughput} 
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} bodyStyle={{ padding: '16px 20px' }} style={{ borderRadius: 8 }}>
            <Statistic 
              title="Số lỗi phát sinh" 
              value={job.metrics.errors} 
              valueStyle={{ color: job.metrics.errors > 0 ? '#ff4d4f' : 'inherit', fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Left Pane: Progress & History */}
        <Col span={10}>
          <Card 
            title={<Space><DashboardOutlined /> Tiến trình & Hiệu năng</Space>} 
            bordered={false} 
            style={{ borderRadius: 8, height: '100%' }}
          >
            <div style={{ padding: '10px 0' }}>
              <Text type="secondary">Tiến trình đợt chạy hiện tại</Text>
              <Progress 
                percent={job.status === 'RUNNING' ? 68 : 0} 
                status={job.status === 'RUNNING' ? 'active' : 'normal'}
                strokeColor={{ '0%': '#108ee9', '100%': '#1677ff' }}
                style={{ marginTop: 8 }}
              />
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text strong><HistoryOutlined /> Lịch sử 30 phiên chạy gần nhất</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>Tỉ lệ thành công: 98.2%</Text>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 4, height: 40 }}>
                {job.history.map((h, i) => (
                  <Tooltip key={i} title={`${h.status} - ${h.timestamp}`}>
                    <div 
                      style={{ 
                        height: '100%', 
                        background: h.status === 'SUCCESS' ? '#52c41a' : '#ff4d4f',
                        opacity: 0.8,
                        borderRadius: 2
                      }} 
                    />
                  </Tooltip>
                ))}
              </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <List size="small">
              <List.Item>
                <Text type="secondary">Thời điểm bắt đầu:</Text>
                <Text strong>{job.metrics.startTime}</Text>
              </List.Item>
              <List.Item>
                <Text type="secondary">Thời gian xử lý trung bình:</Text>
                <Text strong>{job.metrics.duration}</Text>
              </List.Item>
              <List.Item>
                <Text type="secondary">Lần đầu khởi tạo:</Text>
                <Text>01/04/2026 09:12</Text>
              </List.Item>
              <List.Item>
                <Text type="secondary">Người cấu hình cuối:</Text>
                <Tag color="blue">admin_sys</Tag>
              </List.Item>
            </List>
          </Card>
        </Col>

        {/* Right Pane: Logs */}
        <Col span={14}>
          <Card 
            title={<Space><LogsOutlined /> Log vận hành thời gian thực</Space>}
            extra={<Button size="small" type="link" onClick={() => setLogs([])}>Xóa trắng Log</Button>}
            bordered={false}
            style={{ borderRadius: 8, height: '100%' }}
            bodyStyle={{ padding: 0 }}
          >
            <div 
              style={{ 
                height: 400, 
                padding: '16px 20px', 
                background: '#0a0a0a', 
                color: '#ddd',
                fontFamily: 'monospace',
                fontSize: 12,
                overflowY: 'auto',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8
              }}
            >
              {logs.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                  Đang đợi dữ liệu Log...
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} style={{ marginBottom: 4, lineHeight: '1.6' }}>
                    <span style={{ color: '#666' }}>{log.substring(0, 10)}</span>
                    <span style={{ marginLeft: 8 }}>{log.substring(10)}</span>
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default JobDetailPage;
