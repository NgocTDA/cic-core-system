'use client';

import { useState, useMemo, useCallback } from 'react';
import { message } from 'antd';
import type { SummaryItem } from '@/components/ui';
import { INITIAL_PRODUCTS } from './mockData';
import type { IIndustryProduct, IIndustryProductFilter, IndustryProductStatus } from './types';

export const useIndustryAnalysis = () => {
  const [data, setData] = useState<IIndustryProduct[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<IIndustryProductFilter>({});

  // Filtered data computation
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filters.productCode && item.code !== filters.productCode) {
        return false;
      }
      if (filters.fiscalYear && item.fiscalYear !== filters.fiscalYear) {
        return false;
      }
      if (filters.industryCode && item.industryCode !== filters.industryCode) {
        return false;
      }
      if (filters.createdBy && item.createdBy !== filters.createdBy) {
        return false;
      }
      if (filters.status && item.status !== filters.status) {
        return false;
      }
      if (filters.approvalDateRange && filters.approvalDateRange.length === 2) {
        const [from, to] = filters.approvalDateRange;
        if (!item.approvedAt) return false;
        // Simple string comparison dd/mm/yyyy
        if (item.approvedAt < from || item.approvedAt > to) {
          return false;
        }
      }
      return true;
    });
  }, [data, filters]);

  // Dynamic Status Summary Bar
  const summaryItems = useMemo<SummaryItem[]>(() => {
    const total = data.length;
    const draftCount = data.filter((i) => i.status === 'DRAFT').length;
    const pendingCount = data.filter((i) => i.status === 'PENDING').length;
    const approvedCount = data.filter((i) => i.status === 'APPROVED').length;
    const rejectedCount = data.filter((i) => i.status === 'REJECTED').length;
    const recalledCount = data.filter((i) => i.status === 'RECALLED').length;

    return [
      {
        count: total,
        label: 'Tất cả',
        color: 'info',
        active: !filters.status,
        onClick: () => setFilters((prev) => ({ ...prev, status: undefined })),
      },
      {
        count: draftCount,
        label: 'Tạo mới',
        color: 'info',
        active: filters.status === 'DRAFT',
        onClick: () =>
          setFilters((prev) => ({
            ...prev,
            status: prev.status === 'DRAFT' ? undefined : 'DRAFT',
          })),
      },
      {
        count: pendingCount,
        label: 'Chờ duyệt',
        color: 'warning',
        active: filters.status === 'PENDING',
        onClick: () =>
          setFilters((prev) => ({
            ...prev,
            status: prev.status === 'PENDING' ? undefined : 'PENDING',
          })),
      },
      {
        count: approvedCount,
        label: 'Đã duyệt',
        color: 'success',
        active: filters.status === 'APPROVED',
        onClick: () =>
          setFilters((prev) => ({
            ...prev,
            status: prev.status === 'APPROVED' ? undefined : 'APPROVED',
          })),
      },
      {
        count: rejectedCount,
        label: 'Từ chối duyệt',
        color: 'error',
        active: filters.status === 'REJECTED',
        onClick: () =>
          setFilters((prev) => ({
            ...prev,
            status: prev.status === 'REJECTED' ? undefined : 'REJECTED',
          })),
      },
      {
        count: recalledCount,
        label: 'Thu hồi',
        color: 'warning',
        active: filters.status === 'RECALLED',
        onClick: () =>
          setFilters((prev) => ({
            ...prev,
            status: prev.status === 'RECALLED' ? undefined : 'RECALLED',
          })),
      },
    ];
  }, [data, filters.status]);

  const handleSearch = useCallback((newFilters: IIndustryProductFilter) => {
    setLoading(true);
    setFilters(newFilters);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  const handleReset = useCallback(() => {
    setLoading(true);
    setFilters({});
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  // Helper to format now
  const getNowFormatted = () => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return {
      dateStr: `${d}/${m}/${y}`,
      fullTimeStr: `${d}/${m}/${y} ${hh}:${mm}:${ss}`,
      isoStr: now.toISOString(),
    };
  };

  // Workflow Handlers
  const handleCreateProduct = useCallback(
    (newProductData: Partial<IIndustryProduct>, submitForApproval = false) => {
      const { dateStr, fullTimeStr, isoStr } = getNowFormatted();
      const status: IndustryProductStatus = submitForApproval ? 'PENDING' : 'DRAFT';

      const newRecord: IIndustryProduct = {
        id: `prod-${Date.now()}`,
        code: newProductData.code || 'SP-PTN-NEW',
        name: newProductData.name || 'Báo cáo mới',
        fiscalYear: newProductData.fiscalYear || 2025,
        industryCode: newProductData.industryCode || 'G47',
        industryName: newProductData.industryName || 'Bán lẻ',
        createdAt: dateStr,
        createdBy: 'admin',
        creatorFullName: 'Quản trị hệ thống',
        status,
        notes: newProductData.notes,
        fileName: newProductData.fileName,
        fileSize: newProductData.fileSize || '3.5 MB',
        history: [
          {
            id: `hist-${Date.now()}-1`,
            timestamp: isoStr,
            dateStr,
            fullTimeStr,
            updatedBy: 'admin',
            updatedByFullName: 'Quản trị hệ thống',
            action: submitForApproval ? 'Lưu & Gửi duyệt' : 'Tạo mới',
            oldValue: '-',
            newValue: submitForApproval ? 'Chờ duyệt' : 'Tạo mới',
            ipAddress: '192.168.1.10',
            description: submitForApproval
              ? 'Tạo mới và gửi lãnh đạo phê duyệt báo cáo'
              : 'Tạo mới bản thảo báo cáo',
          },
        ],
      };

      setData((prev) => [newRecord, ...prev]);
      message.success(
        submitForApproval
          ? `Đã tạo và gửi duyệt thành công sản phẩm ${newRecord.code}`
          : `Đã lưu dự thảo thành công sản phẩm ${newRecord.code}`
      );
    },
    []
  );

  const handleSendApproval = useCallback((product: IIndustryProduct) => {
    const { dateStr, fullTimeStr, isoStr } = getNowFormatted();

    setData((prev) =>
      prev.map((item) => {
        if (item.id === product.id) {
          const updatedHistory = [
            {
              id: `hist-${Date.now()}`,
              timestamp: isoStr,
              dateStr,
              fullTimeStr,
              updatedBy: 'admin',
              updatedByFullName: 'Quản trị hệ thống',
              action: 'Gửi duyệt',
              oldValue: item.status === 'DRAFT' ? 'Tạo mới' : item.status === 'REJECTED' ? 'Từ chối duyệt' : 'Thu hồi',
              newValue: 'Chờ duyệt',
              ipAddress: '192.168.1.10',
              description: 'Gửi phê duyệt báo cáo phân tích ngành',
            },
            ...(item.history || []),
          ];

          return {
            ...item,
            status: 'PENDING' as IndustryProductStatus,
            rejectReason: undefined,
            recallReason: undefined,
            history: updatedHistory,
          };
        }
        return item;
      })
    );

    message.success(`Đã gửi duyệt thành công sản phẩm ${product.code}`);
  }, []);

  const handleApprove = useCallback((product: IIndustryProduct, approvalNote: string) => {
    const { dateStr, fullTimeStr, isoStr } = getNowFormatted();

    setData((prev) =>
      prev.map((item) => {
        if (item.id === product.id) {
          const updatedHistory = [
            {
              id: `hist-${Date.now()}`,
              timestamp: isoStr,
              dateStr,
              fullTimeStr,
              updatedBy: 'admin',
              updatedByFullName: 'Quản trị hệ thống',
              action: 'Phê duyệt',
              oldValue: 'Chờ duyệt',
              newValue: 'Đã duyệt',
              ipAddress: '192.168.1.10',
              description: approvalNote ? `Phê duyệt: ${approvalNote}` : 'Phê duyệt ban hành báo cáo',
            },
            ...(item.history || []),
          ];

          return {
            ...item,
            status: 'APPROVED' as IndustryProductStatus,
            approvedBy: 'admin',
            approverFullName: 'Quản trị hệ thống',
            approvedAt: dateStr,
            approvalNote,
            history: updatedHistory,
          };
        }
        return item;
      })
    );

    message.success(`Đã phê duyệt thành công sản phẩm ${product.code}`);
  }, []);

  const handleReject = useCallback((product: IIndustryProduct, rejectReason: string) => {
    const { dateStr, fullTimeStr, isoStr } = getNowFormatted();

    setData((prev) =>
      prev.map((item) => {
        if (item.id === product.id) {
          const updatedHistory = [
            {
              id: `hist-${Date.now()}`,
              timestamp: isoStr,
              dateStr,
              fullTimeStr,
              updatedBy: 'admin',
              updatedByFullName: 'Quản trị hệ thống',
              action: 'Từ chối duyệt',
              oldValue: 'Chờ duyệt',
              newValue: 'Từ chối duyệt',
              ipAddress: '192.168.1.10',
              description: `Từ chối duyệt: ${rejectReason}`,
            },
            ...(item.history || []),
          ];

          return {
            ...item,
            status: 'REJECTED' as IndustryProductStatus,
            approvedBy: 'admin',
            approverFullName: 'Quản trị hệ thống',
            approvedAt: dateStr,
            rejectReason,
            history: updatedHistory,
          };
        }
        return item;
      })
    );

    message.success(`Đã từ chối duyệt sản phẩm ${product.code}`);
  }, []);

  const handleRecall = useCallback((product: IIndustryProduct, recallReason: string) => {
    const { dateStr, fullTimeStr, isoStr } = getNowFormatted();

    setData((prev) =>
      prev.map((item) => {
        if (item.id === product.id) {
          const updatedHistory = [
            {
              id: `hist-${Date.now()}`,
              timestamp: isoStr,
              dateStr,
              fullTimeStr,
              updatedBy: 'admin',
              updatedByFullName: 'Quản trị hệ thống',
              action: 'Thu hồi',
              oldValue: item.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt',
              newValue: 'Thu hồi',
              ipAddress: '192.168.1.10',
              description: `Thu hồi: ${recallReason}`,
            },
            ...(item.history || []),
          ];

          return {
            ...item,
            status: 'RECALLED' as IndustryProductStatus,
            recallReason,
            history: updatedHistory,
          };
        }
        return item;
      })
    );

    message.success(`Đã thu hồi thành công sản phẩm ${product.code}`);
  }, []);

  const handleDownload = useCallback((product: IIndustryProduct) => {
    message.loading({ content: `Đang tải xuống tệp ${product.fileName}...`, key: 'downloading' });
    setTimeout(() => {
      message.success({ content: `Tải xuống tệp ${product.fileName} thành công!`, key: 'downloading' });
    }, 800);
  }, []);

  return {
    data: filteredData,
    loading,
    summaryItems,
    handleSearch,
    handleReset,
    handleCreateProduct,
    handleSendApproval,
    handleApprove,
    handleReject,
    handleRecall,
    handleDownload,
  };
};
