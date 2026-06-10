import React, { useMemo, useState } from 'react';
import { Table, Space, Button, Tag, Drawer, Empty, Row, Col, Statistic, Descriptions, Modal, Select, Checkbox, message } from 'antd';
import { FileTextOutlined, DownloadOutlined, DiffOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { mockJobRuns } from '../mockData';
import type { IJobRun } from '../types';
import { generateRunLogs } from '../mockData';
import { exportRuns, compareRuns } from '../utils/exportUtils';

interface HistoryTabProps {
  jobId: string;
}

interface ComparisonRuns {
  run1: IJobRun;
  run2: IJobRun;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ jobId }) => {
  const [selectedRun, setSelectedRun] = useState<IJobRun | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [comparisonRuns, setComparisonRuns] = useState<ComparisonRuns | null>(null);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [exportIncludeLogs, setExportIncludeLogs] = useState(false);

  const jobRuns = useMemo(() => {
    return mockJobRuns.filter(run => run.jobId === jobId);
  }, [jobId]);

  const statusColors: Record<string, string> = {
    SUCCESS: 'green',
    FAILED: 'red',
    RUNNING: 'blue',
    CANCELLED: 'orange',
  };

  const columns: TableProps<IJobRun>['columns'] = [
    {
      title: 'ID chạy',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => <Tag color="blue">{id.slice(0, 8)}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusColors[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration?: number) => (duration ? `${duration}s` : '-'),
    },
    {
      title: 'Kích hoạt',
      dataIndex: 'triggerType',
      key: 'triggerType',
      width: 100,
      render: (type: string) => {
        const colors: Record<string, string> = {
          MANUAL: 'blue',
          SCHEDULED: 'green',
          TRIGGERED: 'orange',
        };
        return <Tag color={colors[type] || 'default'}>{type}</Tag>;
      },
    },
    {
      title: 'Được kích hoạt bởi',
      dataIndex: 'triggeredBy',
      key: 'triggeredBy',
      width: 120,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => {
              setSelectedRun(record);
              setDrawerVisible(true);
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const handleDownloadLogs = () => {
    if (selectedRun) {
      const logsText = (selectedRun.logs || []).map(log => `[${log.level}] ${log.message}`).join('\n');
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logsText));
      element.setAttribute('download', `job-run-${selectedRun.id}.log`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleExport = () => {
    const runsToExport = selectedRuns.length > 0
      ? jobRuns.filter(run => selectedRuns.includes(run.id))
      : jobRuns;

    if (runsToExport.length === 0) {
      message.warning('Vui lòng chọn ít nhất một lần chạy để xuất');
      return;
    }

    exportRuns(runsToExport, {
      format: exportFormat,
      includeFields: ['id', 'status', 'startTime', 'duration', 'triggeredBy', 'recordsProcessed', 'recordsFailed'],
      includeLogs: exportIncludeLogs,
    });

    message.success(`Đã xuất ${runsToExport.length} lần chạy thành công`);
    setExportModalVisible(false);
  };

  const handleCompare = () => {
    if (selectedRuns.length !== 2) {
      message.warning('Vui lòng chọn đúng 2 lần chạy để so sánh');
      return;
    }

    const run1 = jobRuns.find(r => r.id === selectedRuns[0])!;
    const run2 = jobRuns.find(r => r.id === selectedRuns[1])!;

    setComparisonRuns({ run1, run2 });
  };

  const stats = useMemo(() => {
    return {
      total: jobRuns.length,
      success: jobRuns.filter(r => r.status === 'SUCCESS').length,
      failed: jobRuns.filter(r => r.status === 'FAILED').length,
      avgDuration: Math.round(jobRuns.reduce((sum, r) => sum + (r.duration || 0), 0) / jobRuns.length) || 0,
      totalRecords: jobRuns.reduce((sum, r) => sum + (r.recordsProcessed || 0), 0),
    };
  }, [jobRuns]);

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Statistic title="Tổng chạy" value={stats.total} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Thành công" value={stats.success} valueStyle={{ color: '#52c41a' }} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Thất bại" value={stats.failed} valueStyle={{ color: '#ff4d4f' }} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Trung bình (s)" value={stats.avgDuration} />
        </Col>
      </Row>

      {/* Action Buttons */}
      <Space style={{ marginBottom: '16px' }}>
        <Button
          icon={<DownloadOutlined />}
          onClick={() => setExportModalVisible(true)}
        >
          Xuất ({selectedRuns.length > 0 ? selectedRuns.length : 'tất cả'})
        </Button>
        <Button
          icon={<DiffOutlined />}
          onClick={handleCompare}
          disabled={selectedRuns.length !== 2}
        >
          So sánh (chọn 2)
        </Button>
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={jobRuns}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1200 }}
        size="middle"
        rowSelection={{
          selectedRowKeys: selectedRuns,
          onChange: (selectedRowKeys) => setSelectedRuns(selectedRowKeys as string[]),
        }}
      />

      {/* Run Detail Drawer */}
      {selectedRun && (
        <Drawer
          title={`Chi tiết lần chạy: ${selectedRun.id.slice(0, 8)}`}
          placement="right"
          onClose={() => {
            setDrawerVisible(false);
            setSelectedRun(null);
          }}
          open={drawerVisible}
          width={700}
          extra={
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadLogs}
              size="small"
            >
              Tải logs
            </Button>
          }
        >
          {/* Statistics */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={12}>
              <Statistic
                title="Trạng thái"
                value={
                  <Tag color={statusColors[selectedRun.status] || 'default'}>
                    {selectedRun.status}
                  </Tag>
                }
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Thời lượng"
                value={selectedRun.duration || 0}
                suffix="giây"
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Bản ghi xử lý"
                value={selectedRun.recordsProcessed || 0}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Bản ghi lỗi"
                value={selectedRun.recordsFailed || 0}
              />
            </Col>
          </Row>

          {/* Details */}
          <Descriptions bordered column={1} style={{ marginBottom: '24px' }}>
            <Descriptions.Item label="ID">
              {selectedRun.id}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian bắt đầu">
              {selectedRun.startTime}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian kết thúc">
              {selectedRun.endTime || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Loại kích hoạt">
              <Tag color="blue">{selectedRun.triggerType}</Tag>
            </Descriptions.Item>
            {selectedRun.errorMessage && (
              <Descriptions.Item label="Thông báo lỗi">
                <div style={{ color: '#ff4d4f' }}>{selectedRun.errorMessage}</div>
              </Descriptions.Item>
            )}
            {selectedRun.errorDetail && (
              <Descriptions.Item label="Chi tiết lỗi">
                <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '2px' }}>
                  {selectedRun.errorDetail}
                </pre>
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* Logs */}
          <h4>Logs</h4>
          {selectedRun.logs && selectedRun.logs.length > 0 ? (
            <div style={{ background: '#000', color: '#0f0', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px', maxHeight: '300px', overflowY: 'auto' }}>
              {selectedRun.logs.map((log, idx) => (
                <div key={idx}>
                  <span style={{ color: log.level === 'ERROR' ? '#ff4d4f' : log.level === 'WARN' ? '#faad14' : '#0f0' }}>
                    [{log.level}]
                  </span>
                  {' '}
                  {log.message}
                </div>
              ))}
            </div>
          ) : (
            <Empty description="Không có logs" />
          )}
        </Drawer>
      )}

      {/* Export Modal */}
      <Modal
        title="Xuất lịch sử chạy"
        open={exportModalVisible}
        onOk={handleExport}
        onCancel={() => setExportModalVisible(false)}
        width={500}
      >
        <div style={{ marginBottom: '16px' }}>
          <strong>Định dạng xuất</strong>
          <Select
            style={{ width: '100%', marginTop: '8px' }}
            value={exportFormat}
            onChange={setExportFormat}
            options={[
              { value: 'json', label: 'JSON' },
              { value: 'csv', label: 'CSV' },
            ]}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Checkbox
            checked={exportIncludeLogs}
            onChange={(e) => setExportIncludeLogs(e.target.checked)}
          >
            Bao gồm logs chi tiết (kích thước file lớn hơn)
          </Checkbox>
        </div>

        <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Sẽ xuất:</strong> {selectedRuns.length > 0 ? selectedRuns.length : jobRuns.length} lần chạy
        </div>
      </Modal>

      {/* Comparison Modal */}
      {comparisonRuns && (
        <Modal
          title="So sánh 2 lần chạy"
          open={!!comparisonRuns}
          onCancel={() => setComparisonRuns(null)}
          footer={null}
          width={700}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <h4>Lần chạy 1: {comparisonRuns.run1.id.slice(0, 8)}</h4>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Trạng thái">
                  <Tag color={statusColors[comparisonRuns.run1.status]}>
                    {comparisonRuns.run1.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian">
                  {comparisonRuns.run1.startTime}
                </Descriptions.Item>
                <Descriptions.Item label="Thời lượng">
                  {comparisonRuns.run1.duration}s
                </Descriptions.Item>
                <Descriptions.Item label="Bản ghi">
                  {comparisonRuns.run1.recordsProcessed}
                </Descriptions.Item>
                <Descriptions.Item label="Lỗi">
                  {comparisonRuns.run1.recordsFailed}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col span={12}>
              <h4>Lần chạy 2: {comparisonRuns.run2.id.slice(0, 8)}</h4>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Trạng thái">
                  <Tag color={statusColors[comparisonRuns.run2.status]}>
                    {comparisonRuns.run2.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian">
                  {comparisonRuns.run2.startTime}
                </Descriptions.Item>
                <Descriptions.Item label="Thời lượng">
                  {comparisonRuns.run2.duration}s
                </Descriptions.Item>
                <Descriptions.Item label="Bản ghi">
                  {comparisonRuns.run2.recordsProcessed}
                </Descriptions.Item>
                <Descriptions.Item label="Lỗi">
                  {comparisonRuns.run2.recordsFailed}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>

          {/* Comparison Results */}
          <div style={{ marginTop: '24px', padding: '12px', background: '#f0f5ff', borderRadius: '4px' }}>
            <strong>So sánh</strong>
            <Row gutter={[16, 16]} style={{ marginTop: '12px' }}>
              <Col span={12}>
                <div>
                  Thời lượng:
                  {' '}
                  <Tag color={compareRuns(comparisonRuns.run1, comparisonRuns.run2).durationDiff > 0 ? 'red' : 'green'}>
                    {compareRuns(comparisonRuns.run1, comparisonRuns.run2).durationDiff > 0 ? '+' : ''}
                    {compareRuns(comparisonRuns.run1, comparisonRuns.run2).durationDiff}s
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  Bản ghi:
                  {' '}
                  <Tag color={compareRuns(comparisonRuns.run1, comparisonRuns.run2).recordsDiff > 0 ? 'green' : 'red'}>
                    {compareRuns(comparisonRuns.run1, comparisonRuns.run2).recordsDiff > 0 ? '+' : ''}
                    {compareRuns(comparisonRuns.run1, comparisonRuns.run2).recordsDiff}
                  </Tag>
                </div>
              </Col>
            </Row>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HistoryTab;
