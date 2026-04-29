import React from 'react';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

type MenuItem = NonNullable<MenuProps['items']>[number];

interface ActionMenuProps {
  items: MenuItem[];
  size?: 'small' | 'middle';
}

// ─── ActionMenu ───────────────────────────────────────────────
// Standard three-dot dropdown used in table action columns.
//
// Usage:
//   <ActionMenu items={[
//     { key: 'view',   label: 'Xem chi tiết', icon: <EyeOutlined />, onClick: fn },
//     { key: 'edit',   label: 'Chỉnh sửa',    icon: <EditOutlined />, onClick: fn },
//     { type: 'divider' },
//     { key: 'delete', label: 'Xóa',           icon: <DeleteOutlined />, danger: true, onClick: fn },
//   ]} />

const ActionMenu: React.FC<ActionMenuProps> = ({ items, size }) => (
  <Dropdown menu={{ items }} trigger={['click']}>
    <Button
      type="text"
      icon={<MoreOutlined />}
      size={size}
      onClick={(e) => e.stopPropagation()}
    />
  </Dropdown>
);

export default ActionMenu;
