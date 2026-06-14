import { useState, useEffect, useCallback, useRef } from 'react';
import { BalanceReport, ReconciliationDetailRow, TrangThaiTep } from './types';
import { INITIAL_DATA, generateTreeReconciliationData, RAW_FILE_RULES, getLoaiToChucByMaDauMoi } from './mockData';
import {
  PORTAL_KEYS,
  readJSON,
  writeJSON,
  emitBalanceSync,
  useBalanceSyncListener,
} from './balanceSync';

export const useSendBalance = () => {
  const [data, setData] = useState<BalanceReport[]>(INITIAL_DATA);
  const [customDetailsMap, setCustomDetailsMap] = useState<Record<string, ReconciliationDetailRow[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  // Chặn vòng lặp: bỏ qua đúng một lần emit do chính effect save phát ra
  const skipNextSyncRef = useRef(false);

  // Đọc store Portal (dùng chung cho mount + mỗi sync event)
  const loadFromStorage = useCallback(() => {
    const loadedData = readJSON<BalanceReport[]>(PORTAL_KEYS.reports, []);
    let parsedData = INITIAL_DATA;
    if (Array.isArray(loadedData) && loadedData.length > 0) {
      const loadedKeys = new Set(loadedData.map(x => String(x.key)));
      const missing = INITIAL_DATA.filter(item => !loadedKeys.has(String(item.key)));
      if (missing.length > 0) {
        parsedData = [...loadedData, ...missing].sort((a, b) => parseInt(a.key, 10) - parseInt(b.key, 10));
        parsedData = parsedData.map((item, idx) => ({ ...item, stt: idx + 1 }));
      } else {
        parsedData = loadedData;
      }
    }
    setData(parsedData);
    setCustomDetailsMap(readJSON<Record<string, ReconciliationDetailRow[]>>(PORTAL_KEYS.details, {}));
    setIsLoaded(true);
  }, []);

  // Load on mount (client-side only)
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Reload khi CIC (hoặc tab khác) cập nhật trạng thái
  useBalanceSyncListener(() => {
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }
    loadFromStorage();
  }, [loadFromStorage]);

  // Save to localStorage when state changes (only after initial load has finished)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      writeJSON(PORTAL_KEYS.reports, data);
      writeJSON(PORTAL_KEYS.details, customDetailsMap);
      // Báo cho phía CIC (cùng tab) cập nhật inbox live; tự bỏ qua
      // lần emit này ở listener của chính Portal.
      skipNextSyncRef.current = true;
      emitBalanceSync();
    }
  }, [data, customDetailsMap, isLoaded]);

  // Sinh dòng dữ liệu chi tiết rỗng
  const generateEmptyDetails = useCallback((loaiFile: string, maDauMoi: string): ReconciliationDetailRow[] => {
    const rule = RAW_FILE_RULES.find(r => r.loaiFile === loaiFile);
    if (!rule) return [];

    const subRows: ReconciliationDetailRow[] = [];
    let keyIdx = 1;
    const isNoDetails = ['D10', 'D11', 'D12', 'D20', 'D40', 'D60', 'D70'].includes(rule.loaiFile);
    const operations = isNoDetails ? [rule.loaiFile] : rule.nghiepVuRaw.split('/');

    operations.forEach(op => {
      const hasCurrency = rule.maTienTeRule !== null;
      const currencies = hasCurrency ? ['VND'] : [null];

      currencies.forEach(currency => {
        subRows.push({
          key: `edit_child_${keyIdx++}`,
          loaiFile: rule.loaiFile,
          tenTep: '',
          nghiepVu: op,
          nguonDuLieu: getLoaiToChucByMaDauMoi(maDauMoi),

          soLuongKhachHang: null,
          soLuongKhachHangRule: rule.soLuongKhachHangRule,
          soLuongHopDong: null,
          soLuongHopDongRule: rule.soLuongHopDongRule,

          maTienTe: currency,
          maTienTeRule: rule.maTienTeRule,

          nhomNo: null,
          nhomNoRule: null,

          duNo: null,
          duNoRule: rule.duNoRule,

          tongDuNo: null,
          tongDuNoRule: rule.tongDuNoRule,

          phatSinhGiaiNgan: null,
          phatSinhGiaiNganRule: rule.phatSinhGiaiNganRule,

          phatSinhTraNo: null,
          phatSinhTraNoRule: rule.phatSinhTraNoRule,

          tongGiaTriBaoDam: null,
          tongGiaTriBaoDamRule: rule.tongGiaTriBaoDamRule,

          giaTriBaoDamKhoanVay: null,
          giaTriBaoDamKhoanVayRule: rule.giaTriBaoDamKhoanVayRule,

          doanhSoGiamNo: null,
          doanhSoGiamNoRule: rule.doanhSoGiamNoRule,

          duPhongPhaiTrich: null,
          duPhongPhaiTrichRule: rule.duPhongPhaiTrichRule,

          duPhongDaTrich: null,
          duPhongDaTrichRule: rule.duPhongDaTrichRule,

          parentKey: '',
          ngayBaoCao: '',
          trangThai: 'TAO_MOI',
          moTaTep: '',
          maDauMoi: maDauMoi,
          isParent: false
        });
      });
    });

    return subRows;
  }, []);

  // Thay đổi giá trị của ô đối chiếu trong list
  const handleCellEdit = useCallback((
    rowKey: string,
    dataIndex: keyof ReconciliationDetailRow,
    value: any
  ) => {
    if (rowKey.startsWith('parent_')) {
      const parentKey = rowKey.replace('parent_', '');
      setData(prev => prev.map(item => {
        if (item.key === parentKey) {
          let reportField: keyof BalanceReport | null = null;
          if (dataIndex === 'tenTep') reportField = 'tenTep';
          if (dataIndex === 'maDauMoi') reportField = 'maDauMoi';
          if (dataIndex === 'ngayBaoCao') reportField = 'ngayBaoCao';
          if (dataIndex === 'loaiFile') reportField = 'phanLoaiTep';
          if (dataIndex === 'trangThai') reportField = 'trangThai';

          if (reportField) {
            return { ...item, [reportField]: value };
          }
        }
        return item;
      }));
    } else {
      const parts = rowKey.split('_');
      let foundParentKey = '';
      
      // key có định dạng child_${parentKey}_${idx}
      if (parts[0] === 'child' && parts[1]) {
        foundParentKey = parts[1];
      }

      if (foundParentKey) {
        setCustomDetailsMap(prevMap => {
          let currentChildren = prevMap[foundParentKey];
          if (!currentChildren) {
            // Nếu chưa lưu trong map, lấy từ cấu trúc treeData
            const parentRow = generateTreeReconciliationData(data).find(item => item.parentKey === foundParentKey && item.isParent);
            currentChildren = parentRow?.children ? [...parentRow.children] : [];
          }
          const updatedChildren = currentChildren.map(child => {
            if (child.key === rowKey) {
              return { ...child, [dataIndex]: value };
            }
            return child;
          });
          return { ...prevMap, [foundParentKey]: updatedChildren };
        });
      }
    }
  }, [data]);

  // Lưu báo cáo mới hoặc cập nhật báo cáo hiện có
  const saveReport = useCallback((
    report: Omit<BalanceReport, 'stt' | 'key'> & { key?: string },
    details: ReconciliationDetailRow[],
    isDraft: boolean
  ) => {
    const targetStatus: TrangThaiTep = isDraft ? 'TAO_MOI' : 'DA_GUI_CIC';
    
    // Lấy thời gian hiện tại
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const formattedNow = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    let savedReportKey = '';

    setData(prev => {
      let updatedData = [...prev];
      if (report.key) {
        // Cập nhật bản ghi hiện tại
        savedReportKey = report.key;
        updatedData = updatedData.map(item => {
          if (item.key === report.key) {
            return {
              ...item,
              ngayGui: isDraft ? item.ngayGui : formattedNow,
              tenTep: report.tenTep.trim(),
              trangThai: targetStatus,
              maDauMoi: report.maDauMoi,
              phanLoaiTep: report.phanLoaiTep,
              ngayBaoCao: report.ngayBaoCao,
              // Gửi lại / lưu nháp → xóa lý do yêu cầu sửa cũ
              lyDoTuChoi: undefined,
            };
          }
          return item;
        });
      } else {
        // Tạo bản ghi mới
        const maxKeyNum = prev.length > 0 ? Math.max(...prev.map(r => parseInt(r.key, 10))) : 0;
        const newKey = String(maxKeyNum + 1);
        savedReportKey = newKey;
        const newReport: BalanceReport = {
          key: newKey,
          stt: prev.length + 1,
          ngayBaoCao: report.ngayBaoCao,
          ngayGui: isDraft ? '-' : formattedNow,
          tenTep: report.tenTep.trim(),
          phanLoaiTep: report.phanLoaiTep,
          moTaTep: report.moTaTep || `Báo cáo cân đối thông tin tín dụng loại ${report.phanLoaiTep}`,
          trangThai: targetStatus,
          maDauMoi: report.maDauMoi
        };
        updatedData = [newReport, ...updatedData].map((item, idx) => ({ ...item, stt: idx + 1 }));
      }

      // Cập nhật map chi tiết đối soát
      setCustomDetailsMap(prevMap => ({
        ...prevMap,
        [savedReportKey]: details.map((row, index) => ({
          ...row,
          key: `child_${savedReportKey}_${index + 1}`,
          parentKey: savedReportKey,
          tenTep: report.tenTep.trim(),
          ngayBaoCao: report.ngayBaoCao,
          trangThai: targetStatus,
          maDauMoi: report.maDauMoi
        }))
      }));

      return updatedData;
    });

    return savedReportKey;
  }, []);

  // Xóa báo cáo
  const deleteReport = useCallback((key: string) => {
    setData(prev => {
      const filtered = prev.filter(item => item.key !== key);
      return filtered.map((item, idx) => ({ ...item, stt: idx + 1 }));
    });
    setCustomDetailsMap(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Thu hồi báo cáo (chuyển sang Tạo mới)
  const revokeReport = useCallback((key: string) => {
    setData(prev => prev.map(item => {
      if (item.key === key) {
        return { ...item, trangThai: 'TAO_MOI' as const };
      }
      return item;
    }));
    setCustomDetailsMap(prev => {
      const next = { ...prev };
      if (next[key]) {
        next[key] = next[key].map(child => ({ ...child, trangThai: 'TAO_MOI' as const }));
      }
      return next;
    });
  }, []);

  return {
    data,
    customDetailsMap,
    isLoaded,
    saveReport,
    deleteReport,
    revokeReport,
    generateEmptyDetails,
    handleCellEdit
  };
};
