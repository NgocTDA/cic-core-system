'use client';

import React from 'react';
import { Dropdown, Button, message } from 'antd';
import type { MenuProps } from 'antd';
import { FileExcelOutlined, PrinterOutlined, FilterOutlined, FileTextOutlined } from '@ant-design/icons';
import { colors } from '@/design-system';

interface ExportExcelDropdownProps {
  onExportCurrent?: () => void;
  onExportFilter?: () => void;
  onPrintCurrent?: () => void;
  buttonText?: string;
  style?: React.CSSProperties;
}

export const ExportExcelDropdown: React.FC<ExportExcelDropdownProps> = ({
  onExportCurrent,
  onExportFilter,
  onPrintCurrent,
  buttonText = 'Xuất Excel',
  style,
}) => {
  const handleExportCurrent = () => {
    if (onExportCurrent) {
      onExportCurrent();
    } else {
      message.success('Đã xuất file Excel cho trang hiện tại');
    }
  };

  const handleExportFilter = () => {
    if (onExportFilter) {
      onExportFilter();
    } else {
      message.success('Đã xuất file Excel theo bộ lọc đã chọn');
    }
  };

  const handlePrintCurrent = () => {
    if (onPrintCurrent) {
      onPrintCurrent();
    } else {
      window.print();
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'export_current',
      label: 'Xuất trang hiện tại',
      icon: <FileTextOutlined style={{ color: colors.primary[500] }} />,
      onClick: handleExportCurrent,
    },
    {
      key: 'export_filter',
      label: 'Xuất theo bộ lọc',
      icon: <FilterOutlined style={{ color: colors.primary[500] }} />,
      onClick: handleExportFilter,
    },
    {
      key: 'print_current',
      label: 'In trang hiện tại',
      icon: <PrinterOutlined style={{ color: colors.primary[500] }} />,
      onClick: handlePrintCurrent,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
      <Button
        icon={<FileExcelOutlined style={{ color: colors.primary[500] }} />}
        style={style}
      >
        {buttonText}
      </Button>
    </Dropdown>
  );
};
