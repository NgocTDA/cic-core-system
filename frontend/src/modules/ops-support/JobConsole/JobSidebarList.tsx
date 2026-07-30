'use client';

import React from 'react';
import { Input, Select, Badge, Tag, Space, Typography } from 'antd';
import { SearchOutlined, ClockCircleOutlined, CodeOutlined, GlobalOutlined, DatabaseOutlined } from '@ant-design/icons';
import { colors, spacing, radius, typography } from '@/design-system';
import { CodeText, StatusTag } from '@/components/ui';
import type { IJobConsoleItem } from './types';

const { Text } = Typography;

interface JobSidebarListProps {
  jobs: IJobConsoleItem[];
  selectedCode: string;
  keyword: string;
  statusFilter: string;
  onSearchChange: (kw: string) => void;
  onStatusFilterChange: (st: string) => void;
  onSelectJob: (code: string) => void;
}

const renderTypeBadge = (type: string) => {
  switch (type) {
    case 'SPRING_BEAN':
      return (
        <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>
          <CodeOutlined style={{ marginRight: 4 }} /> Spring Bean
        </Tag>
      );
    case 'REST_API':
      return (
        <Tag color="green" style={{ margin: 0, fontSize: 11 }}>
          <GlobalOutlined style={{ marginRight: 4 }} /> REST API
        </Tag>
      );
    case 'SQL_SCRIPT':
      return (
        <Tag color="gold" style={{ margin: 0, fontSize: 11 }}>
          <DatabaseOutlined style={{ marginRight: 4 }} /> SQL Script
        </Tag>
      );
    default:
      return <Tag style={{ margin: 0, fontSize: 11 }}>{type}</Tag>;
  }
};

export const JobSidebarList: React.FC<JobSidebarListProps> = ({
  jobs,
  selectedCode,
  keyword,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onSelectJob,
}) => {
  return (
    <div
      style={{
        backgroundColor: colors.bg.container,
        borderRadius: radius.lg,
        border: `1px solid ${colors.border.split}`,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 170px)',
        minHeight: 650,
        overflow: 'hidden',
      }}
    >
      {/* Header bar bộ lọc */}
      <div
        style={{
          padding: spacing[3],
          backgroundColor: colors.bg.subtle,
          borderBottom: `1px solid ${colors.border.split}`,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[2],
        }}
      >
        <Input
          placeholder="Tìm kiếm theo Mã Job, Tên Job..."
          prefix={<SearchOutlined style={{ color: colors.text.tertiary }} />}
          value={keyword}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          size="middle"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Select
            placeholder="Tất cả trạng thái"
            value={statusFilter || undefined}
            onChange={(val) => onStatusFilterChange(val || '')}
            allowClear
            size="small"
            style={{ width: 160 }}
            options={[
              { value: 'ACTIVE', label: 'Hoạt động (Active)' },
              { value: 'PAUSED', label: 'Tạm dừng (Paused)' },
            ]}
          />
          <Text style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
            <Badge count={jobs.length} style={{ backgroundColor: colors.neutral[400] }} /> Jobs
          </Text>
        </div>
      </div>

      {/* Danh sách Thẻ Job (Scrollable) */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {jobs.length === 0 ? (
          <div style={{ padding: spacing[6], textAlign: 'center', color: colors.text.tertiary }}>
            Không tìm thấy job phù hợp
          </div>
        ) : (
          jobs.map((job) => {
            const isSelected = job.code === selectedCode;
            const isActive = job.status === 'ACTIVE';

            return (
              <div
                key={job.code}
                onClick={() => onSelectJob(job.code)}
                style={{
                  padding: spacing[4],
                  borderBottom: `1px solid ${colors.border.split}`,
                  borderLeft: `4px solid ${isSelected ? colors.primary[500] : 'transparent'}`,
                  backgroundColor: isSelected ? colors.primary[50] : colors.bg.container,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[1] }}>
                  <CodeText style={{ fontSize: 11 }}>{job.code}</CodeText>
                  <StatusTag status={isActive ? 'ACTIVE' : 'PAUSED'} />
                </div>

                <div
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                    marginBottom: spacing[2],
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {job.name}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                  <Space size={4}>
                    <ClockCircleOutlined style={{ fontSize: typography.fontSize.xs }} />
                    <code style={{ fontFamily: typography.fontFamily.mono, fontSize: typography.fontSize.xs }}>{job.cron}</code>
                  </Space>

                  {renderTypeBadge(job.type)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobSidebarList;
