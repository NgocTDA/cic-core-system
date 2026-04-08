import React, { useState } from 'react';
import { message, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import VariableFilter from './VariableFilter';
import VariableTable from './VariableTable';
import VariableForm from './VariableForm';
import { mockVariables } from './mockData';
import type { IVariable, VariableStatus } from './VariableTypes';
import useHeaderActions from './../../../hooks/useHeaderActions';

const { confirm } = Modal;

const VariableRegistry: React.FC = () => {
  const [allData, setAllData] = useState<IVariable[]>(mockVariables);
  const [filteredData, setFilteredData] = useState<IVariable[]>(mockVariables);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<IVariable | null>(null);

  // Filters state
  const [searchText, setSearchText] = useState('');
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Register title and actions to the AppHeader via context
  useHeaderActions({
    title: 'Danh mục biến dùng chung',
    actions: [
      {
        key: 'add',
        label: 'Thêm biến mới',
        icon: <PlusOutlined />,
        type: 'primary',
        onClick: () => {
          setEditingVariable(null);
          setIsModalOpen(true);
        }
      }
    ]
  }, []);

  const applyFilters = (sourceData: IVariable[], search: string, group: string | null, status: string | null) => {
    return sourceData.filter(item => {
      const matchSearch = !search ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.displayName.toLowerCase().includes(search.toLowerCase());
      const matchGroup = !group || item.group === group;
      const matchStatus = !status || item.status === status;
      return matchSearch && matchGroup && matchStatus;
    });
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setFilteredData(applyFilters(allData, text, filterGroup, filterStatus));
  };

  const handleGroupChange = (group: string | null) => {
    setFilterGroup(group);
    setFilteredData(applyFilters(allData, searchText, group, filterStatus));
  };

  const handleStatusChange = (status: string | null) => {
    setFilterStatus(status);
    setFilteredData(applyFilters(allData, searchText, filterGroup, status));
  };

  const handleToggleStatus = (id: string, currentStatus: VariableStatus) => {
    const newStatus: VariableStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updater = (items: IVariable[]) =>
      items.map(item => item.id === id ? { ...item, status: newStatus } : item);
    const newAll = updater(allData);
    setAllData(newAll);
    setFilteredData(applyFilters(newAll, searchText, filterGroup, filterStatus));
    message.success(`Đã ${newStatus === 'ACTIVE' ? 'kích hoạt' : 'vô hiệu hóa'} biến thành công`);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: 'Xác nhận xóa biến?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác. Biến đang được sử dụng sẽ không thể xóa.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        const newAll = allData.filter(item => item.id !== id);
        setAllData(newAll);
        setFilteredData(applyFilters(newAll, searchText, filterGroup, filterStatus));
        message.success('Đã xóa biến thành công');
      },
    });
  };

  const handleEdit = (variable: IVariable) => {
    setEditingVariable(variable);
    setIsModalOpen(true);
  };

  const handleDuplicate = (variable: IVariable) => {
    const newVar: IVariable = {
      ...variable,
      id: Date.now().toString(),
      code: '', // Để trống để bắt buộc người dùng điền mã mới
      displayName: `${variable.displayName} (Bản sao)`,
      status: 'ACTIVE',
      isInUse: false
    };
    setEditingVariable(newVar);
    setIsModalOpen(true);
    message.info(`Đang tạo bản sao từ biến "${variable.code}"...`);
  };

  const handleSubmit = (values: Partial<IVariable>) => {
    const isExisting = allData.some(v => v.id === editingVariable?.id);

    if (editingVariable && isExisting) {
      const newAll = allData.map(item =>
        item.id === editingVariable.id ? { ...item, ...values } : item
      );
      setAllData(newAll);
      setFilteredData(applyFilters(newAll, searchText, filterGroup, filterStatus));
      message.success('Cập nhật biến thành công');
    } else {
      const newVar: IVariable = {
        ...values as IVariable,
        id: editingVariable?.id || Date.now().toString(),
        status: 'ACTIVE',
        isInUse: false
      };
      const newAll = [newVar, ...allData];
      setAllData(newAll);
      setFilteredData(applyFilters(newAll, searchText, filterGroup, filterStatus));
      message.success('Tạo biến mới thành công');
    }
    setIsModalOpen(false);
    setEditingVariable(null);
  };

  const groups = Array.from(new Set(allData.map(item => item.group)));

  return (
    <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Card 1: Filter Area */}
      <VariableFilter
        groups={groups}
        onSearchChange={handleSearchChange}
        onGroupChange={handleGroupChange}
        onStatusChange={handleStatusChange}
      />

      {/* Card 2: Data Table */}
      <VariableTable
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onDuplicate={handleDuplicate}
      />

      {/* Drawer Form */}
      <VariableForm
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingVariable={editingVariable}
      />
    </div>
  );
};

export default VariableRegistry;

