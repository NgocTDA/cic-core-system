import { useState, useEffect, useCallback } from 'react';
import { BalanceReport, ReconciliationDetailRow, TrangThaiTep } from './types';
import { INITIAL_DATA, generateTreeReconciliationData } from '@/modules/web-portal/SendBalance/mockData';

export const useCollectBalance = () => {
  const [data, setData] = useState<BalanceReport[]>([]);
  const [customDetailsMap, setCustomDetailsMap] = useState<Record<string, ReconciliationDetailRow[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('send_balance_reports');
      const storedDetails = localStorage.getItem('send_balance_details_map');
      
      let parsedData = INITIAL_DATA;
      if (storedData) {
        try {
          const loadedData = JSON.parse(storedData);
          if (Array.isArray(loadedData) && loadedData.length > 0) {
            const loadedKeys = new Set(loadedData.map((x: any) => String(x.key)));
            const missing = INITIAL_DATA.filter(item => !loadedKeys.has(String(item.key)));
            if (missing.length > 0) {
              parsedData = [...loadedData, ...missing].sort((a, b) => parseInt(a.key, 10) - parseInt(b.key, 10));
              parsedData = parsedData.map((item, idx) => ({ ...item, stt: idx + 1 }));
            } else {
              parsedData = loadedData;
            }
          }
        } catch (e) {
          console.error('Lỗi khi đọc send_balance_reports:', e);
        }
      }
      
      // Lọc chỉ lấy các báo cáo đã gửi CIC (hoặc đã tiếp nhận)
      const submittedData = parsedData.filter(item => 
        item.trangThai === 'DA_GUI_CIC' || item.trangThai === 'DA_TIEP_NHAN'
      );
      setData(submittedData);

      if (storedDetails) {
        try {
          setCustomDetailsMap(JSON.parse(storedDetails));
        } catch (e) {
          console.error('Lỗi khi đọc send_balance_details_map:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes (only after initial load has finished)
  // In a real app, this would be an API call. Here we update localStorage so portal sees it too.
  const persistChanges = useCallback((newData: BalanceReport[], newDetailsMap: Record<string, ReconciliationDetailRow[]>) => {
    if (typeof window !== 'undefined') {
      const storedDataStr = localStorage.getItem('send_balance_reports');
      let allData: BalanceReport[] = [];
      if (storedDataStr) {
        try {
          allData = JSON.parse(storedDataStr);
        } catch (e) {
          console.error(e);
        }
      }
      
      // Update the modified items in the global data array
      const newDataMap = new Map(newData.map(item => [item.key, item]));
      const updatedAllData = allData.map(item => newDataMap.has(item.key) ? newDataMap.get(item.key)! : item);
      
      localStorage.setItem('send_balance_reports', JSON.stringify(updatedAllData));
      localStorage.setItem('send_balance_details_map', JSON.stringify(newDetailsMap));
    }
  }, []);

  // Thay đổi giá trị của ô đối chiếu trong list
  const handleCellEdit = useCallback((
    rowKey: string,
    dataIndex: keyof ReconciliationDetailRow,
    value: any,
    reportKey: string
  ) => {
    setCustomDetailsMap(prevMap => {
      let currentChildren = prevMap[reportKey];
      if (!currentChildren) {
        const parentRow = generateTreeReconciliationData(data).find(item => item.parentKey === reportKey && item.isParent);
        currentChildren = parentRow?.children ? [...parentRow.children] : [];
      }
      const updatedChildren = currentChildren.map(child => {
        if (child.key === rowKey) {
          return { ...child, [dataIndex]: value };
        }
        return child;
      });
      const newMap = { ...prevMap, [reportKey]: updatedChildren };
      
      // Immediately persist custom changes if needed, but normally done on Save
      return newMap;
    });
  }, [data]);

  // Cán bộ nội bộ lưu thay đổi số liệu (nhưng chưa tiếp nhận)
  const saveReportChanges = useCallback((
    reportKey: string,
    details: ReconciliationDetailRow[]
  ) => {
    setCustomDetailsMap(prevMap => {
      const newMap = { ...prevMap, [reportKey]: details };
      persistChanges(data, newMap);
      return newMap;
    });
  }, [data, persistChanges]);

  // Tiếp nhận báo cáo
  const acceptReport = useCallback((
    reportKey: string,
    details: ReconciliationDetailRow[]
  ) => {
    setData(prev => {
      const updatedData = prev.map(item => {
        if (item.key === reportKey) {
          return { ...item, trangThai: 'DA_TIEP_NHAN' as TrangThaiTep };
        }
        return item;
      });
      
      setCustomDetailsMap(prevMap => {
        const updatedDetails = details.map(d => ({ ...d, trangThai: 'DA_TIEP_NHAN' as TrangThaiTep }));
        const newMap = { ...prevMap, [reportKey]: updatedDetails };
        persistChanges(updatedData, newMap);
        return newMap;
      });
      
      return updatedData;
    });
  }, [persistChanges]);
  
  // Từ chối báo cáo (Chuyển trạng thái về TAO_MOI hoặc TRẢ VỀ)
  const rejectReport = useCallback((reportKey: string) => {
    setData(prev => {
      const updatedData = prev.map(item => {
        if (item.key === reportKey) {
          return { ...item, trangThai: 'TAO_MOI' as TrangThaiTep }; // Đẩy về TCTD làm lại
        }
        return item;
      });
      
      setCustomDetailsMap(prevMap => {
        const currentDetails = prevMap[reportKey] || [];
        const updatedDetails = currentDetails.map(d => ({ ...d, trangThai: 'TAO_MOI' as TrangThaiTep }));
        const newMap = { ...prevMap, [reportKey]: updatedDetails };
        persistChanges(updatedData, newMap);
        return newMap;
      });
      
      // Xóa khỏi danh sách submittedData hiện tại trên giao diện
      return updatedData.filter(item => item.key !== reportKey);
    });
  }, [persistChanges]);

  return {
    data,
    customDetailsMap,
    isLoaded,
    handleCellEdit,
    saveReportChanges,
    acceptReport,
    rejectReport
  };
};
