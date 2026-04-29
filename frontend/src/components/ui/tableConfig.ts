import type { TablePaginationConfig } from 'antd';

export const tablePagination = (
  overrides?: Partial<TablePaginationConfig>
): TablePaginationConfig => ({
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) =>
    `Hiển thị ${range[0]}-${range[1]} trong tổng ${total} bản ghi`,
  pageSizeOptions: ['10', '20', '50', '100'],
  pageSize: 20,
  ...overrides,
});
