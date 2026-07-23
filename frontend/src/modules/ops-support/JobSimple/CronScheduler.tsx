'use client';

import React, { useState } from 'react';
import { Cron } from 'react-js-cron';
import { Input, Select, Switch, Space, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { colors, spacing, radius, typography } from '@/design-system';
import { viCronLocale, TIMEZONE_OPTIONS, humanizeCron, isValidCron } from './cronLocale';

const { Text } = Typography;

interface CronSchedulerProps {
  cron: string;
  timezone: string;
  onCronChange: (cron: string) => void;
  onTimezoneChange: (tz: string) => void;
  /** Thông báo lỗi từ form (vd khi submit với cron không hợp lệ). */
  errorText?: string;
}

const CronScheduler: React.FC<CronSchedulerProps> = ({
  cron,
  timezone,
  onCronChange,
  onTimezoneChange,
  errorText,
}) => {
  const [advanced, setAdvanced] = useState(false);
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
      {/* Bộ chọn ngôn ngữ tự nhiên */}
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

      {/* Toggle nâng cao + Timezone */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: spacing[4],
          marginTop: spacing[3],
        }}
      >
        <Space size="small">
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
            Hiện nâng cao
          </Text>
          <Switch size="small" checked={advanced} onChange={setAdvanced} />
        </Space>

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
      </div>

      {/* Ô nhập cron thô (chế độ nâng cao) */}
      {advanced && (
        <div style={{ marginTop: spacing[3] }}>
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, display: 'block', marginBottom: spacing[1] }}>
            Biểu thức cron (5 trường)
          </Text>
          <Input
            value={cron}
            onChange={(e) => onCronChange(e.target.value)}
            placeholder="0 2 * * *"
            style={{ fontFamily: typography.fontFamily.mono, maxWidth: 280 }}
          />
        </div>
      )}

      {/* Dòng mô tả người-đọc-được / báo lỗi */}
      <div
        style={{
          marginTop: spacing[3],
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
            <Text style={{ color: colors.primary[600] }}>{humanizeCron(cron)}.</Text>
          </>
        )}
      </div>
    </div>
  );
};

export default CronScheduler;
