// ============================================================
//  Balance Sync — lớp đồng bộ trạng thái giữa hai phía
//  Portal (gửi báo cáo) ↔ CIC (tiếp nhận báo cáo)
//
//  Portal sở hữu store gốc (send_balance_reports). CIC có
//  namespace riêng. Thứ duy nhất ghi ngược về Portal là TRẠNG
//  THÁI (+ lý do từ chối), thông qua syncStatusToPortal() —
//  điểm ghi chéo store duy nhất.
// ============================================================

import { useEffect } from 'react';
import { BalanceReport, ReconciliationDetailRow, TrangThaiTep } from './types';

// ─── KEYS ────────────────────────────────────────────────────

export const PORTAL_KEYS = {
  reports: 'send_balance_reports',
  details: 'send_balance_details_map',
} as const;

export const CIC_KEYS = {
  inbox: 'cic_balance_inbox',
  details: 'cic_balance_details_map',
  meta: 'cic_balance_meta',
} as const;

const ALL_KEYS: string[] = [
  PORTAL_KEYS.reports,
  PORTAL_KEYS.details,
  CIC_KEYS.inbox,
  CIC_KEYS.details,
  CIC_KEYS.meta,
];

export const BALANCE_SYNC_EVENT = 'balance:sync';

// ─── localStorage helpers (guarded) ──────────────────────────

export const readJSON = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`balanceSync: lỗi đọc key "${key}":`, e);
    return fallback;
  }
};

export const writeJSON = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`balanceSync: lỗi ghi key "${key}":`, e);
  }
};

// ─── Event emit + listener ───────────────────────────────────

export const emitBalanceSync = (): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(BALANCE_SYNC_EVENT));
};

/**
 * Lắng nghe đồng bộ: CustomEvent cùng tab + native `storage` khác tab.
 * `onSync` nên được bọc useCallback ở phía gọi để cleanup ổn định.
 */
export const useBalanceSyncListener = (
  onSync: () => void,
  deps: React.DependencyList = []
): void => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCustom = () => onSync();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === null || ALL_KEYS.includes(e.key)) onSync();
    };

    window.addEventListener(BALANCE_SYNC_EVENT, handleCustom);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(BALANCE_SYNC_EVENT, handleCustom);
      window.removeEventListener('storage', handleStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

// ─── Ghi trạng thái ngược về store Portal ────────────────────

/**
 * Điểm ghi chéo store DUY NHẤT. CIC gọi hàm này khi tiếp nhận /
 * từ chối để cập nhật trạng thái báo cáo bên store Portal, đồng
 * thời mirror trạng thái xuống các dòng chi tiết nếu có.
 */
export const syncStatusToPortal = (
  reportKey: string,
  newStatus: TrangThaiTep,
  opts?: { lyDoTuChoi?: string }
): void => {
  const reports = readJSON<BalanceReport[]>(PORTAL_KEYS.reports, []);
  const updatedReports = reports.map(item => {
    if (item.key !== reportKey) return item;
    return {
      ...item,
      trangThai: newStatus,
      lyDoTuChoi: opts?.lyDoTuChoi ?? undefined,
    };
  });
  writeJSON(PORTAL_KEYS.reports, updatedReports);

  // Mirror trạng thái xuống dòng chi tiết của Portal (nếu đã lưu)
  const detailsMap = readJSON<Record<string, ReconciliationDetailRow[]>>(
    PORTAL_KEYS.details,
    {}
  );
  if (detailsMap[reportKey]) {
    detailsMap[reportKey] = detailsMap[reportKey].map(row => ({
      ...row,
      trangThai: newStatus,
    }));
    writeJSON(PORTAL_KEYS.details, detailsMap);
  }

  emitBalanceSync();
};
