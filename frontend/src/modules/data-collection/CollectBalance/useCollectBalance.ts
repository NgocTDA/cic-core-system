import { useState, useEffect, useCallback } from 'react';
import {
  BalanceReport,
  ReconciliationDetailRow,
  TrangThaiTep,
  CicMetaMap,
  ReportProcessingMeta,
  ProcessingAction,
  ProcessingHistoryEntry,
} from './types';
import { INITIAL_DATA, generateTreeReconciliationData } from '@/modules/web-portal/SendBalance/mockData';
import {
  PORTAL_KEYS,
  CIC_KEYS,
  readJSON,
  writeJSON,
  syncStatusToPortal,
  useBalanceSyncListener,
} from '@/modules/web-portal/SendBalance/balanceSync';

// Cán bộ đang đăng nhập (prototype — chưa gắn auth thật)
const CURRENT_ACTOR = 'Cán bộ CIC';

// Các trạng thái mà CIC giữ trong hàng đợi xử lý
const CIC_INBOX_STATUSES: TrangThaiTep[] = ['DA_GUI_CIC', 'DANG_KIEM_TRA', 'DA_TIEP_NHAN'];

const nowStamp = (): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const makeHistoryEntry = (
  action: ProcessingAction,
  reason?: string
): ProcessingHistoryEntry => ({
  action,
  timestamp: nowStamp(),
  actor: CURRENT_ACTOR,
  reason,
});

const seedDetails = (report: BalanceReport): ReconciliationDetailRow[] => {
  const parentRow = generateTreeReconciliationData([report]).find(item => item.isParent);
  return parentRow?.children ? [...parentRow.children] : [];
};

