'use client';

import React, { useState } from 'react';
import { Cron } from 'react-js-cron';
import { Input, Select, Segmented, Space, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { colors, spacing, radius, typography } from '@/design-system';
import { viCronLocale, TIMEZONE_OPTIONS, describeCron, isValidCron } from './cronLocale';

const { Text } = Typography;

type ScheduleMode = 'picker' | 'cron';

interface CronSchedulerProps {
  cron: string;
  timezone: string;
  onCronChange: (cron: string) => void;
  onTimezoneChange: (tz: string) => void;
  /** Thông báo lỗi từ form (vd khi submit với cron không hợp lệ). */
  errorText?: string;
}

const MODE_OPTIONS = [
  { value: 'picker' as ScheduleMode, label: 'Chọn lịch' },
  { value: 'cron' as ScheduleMode, label: 'Cron' },
];

const CronScheduler: React.FC<CronSchedulerProps> = ({
  cron,
  timezone,
  onCronChange,
  onTimezoneChange,
  errorText,
}) => {
  const [mode, setMode] = useState<ScheduleMode>('picker');
  const invalid = !isValidCron(cron);

  return (
    <div
      style={{
        border: `1px solid ${invalid ? colors.error.base : colors.border.split}`,
        borderRadius: radius.lg,
        padding: spacing[4],
        background: colors.bg.container,
      }}
    >
      {/* Hàng điều khiển: Múi giờ + Kiểu cấu hình */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: spacing[5],
          marginBottom: spacing[4],
        }}
      >
        <Space size="small">
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Múi giờ</Text>
          <Select
            size="small"
            value={timezone}
            onChange={onTimezoneChange}
            options={TIMEZONE_OPTIONS}
            style={{ minWidth: 200 }}
          />
        </Space>

        <Space size="small">
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Kiểu cấu hình</Text>
          <Segmented<ScheduleMode>
            size="small"
            value={mode}
            onChange={(val) => setMode(val)}
            options={MODE_OPTIONS}
          />
        </Space>
      </div>

      {/* Vùng cấu hình — chỉ hiển thị theo một kiểu tại một thời điểm */}
      {mode === 'picker' ? (
        <div className="cic-cron-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2], alignItems: 'center' }}>
          <Cron
            value={cron}
            setValue={(val: string) => onCronChange(val)}
            locale={viCronLocale}
            clearButton={false}
            humanizeLabels
            displayError
          />
        </div>
      ) : (
        <div>
          <Text
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              display: 'block',
              marginBottom: spacing[1],
            }}
          >
            Biểu thức cron (5 trường: phút giờ ngày tháng thứ)
          </Text>
          <Input
            value={cron}
            onChange={(e) => onCronChange(e.target.value)}
            placeholder="0 2 * * *"
            style={{ fontFamily: typography.fontFamily.mono, maxWidth: 280 }}
          />
        </div>
      )}

      {/* Dòng diễn giải người-đọc-được / báo lỗi */}
      <div
        style={{
          marginTop: spacing[4],
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          color: invalid ? colors.error.base : colors.primary[500],
          fontSize: typography.fontSize.sm,
        }}
      >
        {invalid ? (
          <>
            <WarningOutlined />
            <Text style={{ color: colors.error.base }}>
              {errorText || 'Lịch chạy không hợp lệ — vui lòng chọn hoặc nhập biểu thức cron đúng.'}
            </Text>
          </>
        ) : (
          <>
            {cron ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            <Text style={{ color: colors.primary[600] }}>{describeCron(cron)}.</Text>
          </>
        )}
      </div>
    </div>
  );
};

export default CronScheduler;
