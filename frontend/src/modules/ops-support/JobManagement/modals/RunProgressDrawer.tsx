import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Progress, Statistic, Row, Col, Card, Divider, Button, Space, Tag, Alert } from 'antd';
import { PauseCircleOutlined, DownloadOutlined, CopyOutlined } from '@ant-design/icons';
import { generateRunLogs } from '../mockData';

interface RunProgressDrawerProps {
  visible: boolean;
  jobName: string;
  jobCode: string;
  onClose: () => void;
  onStop?: () => void;
}

const RunProgressDrawer: React.FC<RunProgressDrawerProps> = ({
  visible,
  jobName,
  jobCode,
  onClose,
  onStop,
}) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<Array<{ timestamp: string; level: string; message: string }>>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [duration, setDuration] = useState(0);
  const [recordsProcessed, setRecordsProcessed] = useState(0);
  const [currentStep, setCurrentStep] = useState('初始化');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new logs arrive
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Simulate job progress
  useEffect(() => {
    if (!visible || !isRunning) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsRunning(false);
          return 100;
        }

        const increment = Math.random() * 15;
        return Math.min(prev + increment, 100);
      });

      setDuration(prev => prev + 1);
      setRecordsProcessed(prev => prev + Math.floor(Math.random() * 50 + 10));

      // Add random log
      const logLevels = ['INFO', 'WARN', 'DEBUG', 'ERROR'];
      const messages = [
        'Đang xử lý batch...',
        'Kết nối database thành công',
        'Kiểm tra dữ liệu',
        'Xác thực thông tin',
        'Đồng bộ hóa dữ liệu',
        'Cập nhật bản ghi',
        'Xoá bản ghi cũ',
        'Tạo báo cáo',
        'Gửi thông báo',
        'Lưu lại trạng thái',
      ];

      const newLog = {
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        level: logLevels[Math.floor(Math.random() * logLevels.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };

      setLogs(prev => [...prev, newLog]);
    }, 800);

    return () => clearInterval(interval);
  }, [visible, isRunning]);

  const handleDownloadLogs = () => {
    const logsText = logs.map(log => `[${log.timestamp}] [${log.level}] ${log.message}`).join('\n');
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logsText));
    element.setAttribute('download', `${jobCode}-progress.log`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyLogs = () => {
    const logsText = logs.map(log => `[${log.timestamp}] [${log.level}] ${log.message}`).join('\n');
    navigator.clipboard.writeText(logsText);
  };

  const getLogColor = (level: string) => {
    const colors: Record<string, string> = {
      ERROR: '#ff4d4f',
      WARN: '#faad14',
      INFO: '#1890ff',
      DEBUG: '#722ed1',
    };
    return colors[level] || '#000';
  };

  return (
    <Drawer
      title={`Tiến độ: ${jobName}`}
      placement="right"
      onClose={onClose}
      open={visible}
      width={700}
      extra={
        <Space>
          {isRunning && onStop && (
            <Button
              danger
              icon={<PauseCircleOutlined />}
              onClick={onStop}
              size="small"
            >
              Dừng
            </Button>
          )}
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownloadLogs}
            size="small"
          >
            Tải
          </Button>
          <Button
            icon={<CopyOutlined />}
            onClick={handleCopyLogs}
            size="small"
          >
            Sao
          </Button>
        </Space>
      }
    >
      {/* Status Alert */}
      {isRunning ? (
        <Alert
          message="Job đang chạy"
          description="Theo dõi tiến độ và logs dưới đây"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      ) : (
        <Alert
          message="Job đã hoàn thành"
          description={`Hoàn thành trong ${duration} giây với ${recordsProcessed} bản ghi xử lý`}
          type="success"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Progress Bar */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <strong>Tiến độ</strong>
        </div>
        <Progress
          percent={Math.round(progress)}
          status={isRunning ? 'active' : progress === 100 ? 'success' : 'exception'}
        />
      </Card>

      {/* Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Statistic
            title="Thời gian (giây)"
            value={duration}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Bản ghi xử lý"
            value={recordsProcessed}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
      </Row>

      {/* Current Step */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Bước hiện tại</strong>
        </div>
        <Tag color="blue">{currentStep}</Tag>
      </Card>

      {/* Logs */}
      <Divider />
      <div style={{ marginBottom: '12px' }}>
        <strong>Logs thời gian thực ({logs.length})</strong>
      </div>
      <div
        style={{
          background: '#1a1a1a',
          color: '#0f0',
          padding: '12px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
          height: '300px',
          overflowY: 'auto',
          border: '1px solid #333',
        }}
      >
        {logs.map((log, idx) => (
          <div key={idx} style={{ marginBottom: '4px' }}>
            <span style={{ color: '#666' }}>[{log.timestamp}]</span>
            {' '}
            <span style={{ color: getLogColor(log.level) }}>
              [{log.level}]
            </span>
            {' '}
            <span style={{ color: '#0f0' }}>{log.message}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </Drawer>
  );
};

export default RunProgressDrawer;