export const useCollectBalance = () => {
  const [data, setData] = useState<BalanceReport[]>([]);
  const [customDetailsMap, setCustomDetailsMap] = useState<Record<string, ReconciliationDetailRow[]>>({});
  const [metaMap, setMetaMap] = useState<CicMetaMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Ghi riêng 3 key CIC (không đụng store Portal)
  const persistCic = useCallback((
    inbox: BalanceReport[],
    details: Record<string, ReconciliationDetailRow[]>,
    meta: CicMetaMap
  ) => {
    writeJSON(CIC_KEYS.inbox, inbox);
    writeJSON(CIC_KEYS.details, details);
    writeJSON(CIC_KEYS.meta, meta);
  }, []);

  // Đọc store Portal + hợp nhất vào inbox CIC
  const loadFromStores = useCallback(() => {
    // Nguồn báo cáo: store Portal (fallback INITIAL_DATA cho lần đầu)
    const portalReports = readJSON<BalanceReport[]>(PORTAL_KEYS.reports, INITIAL_DATA);
    const portalByKey = new Map(portalReports.map(r => [r.key, r]));

    const prevInbox = readJSON<BalanceReport[]>(CIC_KEYS.inbox, []);
    const prevDetails = readJSON<Record<string, ReconciliationDetailRow[]>>(CIC_KEYS.details, {});
    const prevMeta = readJSON<CicMetaMap>(CIC_KEYS.meta, {});

    const inboxByKey = new Map(prevInbox.map(r => [r.key, r]));
    const nextDetails = { ...prevDetails };
    const nextMeta: CicMetaMap = { ...prevMeta };

    // 1. Tiếp nhận report mới gửi (DA_GUI_CIC) chưa có trong inbox
    portalReports
      .filter(r => r.trangThai === 'DA_GUI_CIC' && !inboxByKey.has(r.key))
      .forEach(r => {
        inboxByKey.set(r.key, r);
        if (!nextDetails[r.key]) {
          nextDetails[r.key] = seedDetails(r);
        }
        const existing = nextMeta[r.key]?.history ?? [];
        nextMeta[r.key] = {
          ...(nextMeta[r.key] ?? { history: [] }),
          history: [...existing, makeHistoryEntry('RECEIVED')],
        };
      });

    // 2. Đồng bộ trạng thái Portal cho các report đã có; loại bỏ
    //    những report không còn ở trạng thái CIC quan tâm.
    const merged: BalanceReport[] = [];
    inboxByKey.forEach((report, key) => {
      const portal = portalByKey.get(key);
      // Report đã bị Portal xóa → bỏ khỏi inbox
      if (!portal) return;
      if (CIC_INBOX_STATUSES.includes(portal.trangThai)) {
        merged.push({ ...report, ...portal });
      }
      // YEU_CAU_SUA / TAO_MOI (đã trả về TCTD) → loại khỏi inbox CIC
    });

    merged.sort((a, b) => parseInt(a.key, 10) - parseInt(b.key, 10));
    const reindexed = merged.map((item, idx) => ({ ...item, stt: idx + 1 }));

    setData(reindexed);
    setCustomDetailsMap(nextDetails);
    setMetaMap(nextMeta);
    persistCic(reindexed, nextDetails, nextMeta);
    setIsLoaded(true);
  }, [persistCic]);

  useEffect(() => {
    loadFromStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useBalanceSyncListener(loadFromStores, [loadFromStores]);

  const getMeta = useCallback(
    (reportKey: string): ReportProcessingMeta =>
      metaMap[reportKey] ?? { history: [] },
    [metaMap]
  );

  // Helper: cập nhật trạng thái 1 report trong inbox + ghi sử + sync Portal
  const transitionStatus = useCallback((
    reportKey: string,
    newStatus: TrangThaiTep,
    action: ProcessingAction,
    opts?: { reason?: string; removeFromInbox?: boolean; metaPatch?: Partial<ReportProcessingMeta> }
  ) => {
    setData(prevData => {
      let nextData: BalanceReport[];
      if (opts?.removeFromInbox) {
        nextData = prevData
          .filter(item => item.key !== reportKey)
          .map((item, idx) => ({ ...item, stt: idx + 1 }));
      } else {
        nextData = prevData.map(item =>
          item.key === reportKey ? { ...item, trangThai: newStatus } : item
        );
      }

      setMetaMap(prevMeta => {
        const current = prevMeta[reportKey] ?? { history: [] };
        const newMeta: CicMetaMap = {
          ...prevMeta,
          [reportKey]: {
            ...current,
            ...(opts?.metaPatch ?? {}),
            history: [...current.history, makeHistoryEntry(action, opts?.reason)],
          },
        };

        setCustomDetailsMap(prevDetails => {
          const newDetails = { ...prevDetails };
          if (opts?.removeFromInbox) delete newDetails[reportKey];
          persistCic(nextData, newDetails, newMeta);
          return newDetails;
        });
        return newMeta;
      });

      syncStatusToPortal(reportKey, newStatus, opts?.reason ? { lyDoTuChoi: opts.reason } : undefined);
      return nextData;
    });
  }, [persistCic]);

  // Cán bộ lưu thay đổi số liệu (sửa hộ, chưa kiểm tra)
  const saveReportChanges = useCallback((
    reportKey: string,
    details: ReconciliationDetailRow[],
    editedFields?: Record<string, string[]>
  ) => {
    setCustomDetailsMap(prevDetails => {
      const newDetails = { ...prevDetails, [reportKey]: details };
      setMetaMap(prevMeta => {
        const current = prevMeta[reportKey] ?? { history: [] };
        const newMeta: CicMetaMap = {
          ...prevMeta,
          [reportKey]: {
            ...current,
            editedBy: CURRENT_ACTOR,
            editedFields: editedFields ?? current.editedFields,
            history: [...current.history, makeHistoryEntry('EDITED')],
          },
        };
        persistCic(data, newDetails, newMeta);
        return newMeta;
      });
      return newDetails;
    });
  }, [data, persistCic]);

  // Bắt đầu kiểm tra → DANG_KIEM_TRA (khóa chỉnh sửa)
  const startReview = useCallback((reportKey: string) => {
    transitionStatus(reportKey, 'DANG_KIEM_TRA', 'REVIEW_STARTED');
  }, [transitionStatus]);

  // Mở lại để sửa → DA_GUI_CIC (gỡ khóa)
  const reopenReview = useCallback((reportKey: string) => {
    transitionStatus(reportKey, 'DA_GUI_CIC', 'REVIEW_REOPENED');
  }, [transitionStatus]);

  // Tiếp nhận (kiểm tra đạt) → DA_TIEP_NHAN + đồng bộ ngược Portal
  const acceptReport = useCallback((
    reportKey: string,
    details: ReconciliationDetailRow[],
    editedFields?: Record<string, string[]>
  ) => {
    const finalDetails = details.map(d => ({ ...d, trangThai: 'DA_TIEP_NHAN' as TrangThaiTep }));
    setCustomDetailsMap(prev => ({ ...prev, [reportKey]: finalDetails }));
    transitionStatus(reportKey, 'DA_TIEP_NHAN', 'ACCEPTED', {
      metaPatch: { acceptedAt: nowStamp(), editedFields },
    });
  }, [transitionStatus]);

  // Yêu cầu TCTD sửa → trả về YEU_CAU_SUA kèm lý do, loại khỏi inbox
  const requestRevision = useCallback((reportKey: string, reason: string) => {
    transitionStatus(reportKey, 'YEU_CAU_SUA', 'REVISION_REQUESTED', {
      reason,
      removeFromInbox: true,
      metaPatch: { rejectReason: reason },
    });
  }, [transitionStatus]);

  return {
    data,
    customDetailsMap,
    metaMap,
    isLoaded,
    getMeta,
    saveReportChanges,
    startReview,
    reopenReview,
    acceptReport,
    requestRevision,
  };
};
