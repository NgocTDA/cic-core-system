import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { message, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TemplateFilter from './TemplateFilter';
import TemplateTable from './TemplateTable';
import { mockTemplates } from './mockData';
import type { INotificationTemplate, TemplateStatus, ChannelType } from './TemplateTypes';
import useHeaderActions from './../../../hooks/useHeaderActions';

const { confirm } = Modal;

const NotificationTemplate: React.FC = () => {
  const router = useRouter();
  const [allData, setAllData] = useState<INotificationTemplate[]>(mockTemplates);
  const [filteredData, setFilteredData] = useState<INotificationTemplate[]>(mockTemplates);

  // Filters state
  const [searchText, setSearchText] = useState('');
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const [filterChannel, setFilterChannel] = useState<ChannelType | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Register title and actions to the AppHeader via context
  useHeaderActions({
    title: 'Quản lý mẫu thông báo',
    actions: [
      {
        key: 'add',
        label: 'Thêm mẫu mới',
        icon: <PlusOutlined />,
        type: 'primary',
        onClick: () => {
          router.push('/notification-template/create');
        }
      }
    ]
  }, []);

  const applyFilters = (
    sourceData: INotificationTemplate[],
    search: string,
    group: string | null,
    channel: ChannelType | null,
    status: string | null
  ) => {
    return sourceData.filter(item => {
      const matchSearch = !search ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase());
      const matchGroup = !group || item.group === group;
      const matchChannel = !channel || item.channels.includes(channel);
      const matchStatus = !status || item.status === status;
      return matchSearch && matchGroup && matchChannel && matchStatus;
    });
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setFilteredData(applyFilters(allData, text, filterGroup, filterChannel, filterStatus));
  };

  const handleGroupChange = (group: string | null) => {
    setFilterGroup(group);
    setFilteredData(applyFilters(allData, searchText, group, filterChannel, filterStatus));
  };

  const handleChannelChange = (channel: ChannelType | null) => {
    setFilterChannel(channel);
    setFilteredData(applyFilters(allData, searchText, filterGroup, channel, filterStatus));
  };

  const handleStatusChange = (status: string | null) => {
    setFilterStatus(status);
    setFilteredData(applyFilters(allData, searchText, filterGroup, filterChannel, status));
  };

  const handleToggleStatus = (id: string, currentStatus: TemplateStatus) => {
    const nextStatusMap: Record<TemplateStatus, TemplateStatus> = {
      'ACTIVE': 'INACTIVE',
      'INACTIVE': 'ACTIVE',
      'DRAFT': 'APPROVED',
      'APPROVED': 'ACTIVE'
    };
    const newStatus = nextStatusMap[currentStatus] || 'ACTIVE';

    const updater = (items: INotificationTemplate[]) =>
      items.map(item => item.id === id ? { ...item, status: newStatus } : item);
    const newAll = updater(allData);
    setAllData(newAll);
    setFilteredData(applyFilters(newAll, searchText, filterGroup, filterChannel, filterStatus));
    message.success(`Đã cập nhật trạng thái mẫu thành: ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: 'Xác nhận xóa mẫu thông báo?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác. Mẫu đang được sử dụng sẽ không thể xóa.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        const newAll = allData.filter(item => item.id !== id);
        setAllData(newAll);
        setFilteredData(applyFilters(newAll, searchText, filterGroup, filterChannel, filterStatus));
        message.success('Đã xóa mẫu thông báo thành công');
      },
    });
  };

  const handleEdit = (template: INotificationTemplate) => {
    router.push(`/notification-template/${template.id}/edit`);
  };

  const handleDuplicate = (template: INotificationTemplate) => {
    router.push('/notification-template/create'); // Next.js push doesn't support state easily
    message.info(`Đang tạo bản sao từ mẫu "${template.code}"...`);
  };

  const handleView = (template: INotificationTemplate) => {
    message.info(`Xem chi tiết mẫu: ${template.code} (Tính năng đang phát triển)`);
  };

  const groups = Array.from(new Set(allData.map(item => item.group)));

  return (
    <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
      <TemplateFilter
        groups={groups}
        onSearchChange={handleSearchChange}
        onGroupChange={handleGroupChange}
        onChannelChange={handleChannelChange}
        onStatusChange={handleStatusChange}
      />

      <TemplateTable
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onDuplicate={handleDuplicate}
        onView={handleView}
      />
    </div>
  );
};

export default NotificationTemplate;
